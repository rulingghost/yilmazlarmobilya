import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

async function fetchWixSite() {
  try {
    const url = 'https://agbyazilimcom.wixsite.com/my-site-15';
    console.log('Fetching:', url);
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    console.log('HTML length:', data.length);

    // Save full HTML for thorough inspection
    fs.writeFileSync('scripts/wix_page.html', data);

    // Extract all static.wixstatic.com image URLs
    const imgRegex = /https:\/\/static\.wixstatic\.com\/media\/[a-zA-Z0-9_~\-.]+/g;
    const images = Array.from(new Set(data.match(imgRegex) || []));
    console.log('Found images count:', images.length);
    console.log('Images:', images);

    // Extract viewerModel json if present
    const modelMatch = data.match(/<script type="application\/json" id="wix-essential-viewer-model">([\s\S]*?)<\/script>/);
    if (modelMatch) {
      console.log('Viewer model found');
      fs.writeFileSync('scripts/wix_model.json', modelMatch[1]);
    }

    // Search for page JSON server URLs or thunderbolt data
    const pageJsonUrls = data.match(/https:\/\/pages\.parastorage\.com\/[^"'\s]+/g) || [];
    console.log('Page JSON URLs:', pageJsonUrls);

    // Look for text strings, phone numbers, addresses, emails in the raw HTML
    const $ = cheerio.load(data);
    const textContent = $('body').text().replace(/\s+/g, ' ');
    console.log('Extracted text preview:', textContent.slice(0, 1000));

  } catch (err) {
    console.error('Error fetching site:', err.message);
  }
}

fetchWixSite();
