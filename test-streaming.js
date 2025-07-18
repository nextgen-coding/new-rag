// Debug test for streaming response

async function testStreamingResponse() {
  try {
    console.log('🧪 Testing streaming response...');
    
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: 'give me the infos on prepa integre fsb'
          }
        ]
      })
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      return;
    }

    // Handle streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    console.log('📡 Starting to read stream...');
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        console.log('✅ Stream complete');
        break;
      }
      
      const chunk = decoder.decode(value, { stream: true });
      fullResponse += chunk;
      console.log('📦 Chunk received:', chunk.substring(0, 100) + (chunk.length > 100 ? '...' : ''));
    }

    console.log('📝 Full response length:', fullResponse.length);
    console.log('📝 Full response preview:', fullResponse.substring(0, 500) + (fullResponse.length > 500 ? '...' : ''));
    
  } catch (error) {
    console.error('💥 Test error:', error);
  }
}

testStreamingResponse();
