import axios from 'axios';
import fs from 'fs';

async function fetchDynamicModel() {
  try {
    const res = await axios.get('https://agbyazilimcom.wixsite.com/my-site-15/_api/v2/dynamicmodel', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    console.log('Dynamic model keys:', Object.keys(res.data));
    fs.writeFileSync('scripts/wix_dynamic_model.json', JSON.stringify(res.data, null, 2));
    
    // Search text inside dynamic model
    const textData = JSON.stringify(res.data);
    console.log('Dynamic model text length:', textData.length);
    
    // Look for phones, emails, addresses, texts
    const phones = textData.match(/(?:\+90|05|02)[0-9\s()-]{8,15}/g) || [];
    console.log('Phones in dynamic model:', phones);

    const emails = textData.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    console.log('Emails in dynamic model:', emails);

    // Look for text properties in components
    const strings = textData.match(/"text":\s*"([^"]+)"/g) || [];
    console.log('Component text strings:', strings.slice(0, 30));

  } catch (err) {
    console.error('Error fetching dynamic model:', err.message);
  }
}

fetchDynamicModel();
