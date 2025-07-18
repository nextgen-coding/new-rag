import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function analyzeData() {
  try {
    console.log('=== Analyzing RAG Data ===\n');
    
    // 1. Search for FSB/Bizerte related programs
    console.log('1. Searching for FSB/Bizerte programs:');
    const fsbResults = await prisma.universityProgram.findMany({
      where: {
        OR: [
          { raw_text: { contains: 'fsb', mode: 'insensitive' } },
          { raw_text: { contains: 'bizerte', mode: 'insensitive' } },
          { institution: { contains: 'bizerte', mode: 'insensitive' } },
          { location: { contains: 'bizerte', mode: 'insensitive' } },
          { university_name: { contains: 'bizerte', mode: 'insensitive' } },
        ]
      },
      take: 10
    });
    console.log(`Found ${fsbResults.length} FSB/Bizerte programs:`);
    fsbResults.forEach(p => {
      console.log(`- ${p.institution} | ${p.specialization} | ${p.location}`);
    });
    
    // 2. Search for preparatory programs
    console.log('\n2. Searching for preparatory programs:');
    const prepaResults = await prisma.universityProgram.findMany({
      where: {
        OR: [
          { raw_text: { contains: 'prepa', mode: 'insensitive' } },
          { raw_text: { contains: 'prépa', mode: 'insensitive' } },
          { raw_text: { contains: 'preparatoire', mode: 'insensitive' } },
          { raw_text: { contains: 'تحضيرية', mode: 'insensitive' } },
          { specialization: { contains: 'تحضيرية', mode: 'insensitive' } },
          { field_of_study: { contains: 'تحضيرية', mode: 'insensitive' } },
          { specialization: { contains: 'prepa', mode: 'insensitive' } },
          { field_of_study: { contains: 'prepa', mode: 'insensitive' } },
        ]
      },
      take: 15
    });
    console.log(`Found ${prepaResults.length} preparatory programs:`);
    prepaResults.forEach(p => {
      console.log(`- ${p.institution} | ${p.specialization}`);
    });
    
    // 3. Check what institutions exist with similar names
    console.log('\n3. Searching for institutions with "science" or "علوم":');
    const scienceResults = await prisma.universityProgram.findMany({
      where: {
        OR: [
          { institution: { contains: 'science', mode: 'insensitive' } },
          { institution: { contains: 'علوم', mode: 'insensitive' } },
          { raw_text: { contains: 'faculté des sciences', mode: 'insensitive' } },
          { raw_text: { contains: 'كلية العلوم', mode: 'insensitive' } },
        ]
      },
      select: {
        institution: true,
        location: true,
        university_name: true,
      },
      take: 20
    });
    
    const uniqueInstitutions = [...new Set(scienceResults.map(r => `${r.institution} - ${r.location}`))];
    console.log(`Found ${uniqueInstitutions.length} unique science institutions:`);
    uniqueInstitutions.forEach(inst => console.log(`- ${inst}`));
    
    // 4. Sample raw_text to understand the format
    console.log('\n4. Sample raw_text formats:');
    const samples = await prisma.universityProgram.findMany({ 
      take: 5,
      select: {
        institution: true,
        specialization: true,
        raw_text: true,
      }
    });
    samples.forEach((s, i) => {
      console.log(`Sample ${i + 1}:`);
      console.log(`Institution: ${s.institution}`);
      console.log(`Specialization: ${s.specialization}`);
      console.log(`Raw text: ${s.raw_text}`);
      console.log('---');
    });
    
    // 5. Check for exact "fsb" mentions in various fields
    console.log('\n5. Exact FSB mentions:');
    const exactFSB = await prisma.universityProgram.findMany({
      where: {
        OR: [
          { program_code: { contains: 'fsb', mode: 'insensitive' } },
          { program_id: { contains: 'fsb', mode: 'insensitive' } },
          { university_id: { contains: 'fsb', mode: 'insensitive' } },
          { criteria: { contains: 'fsb', mode: 'insensitive' } },
        ]
      },
      take: 10
    });
    console.log(`Found ${exactFSB.length} exact FSB mentions`);
    exactFSB.forEach(p => {
      console.log(`- Code: ${p.program_code}, ID: ${p.program_id}, Criteria: ${p.criteria}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeData();
