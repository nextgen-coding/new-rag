import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function checkAndImportData() {
  try {
    // Check current count
    const currentCount = await prisma.universityProgram.count();
    console.log(`Current records in database: ${currentCount}`);
    
    // Read the finale-plus.json file
    const dataPath = path.join(process.cwd(), 'data', 'finale-data', 'finale-plus.json');
    import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

function calculateLatestScore(historicalScores) {
  if (!historicalScores || typeof historicalScores !== 'object') {
    return { latestScore: null, latestYear: null };
  }
  
  const years = Object.keys(historicalScores).sort().reverse();
  
  for (const year of years) {
    const score = historicalScores[year];
    if (score && score > 0) {
      return { latestScore: score, latestYear: year };
    }
  }
  
  return { latestScore: null, latestYear: null };
}

function calculateAverageScore(historicalScores) {
  if (!historicalScores || typeof historicalScores !== 'object') {
    return null;
  }
  
  const validScores = Object.values(historicalScores).filter(score => score && score > 0);
  
  if (validScores.length === 0) {
    return null;
  }
  
  const sum = validScores.reduce((acc, score) => acc + score, 0);
  return Math.round((sum / validScores.length) * 100) / 100; // Round to 2 decimal places
}

function createSearchableText(record) {
  const parts = [
    record.university_name,
    record.table_institution,
    record.table_location,
    record.table_specialization,
    record.field_of_study,
    record.bac_type_name,
    record.table_criteria,
  ].filter(Boolean);
  
  return parts.join(' - ');
}

function transformRecord(record) {
  const { latestScore, latestYear } = calculateLatestScore(record.historical_scores);
  const averageScore = calculateAverageScore(record.historical_scores);
  
  return {
    program_code: record.ramz_code || '',
    program_id: record.ramz_id || '',
    program_link: record.ramz_link || '',
    university_id: record.university_id || '',
    university_name: record.university_name || '',
    institution: record.table_institution || '',
    location: record.table_location || '',
    specialization: record.table_specialization || '',
    field_of_study: record.field_of_study || '',
    criteria: record.table_criteria || null,
    bac_type_id: record.bac_type_id || '',
    bac_type_name: record.bac_type_name || '',
    seven_percent: record.seven_percent || null,
    historical_scores: record.historical_scores || null,
    latest_score: latestScore,
    latest_year: latestYear,
    average_score: averageScore,
    raw_text: createSearchableText(record),
  };
}

async function importFinaleData() {
  try {
    console.log('🚀 Starting comprehensive finale-plus data import...');
    
    // Read the finale-plus.json file
    const dataPath = path.join(process.cwd(), 'data', 'finale-data', 'finale-plus.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const records = JSON.parse(rawData);
    
    console.log(`📊 Found ${records.length} records to import`);
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await prisma.universityProgram.deleteMany();
    
    // Process and insert in batches
    const BATCH_SIZE = 100;
    let totalInserted = 0;
    let skipped = 0;
    
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(records.length / BATCH_SIZE);
      
      console.log(`📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} records)...`);
      
      const processedBatch = [];
      
      for (const record of batch) {
        try {
          const transformedRecord = transformRecord(record);
          
          // Skip records without essential data
          if (!transformedRecord.program_id || !transformedRecord.university_name || !transformedRecord.specialization) {
            skipped++;
            continue;
          }
          
          processedBatch.push(transformedRecord);
        } catch (error) {
          console.warn(`⚠️  Error processing record ${record.ramz_id}:`, error.message);
          skipped++;
        }
      }
      
      // Insert batch
      if (processedBatch.length > 0) {
        try {
          await prisma.universityProgram.createMany({
            data: processedBatch,
            skipDuplicates: true,
          });
          
          totalInserted += processedBatch.length;
          console.log(`✅ Inserted ${processedBatch.length} records. Total: ${totalInserted}`);
        } catch (error) {
          console.error(`❌ Error inserting batch ${batchNumber}:`, error.message);
          
          // Try inserting one by one for this batch
          console.log('🔄 Trying individual inserts for failed batch...');
          for (const record of processedBatch) {
            try {
              await prisma.universityProgram.create({ data: record });
              totalInserted++;
            } catch (individualError) {
              console.warn(`⚠️  Skipped record ${record.program_id}:`, individualError.message);
              skipped++;
            }
          }
        }
      }
      
      // Progress update
      if (batchNumber % 5 === 0) {
        console.log(`📈 Progress: ${totalInserted} inserted, ${skipped} skipped`);
      }
    }
    
    // Final statistics
    console.log('📊 Import Summary:');
    console.log(`✅ Successfully imported: ${totalInserted} records`);
    console.log(`⚠️  Skipped: ${skipped} records`);
    console.log(`📁 Total processed: ${records.length} records`);
    
    // Get some statistics from the imported data
    const stats = await prisma.universityProgram.groupBy({
      by: ['university_name'],
      _count: { _all: true },
      orderBy: { _count: { _all: 'desc' } },
      take: 10,
    });
    
    console.log('🏆 Top 10 Universities by Program Count:');
    stats.forEach((stat, index) => {
      console.log(`${index + 1}. ${stat.university_name}: ${stat._count._all} programs`);
    });
    
    // Test search functionality
    console.log('🔍 Testing search functionality...');
    const testSearches = ['هندسة', 'طب', 'آداب', 'رياضيات'];
    
    for (const searchTerm of testSearches) {
      const results = await prisma.universityProgram.findMany({
        where: {
          OR: [
            { raw_text: { contains: searchTerm, mode: 'insensitive' } },
            { specialization: { contains: searchTerm, mode: 'insensitive' } },
            { field_of_study: { contains: searchTerm, mode: 'insensitive' } },
          ]
        },
        take: 3,
      });
      
      console.log(`🔎 
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const records = JSON.parse(rawData);
    
    console.log(`Total records in JSON file: ${records.length}`);
    
    if (currentCount < records.length) {
      console.log('Importing all data without embeddings first...');
      
      // Clear existing data
      await prisma.universityProgram.deleteMany({});
      console.log('Cleared existing data');
      
      // Process and import all records
      let imported = 0;
      const batchSize = 100;
      
      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        
        const processedBatch = batch.map(record => {
          // Get the latest score from historical_scores
          const scores = record.historical_scores || {};
          const years = Object.keys(scores).sort().reverse();
          const latestYear = years[0];
          const latestScore = scores[latestYear];
          
          // Create searchable text
          const searchText = [
            record.table_specialization,
            record.table_institution,
            record.table_location,
            record.field_of_study,
            record.bac_type_name,
            record.university_name,
            record.table_criteria,
          ].filter(Boolean).join(' - ');
          
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
            raw_text: searchText,
          };
        });
        
        // Insert batch
        await prisma.universityProgram.createMany({
          data: processedBatch,
          skipDuplicates: true
        });
        
        imported += processedBatch.length;
        console.log(`Imported batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)} - Total: ${imported}`);
      }
      
      console.log(`✅ Successfully imported ${imported} university programs!`);
    } else {
      console.log('✅ Database already has all records');
    }
    
    // Final count
    const finalCount = await prisma.universityProgram.count();
    console.log(`Final count: ${finalCount} records`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndImportData();
