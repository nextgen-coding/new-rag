import fs from 'fs';
import path from 'path';

// Function to calculate completeness score for a record
function calculateCompletenessScore(record) {
  let score = 0;
  const fields = [
    'ramz_code', 'ramz_id', 'ramz_link', 'bac_type_id', 'bac_type_name',
    'university_id', 'university_name', 'table_specialization', 'table_institution',
    'table_location', 'table_criteria', 'field_of_study', 'seven_percent'
  ];
  
  // Score for basic fields
  fields.forEach(field => {
    if (record[field] && record[field] !== '' && record[field] !== null) {
      score += 1;
    }
  });
  
  // Score for historical_scores (more weight)
  if (record.historical_scores && typeof record.historical_scores === 'object') {
    const scoreYears = Object.keys(record.historical_scores).length;
    score += scoreYears * 2; // Each year of historical data is worth 2 points
  }
  
  return score;
}

// Function to merge two records, keeping the best data from each
function mergeRecords(record1, record2) {
  const merged = { ...record1 };
  
  // For each field, keep the non-empty value, preferring record2 if both are non-empty
  Object.keys(record2).forEach(key => {
    if (key === 'historical_scores') {
      // Merge historical scores
      if (record1.historical_scores && record2.historical_scores) {
        merged.historical_scores = { ...record1.historical_scores, ...record2.historical_scores };
      } else if (record2.historical_scores) {
        merged.historical_scores = record2.historical_scores;
      }
    } else {
      // For other fields, prefer non-empty values
      if (!record1[key] || record1[key] === '' || record1[key] === null) {
        merged[key] = record2[key];
      } else if (record2[key] && record2[key] !== '' && record2[key] !== null) {
        // If both have values, prefer the longer one
        if (typeof record1[key] === 'string' && typeof record2[key] === 'string') {
          merged[key] = record2[key].length > record1[key].length ? record2[key] : record1[key];
        } else {
          merged[key] = record2[key];
        }
      }
    }
  });
  
  return merged;
}

async function removeDuplicatesAndProcess() {
  try {
    console.log('🔍 Reading finale-plus.json...');
    
    // Read the JSON file
    const jsonPath = path.join(process.cwd(), 'data', 'finale-data', 'finale-plus.json');
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const records = JSON.parse(rawData);
    
    console.log(`📊 Total records: ${records.length}`);
    
    // Group records by ramz_id
    const groupedByRamzId = {};
    let duplicateCount = 0;
    
    records.forEach((record, index) => {
      const ramzId = record.ramz_id;
      
      if (!ramzId) {
        console.warn(`⚠️  Record at index ${index} has no ramz_id`);
        return;
      }
      
      if (groupedByRamzId[ramzId]) {
        duplicateCount++;
        // Merge with existing record
        const existing = groupedByRamzId[ramzId];
        const merged = mergeRecords(existing, record);
        groupedByRamzId[ramzId] = merged;
      } else {
        groupedByRamzId[ramzId] = record;
      }
    });
    
    console.log(`🔄 Found ${duplicateCount} duplicate ramz_id entries`);
    
    // Convert back to array
    const distinctRecords = Object.values(groupedByRamzId);
    
    console.log(`✨ Distinct records: ${distinctRecords.length}`);
    console.log(`🗑️  Removed duplicates: ${records.length - distinctRecords.length}`);
    
    // Sort by ramz_id for consistency
    distinctRecords.sort((a, b) => {
      const aId = parseInt(a.ramz_id) || 0;
      const bId = parseInt(b.ramz_id) || 0;
      return aId - bId;
    });
    
    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'data', 'finale-data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write distinct JSON
    const distinctJsonPath = path.join(outputDir, 'finale-distinct.json');
    fs.writeFileSync(distinctJsonPath, JSON.stringify(distinctRecords, null, 2), 'utf8');
    console.log(`💾 Saved distinct JSON: ${distinctJsonPath}`);
    
    // Convert to CSV
    console.log('📝 Converting to CSV...');
    
    if (distinctRecords.length === 0) {
      console.error('❌ No records to convert to CSV');
      return;
    }
    
    // Get all possible headers
    const headers = new Set();
    distinctRecords.forEach(record => {
      Object.keys(record).forEach(key => {
        if (key !== 'historical_scores') {
          headers.add(key);
        }
      });
    });
    
    // Add historical score headers
    const allYears = new Set();
    distinctRecords.forEach(record => {
      if (record.historical_scores) {
        Object.keys(record.historical_scores).forEach(year => {
          allYears.add(year);
        });
      }
    });
    
    const sortedYears = Array.from(allYears).sort();
    sortedYears.forEach(year => {
      headers.add(`score_${year}`);
    });
    
    const headerArray = Array.from(headers);
    
    // Create CSV content
    let csvContent = headerArray.join(',') + '\\n';
    
    distinctRecords.forEach(record => {
      const row = headerArray.map(header => {
        if (header.startsWith('score_')) {
          const year = header.replace('score_', '');
          const score = record.historical_scores && record.historical_scores[year] ? record.historical_scores[year] : '';
          return `"${score}"`;
        } else {
          const value = record[header] || '';
          // Escape quotes and wrap in quotes if contains comma or quotes
          const escapedValue = String(value).replace(/"/g, '""');
          return `"${escapedValue}"`;
        }
      });
      csvContent += row.join(',') + '\\n';
    });
    
    // Write CSV
    const distinctCsvPath = path.join(outputDir, 'finale-distinct.csv');
    fs.writeFileSync(distinctCsvPath, csvContent, 'utf8');
    console.log(`💾 Saved distinct CSV: ${distinctCsvPath}`);
    
    // Statistics
    console.log('\\n📈 Statistics:');
    console.log(`Original records: ${records.length}`);
    console.log(`Distinct records: ${distinctRecords.length}`);
    console.log(`Duplicates removed: ${records.length - distinctRecords.length}`);
    console.log(`Duplicate percentage: ${((records.length - distinctRecords.length) / records.length * 100).toFixed(2)}%`);
    
    // Sample of duplicate analysis
    console.log('\\n🔍 Sample duplicate analysis:');
    const ramzIds = Object.keys(groupedByRamzId);
    const sampleIds = ramzIds.slice(0, 5);
    
    sampleIds.forEach(ramzId => {
      const count = records.filter(r => r.ramz_id === ramzId).length;
      if (count > 1) {
        console.log(`ramz_id ${ramzId}: ${count} duplicates found and merged`);
      }
    });
    
    console.log('\\n✅ Processing complete!');
    
  } catch (error) {
    console.error('💥 Error processing data:', error);
  }
}

removeDuplicatesAndProcess();
