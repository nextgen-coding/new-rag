// Test the search API directly
const testQuery = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: 'Search for "prépa intégrée" programs'
          }
        ]
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers));
    
    if (response.ok) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        console.log('Chunk:', chunk);
      }
    } else {
      const errorText = await response.text();
      console.error('Error response:', errorText);
    }
  } catch (error) {
    console.error('Test error:', error);
  }
};

testQuery();
