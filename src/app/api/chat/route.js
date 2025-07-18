import { azure } from '@ai-sdk/azure';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(request) {
  try {
    const { messages } = await request.json();

    console.log('Using Azure OpenAI with resource: nextgen-australia-east');
    console.log('Deployment name: gpt-4.1');

    // Create Azure OpenAI model using the documentation approach
    const model = azure('gpt-4.1');

    // Stream the response using Azure OpenAI
    const result = await streamText({
      model: model,
      messages,
      temperature: 0.7,
      maxTokens: 1000,
    });

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
