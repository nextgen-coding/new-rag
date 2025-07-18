import { PrismaClient } from '@prisma/client';
import { azure } from '@ai-sdk/azure';
import { embed } from 'ai';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Configure Azure OpenAI for embeddings using the azure provider
const model = azure.embedding('text-embedding-ada-002', {
  resourceName: process.env.AZURE_RESOURCE_NAME,
  apiKey: process.env.AZURE_API_KEY,
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
  const parts = [
    record.table_specialization,
    record.table_institution,
    record.table_location,
    record.field_of_study,
    record.bac_type_name,
    record.university_name,
  ].filter(Boolean);
  
  return parts.join(' - ');
}

function normalizeRecord(record) {
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

async function importTestData() {
  try {
    console.log('Reading finale-plus.json data...');
    const dataPath = path.join(process.cwd(), 'data', 'finale-data', 'finale-plus.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const records = JSON.parse(rawData);
    
    // Take only first 20 records for testing
    const testRecords = records.slice(0, 20);
    console.log(`Processing ${testRecords.length} test records`);
    
    let processed = 0;
    
    for (const record of testRecords) {
      const normalized = normalizeRecord(record);
      
      console.log(`Processing: ${normalized.diplome} at ${normalized.institution}`);
      
      // Generate embedding
      const embedding = await generateEmbedding(normalized.raw_text);
      
      if (!embedding) {
        console.warn('Failed to generate embedding, skipping record');
        continue;
      }
      
      // Insert into database
      try {
        await prisma.$executeRaw`
          INSERT INTO university_programs (
            universite, gouvernorat, institution, filiere, diplome, specialite, parcours,
            section_bac, moyenne_bac, moyenne_tc, nombre_bacheliers, nombre_places, 
            nombre_selectionnes, rang_dernier_appele, rang_dernier_place, raw_text, embedding
          ) VALUES (
            ${normalized.universite}, ${normalized.gouvernorat}, ${normalized.institution}, 
            ${normalized.filiere}, ${normalized.diplome}, ${normalized.specialite}, ${normalized.parcours},
            ${normalized.section_bac}, ${normalized.moyenne_bac}, ${normalized.moyenne_tc}, 
            ${normalized.nombre_bacheliers}, ${normalized.nombre_places}, ${normalized.nombre_selectionnes},
            ${normalized.rang_dernier_appele}, ${normalized.rang_dernier_place}, ${normalized.raw_text},
            ${'[' + embedding.join(',') + ']'}::vector
          )
        `;
        
        processed++;
        console.log(`✓ Inserted record ${processed}/${testRecords.length}`);
      } catch (error) {
        console.error('Error inserting record:', error);
      }
      
      // Add small delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\n✅ Import completed! Processed ${processed} records total.`);
    
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importTestData();
