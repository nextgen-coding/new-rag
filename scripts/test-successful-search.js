import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Test the exact search that was successful
async function testSuccessfulSearch() {
  try {
    // Use the enhanced search patterns we know work
    const searchPatterns = [
      'prepa integre Faculté des Sciences de Bizerte',
      'بنزرت',
      'علوم', 
      'كلية العلوم',
      'تحضيرية',
      'مندمجة',
      'مرحلة تحضيرية',
      'المعهد التحضيري',
      'مرحلة تحضيرية مندمجة'
    ];
    
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
      take: 5,
      orderBy: [
        { latest_score: 'desc' },
        { specialization: 'asc' }
      ]
    });
    
    console.log(`Found ${programs.length} programs:`);
    programs.forEach((p, i) => {
      console.log(`${i + 1}. ${p.specialization}`);
      console.log(`   Institution: ${p.institution}`);
      console.log(`   Location: ${p.location || 'N/A'}`);
      console.log(`   University: ${p.university_name}`);
      console.log(`   Latest Score: ${p.latest_score || 'N/A'}`);
      console.log(`   Program Code: ${p.program_code}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSuccessfulSearch();
