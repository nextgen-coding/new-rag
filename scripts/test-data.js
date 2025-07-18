import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testData() {
  try {
    console.log('Testing imported data...');
    
    // Get total count
    const totalCount = await prisma.universityProgram.count();
    console.log(`Total programs in database: ${totalCount}`);
    
    // Get university statistics with correct syntax
    const universities = await prisma.universityProgram.groupBy({
      by: ['university_name'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 10
    });
    
    console.log('\nTop 10 Universities by Program Count:');
    universities.forEach((uni, index) => {
      console.log(`${index + 1}. ${uni.university_name}: ${uni._count.id} programs`);
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
        select: {
          specialization: true,
          institution: true,
          latest_score: true,
          university_name: true
        }
      });
      
      console.log(`\n"${searchTerm}": Found ${results.length} results`);
      if (results.length > 0) {
        results.forEach(result => {
          console.log(`   - ${result.specialization} at ${result.institution} (Score: ${result.latest_score || 'N/A'})`);
        });
      }
    }
    
    // Test score statistics
    const scoreStats = await prisma.universityProgram.aggregate({
      _count: {
        latest_score: true
      },
      _avg: {
        latest_score: true,
        average_score: true
      },
      _min: {
        latest_score: true
      },
      _max: {
        latest_score: true
      },
      where: {
        latest_score: {
          not: null
        }
      }
    });
    
    console.log('\nScore Statistics:');
    console.log(`Programs with scores: ${scoreStats._count.latest_score}`);
    console.log(`Average latest score: ${scoreStats._avg.latest_score?.toFixed(2) || 'N/A'}`);
    console.log(`Average historical score: ${scoreStats._avg.average_score?.toFixed(2) || 'N/A'}`);
    console.log(`Min score: ${scoreStats._min.latest_score || 'N/A'}`);
    console.log(`Max score: ${scoreStats._max.latest_score || 'N/A'}`);
    
    console.log('\nData validation completed successfully!');
    
  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testData();
