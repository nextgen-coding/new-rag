import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSchema() {
  try {
    // Get first record to see structure
    const firstRecord = await prisma.universityProgram.findFirst();
    
    if (firstRecord) {
      console.log('Sample record structure:');
      console.log('Keys:', Object.keys(firstRecord));
      console.log('First record:', firstRecord);
    } else {
      console.log('No records found');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSchema();
