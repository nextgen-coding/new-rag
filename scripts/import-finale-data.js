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
    console.log('Starting comprehensive finale-plus data import...');
    
    // Read the finale-plus.json file
    const dataPath = path.join(process.cwd(), 'data', 'finale-data', 'finale-plus.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const records = JSON.parse(rawData);
    
    console.log(`Found ${records.length} records to import`);
    
    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.universityProgram.deleteMany();
    
    // Process and insert in batches
    const BATCH_SIZE = 100;
    let totalInserted = 0;
    let skipped = 0;
    
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(records.length / BATCH_SIZE);
      
      console.log(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} records)...`);
      
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
          console.warn(`Error processing record ${record.ramz_id}:`, error.message);
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
          console.log(`Inserted ${processedBatch.length} records. Total: ${totalInserted}`);
        } catch (error) {
          console.error(`Error inserting batch ${batchNumber}:`, error.message);
          
          // Try inserting one by one for this batch
          console.log('Trying individual inserts for failed batch...');
          for (const record of processedBatch) {
            try {
              await prisma.universityProgram.create({ data: record });
              totalInserted++;
            } catch (individualError) {
              console.warn(`Skipped record ${record.program_id}:`, individualError.message);
              skipped++;
            }
          }
        }
      }
      
      // Progress update
      if (batchNumber % 5 === 0) {
        console.log(`Progress: ${totalInserted} inserted, ${skipped} skipped`);
      }
    }
    
    // Final statistics
    console.log('\nImport Summary:');
    console.log(`Successfully imported: ${totalInserted} records`);
    console.log(`Skipped: ${skipped} records`);
    console.log(`Total processed: ${records.length} records`);
    
    // Get some statistics from the imported data
    const stats = await prisma.universityProgram.groupBy({
      by: ['university_name'],
      _count: { _all: true },
      orderBy: { _count: { _all: 'desc' } },
      take: 10,
    });
    
    console.log('\nTop 10 Universities by Program Count:');
    stats.forEach((stat, index) => {
      console.log(`${index + 1}. ${stat.university_name}: ${stat._count._all} programs`);
    });
    
    // Test search functionality
    console.log('\nTesting search functionality...');
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
      
      console.log(`"${searchTerm}": Found ${results.length} results`);
      if (results.length > 0) {
        results.forEach(result => {
          console.log(`   - ${result.specialization} at ${result.institution} (Score: ${result.latest_score || 'N/A'})`);
        });
      }
    }
    
    console.log('\nData import completed successfully!');
    
  } catch (error) {
    console.error('Error during import:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importFinaleData();
