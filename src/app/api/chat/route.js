import { azure } from '@ai-sdk/azure';
import { streamText, tool } from 'ai';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

// Enhanced RAG system with improved search - v2.1

const prisma = new PrismaClient();

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

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
    
    console.log('🔍 Enhanced search patterns:', searchPatterns);
    
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

export async function POST(request) {
  try {
    const { messages } = await request.json();

    console.log('Using Azure OpenAI with RAG for university guidance');
    console.log('Messages received:', messages);

    // Create Azure OpenAI model - using gpt-4.1 as requested
    const model = azure('gpt-4.1');

    console.log('🚀 STARTING STREAMTEXT...');
    const result = await streamText({
      model: model,
      messages,
      temperature: 0.3, // Lower temperature for more consistent responses
      maxTokens: 1500,
      tools: {
        searchPrograms: tool({
          description: 'Search for university programs and academic information in Tunisia',
          parameters: z.object({
            query: z.string().describe('Search query for university programs, majors, or academic information'),
            limit: z.number().optional().describe('Number of results to return (default: 5)'),
          }),
          execute: async ({ query, limit = 5 }) => {
            console.log('🔍 TOOL EXECUTION START - Query:', query);
            try {
              const programs = await searchUniversityPrograms(query, limit);
              console.log('📚 TOOL EXECUTION - Found programs:', programs.length);
              
              if (programs.length === 0) {
                const response = "No matching programs found. Try using different keywords like 'هندسة' for engineering or 'طب' for medicine.";
                console.log('❌ TOOL EXECUTION - No results, returning:', response.substring(0, 50) + '...');
                return response;
              }
              
              // Format as simple text response
              let response = `Found ${programs.length} matching programs:\n\n`;
              
              programs.forEach((program, index) => {
                response += `${index + 1}. **${program.specialization}**\n`;
                response += `   🏛️ Institution: ${program.institution}\n`;
                if (program.location) response += `   📍 Location: ${program.location}\n`;
                response += `   🎓 University: ${program.university_name}\n`;
                if (program.latest_score) response += `   📊 Latest Score (${program.latest_year}): ${program.latest_score}\n`;
                if (program.average_score) response += `   📈 Average Score: ${program.average_score}\n`;
                response += `   🔗 Program Code: ${program.program_code}\n`;
                if (program.bac_type_name) response += `   📚 Bac Type: ${program.bac_type_name}\n`;
                response += '\n';
              });
              
              console.log('✅ TOOL EXECUTION - Returning response length:', response.length);
              console.log('✅ TOOL EXECUTION - Response preview:', response.substring(0, 200) + '...');
              return response;
            } catch (error) {
              console.error('❌ TOOL EXECUTION ERROR:', error);
              const errorResponse = `Error searching programs: ${error.message}. Please try again with different keywords.`;
              console.log('❌ TOOL EXECUTION - Error response:', errorResponse);
              return errorResponse;
            }
          },
        }),
      },
      system: `You are an expert academic counselor for Tunisian universities. You help students with university orientation and program selection.

CRITICAL: You MUST use the searchPrograms tool for ANY question about universities, programs, or academic fields. The tool will return formatted results that you should present directly to the user.

When using searchPrograms tool:
1. ALWAYS call it for university-related questions
2. Present the returned results directly to the user
3. Add helpful context and advice based on the results
4. Respond in the same language as the user's question

Common search translations:
- FSB → Search for "Faculté des Sciences de Bizerte" or "بنزرت علوم"
- Prepa intégrée → Search for "مرحلة تحضيرية مندمجة"
- Engineering → Search for "هندسة" or "engineering"
- Medicine → Search for "طب" or "medicine"

You have access to comprehensive data about 2,631+ Tunisian university programs including admission scores, locations, and program details.

Always be helpful, encouraging, and provide practical advice for students.`,
    });
    
    console.log('✅ STREAMTEXT RESULT CREATED');
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process chat request',
        details: error.message,
        stack: error.stack
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
