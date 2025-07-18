// Test endpoint to verify RAG data directly
export async function GET(request) {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  
  try {
    // Test the exact search that worked
    const searchPatterns = [
      'بنزرت', 'علوم', 'كلية العلوم', 'تحضيرية', 'مندمجة', 'مرحلة تحضيرية مندمجة'
    ];
    
    const orConditions = [];
    searchPatterns.forEach(pattern => {
      orConditions.push(
        { raw_text: { contains: pattern, mode: 'insensitive' } },
        { specialization: { contains: pattern, mode: 'insensitive' } },
        { institution: { contains: pattern, mode: 'insensitive' } },
        { location: { contains: pattern, mode: 'insensitive' } }
      );
    });
    
    const programs = await prisma.universityProgram.findMany({
      where: { OR: orConditions },
      take: 10,
      orderBy: [{ latest_score: 'desc' }, { specialization: 'asc' }]
    });
    
    await prisma.$disconnect();
    
    return Response.json({
      success: true,
      found: programs.length,
      programs: programs.map(p => ({
        specialization: p.specialization,
        institution: p.institution,
        location: p.location,
        university: p.university_name,
        score: p.latest_score,
        code: p.program_code
      }))
    });
    
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
