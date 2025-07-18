import fs from 'fs';
import path from 'path';

async function checkForDuplicates() {
  try {
    console.log('🔍 Checking finale-distinct.json for duplicate ramz_id...');
    
    // Read the JSON file
    const jsonPath = path.join(process.cwd(), 'data', 'finale-data', 'finale-distinct.json');
    
    if (!fs.existsSync(jsonPath)) {
      console.error('❌ finale-distinct.json not found!');
      return;
    }
    
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const records = JSON.parse(rawData);
    
    console.log(`📊 Total records in finale-distinct.json: ${records.length}`);
    
    // Track ramz_id occurrences
    const ramzIdCounts = {};
    const duplicates = [];
    const missingRamzId = [];
    
    records.forEach((record, index) => {
      const ramzId = record.ramz_id;
      
      if (!ramzId || ramzId === '' || ramzId === null || ramzId === undefined) {
        missingRamzId.push({
          index,
          record: {
            ramz_code: record.ramz_code,
            university_name: record.university_name,
            table_specialization: record.table_specialization
          }
        });
        return;
      }
      
      if (ramzIdCounts[ramzId]) {
        ramzIdCounts[ramzId]++;
        duplicates.push({
          ramzId,
          index,
          count: ramzIdCounts[ramzId],
          record: {
            ramz_code: record.ramz_code,
            university_name: record.university_name,
            table_specialization: record.table_specialization,
            table_institution: record.table_institution
          }
        });
      } else {
        ramzIdCounts[ramzId] = 1;
      }
    });
    
    // Results
    console.log('\n📈 Analysis Results:');
    console.log(`✅ Unique ramz_id entries: ${Object.keys(ramzIdCounts).length}`);
    console.log(`❌ Duplicate ramz_id entries: ${duplicates.length}`);
    console.log(`⚠️  Missing ramz_id entries: ${missingRamzId.length}`);
    
    // Show duplicates if any
    if (duplicates.length > 0) {
      console.log('\n🚨 DUPLICATE RAMZ_ID FOUND:');
      console.log('=====================================');
      
      const duplicateGroups = {};
      duplicates.forEach(dup => {
        if (!duplicateGroups[dup.ramzId]) {
          duplicateGroups[dup.ramzId] = [];
        }
        duplicateGroups[dup.ramzId].push(dup);
      });
      
      Object.keys(duplicateGroups).forEach(ramzId => {
        console.log(`\n🔴 ramz_id: ${ramzId} (${ramzIdCounts[ramzId]} occurrences)`);
        duplicateGroups[ramzId].forEach(dup => {
          console.log(`   📍 Index ${dup.index}: ${dup.record.table_specialization} - ${dup.record.table_institution}`);
        });
      });
      
      console.log('\n⚠️  ACTION REQUIRED: Duplicates found! The deduplication process needs to be re-run.');
    } else {
      console.log('\n✅ SUCCESS: No duplicate ramz_id entries found!');
      console.log('🎯 The finale-distinct.json file is clean and ready to use.');
    }
    
    // Show missing ramz_id if any
    if (missingRamzId.length > 0) {
      console.log('\n⚠️  MISSING RAMZ_ID ENTRIES:');
      console.log('============================');
      missingRamzId.slice(0, 10).forEach(missing => {
        console.log(`📍 Index ${missing.index}: ${missing.record.table_specialization} - ${missing.record.university_name}`);
      });
      if (missingRamzId.length > 10) {
        console.log(`... and ${missingRamzId.length - 10} more entries with missing ramz_id`);
      }
    }
    
    // Validation statistics
    console.log('\n📊 Validation Statistics:');
    console.log(`Total records: ${records.length}`);
    console.log(`Valid ramz_id: ${Object.keys(ramzIdCounts).length}`);
    console.log(`Missing ramz_id: ${missingRamzId.length}`);
    console.log(`Duplicates: ${duplicates.length}`);
    console.log(`Data integrity: ${duplicates.length === 0 ? '✅ PASSED' : '❌ FAILED'}`);
    
    // Quick sample check
    console.log('\n🔍 Sample ramz_id values:');
    const sampleRamzIds = Object.keys(ramzIdCounts).slice(0, 5);
    sampleRamzIds.forEach(ramzId => {
      console.log(`   ${ramzId} (appears ${ramzIdCounts[ramzId]} time${ramzIdCounts[ramzId] > 1 ? 's' : ''})`);
    });
    
  } catch (error) {
    console.error('💥 Error checking for duplicates:', error);
  }
}

checkForDuplicates();
