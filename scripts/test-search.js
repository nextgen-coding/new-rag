import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Copy of the enhanced search function to test
async function searchUniversityPrograms(query, limit = 5) {
  try {
    console.log(`Searching for: "${query}" with limit ${limit}`);
    
    // Enhanced search with better query processing
    const searchTerms = query.toLowerCase();
    
    // Create multiple search patterns based on common abbreviations and translations
    const searchPatterns = [];
    
    // Add the original query
    searchPatterns.push(query);
    
    // Handle common abbreviations and translations
    if (searchTerms.includes('fsb') || searchTerms.includes('faculté des sciences de bizerte')) {
      searchPatterns.push('بنزرت'); // Bizerte in Arabic
      searchPatterns.push('علوم'); // Sciences in Arabic
      searchPatterns.push('كلية العلوم'); // Faculty of Sciences in Arabic
    }
    
    if (searchTerms.includes('prepa') || searchTerms.includes('prépa') || searchTerms.includes('preparatoire')) {
      searchPatterns.push('تحضيرية'); // Preparatory in Arabic
      searchPatterns.push('مندمجة'); // Integrated in Arabic
      searchPatterns.push('مرحلة تحضيرية'); // Preparatory phase in Arabic
      searchPatterns.push('المعهد التحضيري'); // Preparatory institute in Arabic
    }
    
    if (searchTerms.includes('integre') || searchTerms.includes('intégrée') || searchTerms.includes('integrated')) {
      searchPatterns.push('مندمجة'); // Integrated in Arabic
      searchPatterns.push('مرحلة تحضيرية مندمجة'); // Integrated preparatory phase
    }
    
    if (searchTerms.includes('engineering') || searchTerms.includes('ingenieur') || searchTerms.includes('engineer')) {
      searchPatterns.push('هندسة'); // Engineering in Arabic
      searchPatterns.push('المعهد التحضيري للدراسات الهندسية'); // Preparatory institute for engineering studies
    }
    
    console.log('Search patterns:', searchPatterns);
    
    // Build OR conditions for all search patterns
    const orConditions = [];
    searchPatterns.forEach(pattern => {
      orConditions.push(
        { raw_text: { contains: pattern, mode: 'insensitive' } },
        { specialization: { contains: pattern, mode: 'insensitive' } },
        { field_of_study: { contains: pattern, mode: 'insensitive' } },
        { institution: { contains: pattern, mode: 'insensitive' } },
        { university_name: { contains: pattern, mode: 'insensitive' } },
        { location: { contains: pattern, mode: 'insensitive' } },
        { bac_type_name: { contains: pattern, mode: 'insensitive' } },
        { criteria: { contains: pattern, mode: 'insensitive' } }
      );
    });
    
    const programs = await prisma.universityProgram.findMany({
      where: {
        OR: orConditions
      },
      take: limit,
      orderBy: [
        { latest_score: 'desc' },
        { specialization: 'asc' }
      ],
      select: {
        id: true,
        program_code: true,
        program_id: true,
        program_link: true,
        university_name: true,
        institution: true,
        location: true,
        specialization: true,
        field_of_study: true,
        criteria: true,
        bac_type_name: true,
        latest_score: true,
        latest_year: true,
        average_score: true,
        historical_scores: true,
      }
    });
    
    console.log(`Found ${programs.length} programs`);
    return programs;
  } catch (error) {
    console.error('Error searching programs:', error);
    return [];
  }
}

async function testSearch() {
  try {
    console.log('=== Testing Enhanced Search ===\n');
    
    // Test 1: Original query that was failing
    console.log('Test 1: "prepa integre fsb"');
    const results1 = await searchUniversityPrograms('prepa integre fsb', 10);
    results1.forEach(r => {
      console.log(`- ${r.specialization} | ${r.institution} | ${r.location} | Score: ${r.latest_score}`);
    });
    
    console.log('\n---\n');
    
    // Test 2: Just "prepa"
    console.log('Test 2: "prepa"');
    const results2 = await searchUniversityPrograms('prepa', 10);
    results2.forEach(r => {
      console.log(`- ${r.specialization} | ${r.institution} | ${r.location} | Score: ${r.latest_score}`);
    });
    
    console.log('\n---\n');
    
    // Test 3: Just "fsb"
    console.log('Test 3: "fsb"');
    const results3 = await searchUniversityPrograms('fsb', 10);
    results3.forEach(r => {
      console.log(`- ${r.specialization} | ${r.institution} | ${r.location} | Score: ${r.latest_score}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSearch();
