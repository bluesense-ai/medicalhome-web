const axios = require('axios');

async function testApi() {
  try {
    console.log('Testing API with axios...');
    const response = await axios({
      method: 'post',
      url: 'https://bluesense-medical-home.hf.space/chat',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: { query: 'Hello' },
      timeout: 10000
    });
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No response received');
    }
  }
}

testApi(); 