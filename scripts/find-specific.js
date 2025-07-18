import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findSpecificPrograms() {
  try {
    console.log('=== Looking for Specific Programs ===\n');
    
    // Look for Bizerte programs specifically
    console.log('1. Programs in Bizerte:');
    const bizertePrograms = await prisma.universityProgram.findMany({
      where: {
        location: 'بنزرت'
      },
      take: 15,
      select: {
        institution: true,
        specialization: true,
        location: true,
        latest_score: true,
        university_name: true
      }
    });
    
    console.log(`Found ${bizertePrograms.length} programs in Bizerte:`);
    bizertePrograms.forEach(p => {
      console.log(`- ${p.specialization} | ${p.institution} | Score: ${p.latest_score || 'N/A'}`);
    });
    
    // Look for integrated preparatory programs specifically
    console.log('\n2. Integrated Preparatory Programs:');
    const prepIntegratedPrograms = await prisma.universityProgram.findMany({
      where: {
        OR: [
          { specialization: { contains: 'مرحلة تحضيرية مندمجة', mode: 'insensitive' } },
          { specialization: { contains: 'تحضيرية مندمجة', mode: 'insensitive' } },
          { raw_text: { contains: 'مرحلة تحضيرية مندمجة', mode: 'insensitive' } },
        ]
      },
      take: 15,
      select: {
        institution: true,
        specialization: true,
        location: true,
        latest_score: true,
        university_name: true
      }
    });
    
    console.log(`Found ${prepIntegratedPrograms.length} integrated preparatory programs:`);
    prepIntegratedPrograms.forEach(p => {
      console.log(`- ${p.specialization} | ${p.institution} | ${p.location || 'N/A'} | Score: ${p.latest_score || 'N/A'}`);
    });
    
    // Look for preparatory institutes
    console.log('\n3. Preparatory Institutes:');
    const prepInstitutes = await prisma.universityProgram.findMany({
      where: {
        institution: { contains: 'المعهد التحضيري', mode: 'insensitive' }
      },
      select: {
        institution: true,
        specialization: true,
        location: true,
        latest_score: true,
        university_name: true
      },
      take: 15
    });
    
    console.log(`Found ${prepInstitutes.length} preparatory institute programs:`);
    const uniqueInstitutes = [...new Set(prepInstitutes.map(p => `${p.institution} - ${p.location || 'N/A'}`))];
    uniqueInstitutes.forEach(inst => console.log(`- ${inst}`));
    
    // Look for science faculties that might be related to FSB
    console.log('\n4. Science-related institutions:');
    const scienceInstitutions = await prisma.universityProgram.findMany({
      where: {
        OR: [
          { institution: { contains: 'كلية العلوم', mode: 'insensitive' } },
          { institution: { contains: 'علوم', mode: 'insensitive' } },
        ]
      },
      select: {
        institution: true,
        location: true,
        university_name: true
      },
      distinct: ['institution']
    });
    
    console.log(`Found ${scienceInstitutions.length} science institutions:`);
    scienceInstitutions.forEach(inst => {
      console.log(`- ${inst.institution} | ${inst.location || 'N/A'} | ${inst.university_name}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findSpecificPrograms();
