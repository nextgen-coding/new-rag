// Simple test to call the chat API directly
const testChatAPI = async () => {
  try {
    console.log('Testing chat API...');
    
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: 'What programs are available for prepa integre fsb?'
          }
        ]
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers));
    
    if (response.ok) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      console.log('Reading streaming response...');
      let fullResponse = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('Stream ended');
          break;
        }
        
        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
        console.log('Chunk received:', chunk.length, 'chars');
      }
      
      console.log('Full response length:', fullResponse.length);
      console.log('First 500 chars:', fullResponse.substring(0, 500));
    } else {
      const errorText = await response.text();
      console.error('Error response:', errorText);
    }
  } catch (error) {
    console.error('Test error:', error);
  }
};

testChatAPI();
