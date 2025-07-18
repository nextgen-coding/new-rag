import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function exploreData() {
  try {
    console.log('=== Exploring All Institutions and Locations ===\n');
    
    // Get all unique locations
    const locations = await prisma.universityProgram.findMany({
      select: { location: true },
      distinct: ['location'],
      orderBy: { location: 'asc' }
    });
    
    console.log(`Found ${locations.length} unique locations:`);
    locations.forEach(loc => console.log(`- ${loc.location}`));
    
    console.log('\n=== All Unique Institutions ===');
    const institutions = await prisma.universityProgram.findMany({
      select: { 
        institution: true,
        location: true,
        university_name: true
      },
      distinct: ['institution'],
      orderBy: { institution: 'asc' },
      take: 50
    });
    
    console.log(`Found ${institutions.length} unique institutions (showing first 50):`);
    institutions.forEach(inst => {
      console.log(`- ${inst.institution} (${inst.location}) - ${inst.university_name}`);
    });
    
    // Look for anything with "science" or engineering patterns
    console.log('\n=== Looking for Engineering/Science Programs ===');
    const techPrograms = await prisma.universityProgram.findMany({
      where: {
        OR: [
          { raw_text: { contains: 'هندسة', mode: 'insensitive' } },
          { raw_text: { contains: 'engineering', mode: 'insensitive' } },
          { raw_text: { contains: 'ingenieur', mode: 'insensitive' } },
          { specialization: { contains: 'هندسة', mode: 'insensitive' } },
          { institution: { contains: 'هندسة', mode: 'insensitive' } },
        ]
      },
      select: {
        institution: true,
        location: true,
        specialization: true,
        university_name: true
      },
      take: 20
    });
    
    console.log(`Found ${techPrograms.length} engineering programs:`);
    techPrograms.forEach(p => {
      console.log(`- ${p.specialization} | ${p.institution} | ${p.location}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exploreData();
