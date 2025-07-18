import { PrismaClient, Prisma } from '@prisma/client';
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Configure Azure OpenAI for embeddings
const model = openai.embedding('text-embedding-ada-002', {
  apiVersion: '2024-02-01',
  baseURL: `https://${process.env.AZURE_RESOURCE_NAME}.openai.azure.com/openai/deployments/text-embedding-ada-002`,
  headers: {
    'api-key': process.env.AZURE_API_KEY,
  },
});

async function generateEmbedding(text) {
  try {
    const result = await embed({
      model,
      value: text,
    });
    return result.embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    return null;
  }
}

function createSearchableText(record) {
  // Create a comprehensive text representation for search
  const parts = [
    record.table_specialization,
    record.table_institution,
    record.table_location,
    record.field_of_study,
    record.bac_type_name,
    record.university_name,
    record.table_criteria,
  ].filter(Boolean);
  
  return parts.join(' - ');
}

function normalizeRecord(record) {
  // Get the latest score from historical_scores
  const scores = record.historical_scores || {};
  const years = Object.keys(scores).sort().reverse();
  const latestYear = years[0];
  const latestScore = scores[latestYear];
  
  return {
    universite: record.university_name || '',
    gouvernorat: record.table_location || '',
    institution: record.table_institution || '',
    filiere: record.field_of_study || '',
    diplome: record.table_specialization || '',
    specialite: null,
    parcours: null,
    section_bac: record.bac_type_name || '',
    moyenne_bac: latestScore && latestScore > 0 ? latestScore : null,
    moyenne_tc: null,
    nombre_bacheliers: null,
    nombre_places: null,
    nombre_selectionnes: null,
    rang_dernier_appele: null,
    rang_dernier_place: null,
    raw_text: createSearchableText(record),
  };
}

async function importData() {
  try {
    console.log('Reading finale-plus.json data...');
    const dataPath = path.join(process.cwd(), 'data', 'finale-data', 'finale-plus.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const records = JSON.parse(rawData);
    
    console.log(`Found ${records.length} records`);
    
    // Process in batches to avoid overwhelming the API
    const BATCH_SIZE = 10;
    let processed = 0;
    
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);
      console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(records.length / BATCH_SIZE)}`);
      
      const processedBatch = await Promise.all(
        batch.map(async (record) => {
          const normalized = normalizeRecord(record);
          
          // Generate embedding for the searchable text
          console.log(`Generating embedding for: ${normalized.raw_text.substring(0, 100)}...`);
          const embedding = await generateEmbedding(normalized.raw_text);
          
          if (!embedding) {
            console.warn('Failed to generate embedding, skipping record');
            return null;
          }
          
          return {
            ...normalized,
            embedding: `[${embedding.join(',')}]`, // Format as PostgreSQL array
          };
        })
      );
      
      // Filter out failed records
      const validRecords = processedBatch.filter(record => record !== null);
      
        // Insert batch into database
        if (validRecords.length > 0) {
          try {
            for (const record of validRecords) {
              // Insert each record individually to avoid complex SQL formatting
              await prisma.$executeRaw`
                INSERT INTO university_programs (
                  universite, gouvernorat, institution, filiere, diplome, specialite, parcours,
                  section_bac, moyenne_bac, moyenne_tc, nombre_bacheliers, nombre_places, 
                  nombre_selectionnes, rang_dernier_appele, rang_dernier_place, raw_text, embedding
                ) VALUES (
                  ${record.universite}, ${record.gouvernorat}, ${record.institution}, 
                  ${record.filiere}, ${record.diplome}, ${record.specialite}, ${record.parcours},
                  ${record.section_bac}, ${record.moyenne_bac}, ${record.moyenne_tc}, 
                  ${record.nombre_bacheliers}, ${record.nombre_places}, ${record.nombre_selectionnes},
                  ${record.rang_dernier_appele}, ${record.rang_dernier_place}, ${record.raw_text},
                  ${record.embedding}::vector
                )
              `;
            }
            
            processed += validRecords.length;
            console.log(`Inserted ${validRecords.length} records. Total processed: ${processed}`);
          } catch (error) {
            console.error('Error inserting batch:', error);
          }
        }      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log(`Import completed! Processed ${processed} records total.`);
    
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importData();
