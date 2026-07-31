import axios from 'axios';
import fs from 'fs';

async function getWixData() {
  const html = fs.readFileSync('scripts/wix_page.html', 'utf8');

  // Find siteId and pageIds in html
  const siteIdMatch = html.match(/siteId["']?:\s*["']([^"']+)["']/i) || html.match(/X-Wix-Meta-Site-Id["'] content=["']([^"']+)["']/i);
  console.log('Site ID Match:', siteIdMatch ? siteIdMatch[1] : 'None');

  // Look for any wix JSON URLs or endpoints in html
  const endpoints = html.match(/https:\/\/[^"'\s]+\.json/g) || [];
  console.log('JSON endpoints:', Array.from(new Set(endpoints)));

  // Look for all wix static image links and search for logo
  const images = Array.from(new Set(html.match(/https:\/\/static\.wixstatic\.com\/media\/[^"'\s<)]+/g) || []));
  console.log('Total images found:', images.length);
  
  // Let's print out images that might be logos or headers (png, svg, logo in url)
  const logos = images.filter(i => i.includes('.png') || i.includes('.svg') || i.includes('logo') || i.includes('687b99'));
  console.log('Potential logo / graphic images:', logos);
}

getWixData();
