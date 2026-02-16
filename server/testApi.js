const axios = require('axios');

const testApi = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:5000/api/leaves');
        console.log('Status:', response.status);
        console.log('Data Length:', response.data.length);
        console.log('First Item:', JSON.stringify(response.data[0], null, 2));
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
        }
    }
};

testApi();
