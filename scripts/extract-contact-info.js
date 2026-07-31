import fs from 'fs';
import * as cheerio from 'cheerio';

function analyzeFile(filename) {
  if (!fs.existsSync(filename)) return;
  console.log(`\n================ ANALYZING ${filename} ================`);
  const html = fs.readFileSync(filename, 'utf8');
  
  // Search for all URLs (social, maps, etc.)
  const urls = html.match(/https?:\/\/[^"'\s<)]+/g) || [];
  const social = Array.from(new Set(urls.filter(u => 
    u.includes('facebook') || u.includes('instagram') || u.includes('twitter') || 
    u.includes('youtube') || u.includes('wa.me') || u.includes('whatsapp') || 
    u.includes('maps') || u.includes('google.com/maps')
  )));
  console.log('Social & Map Links:', social);

  // Search for phone numbers
  const phones = Array.from(new Set(html.match(/(?:\+90|0)[0-9\s()-]{9,15}/g) || []));
  console.log('Phone Numbers:', phones);

  // Search for email addresses
  const emails = Array.from(new Set(html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []));
  console.log('Emails:', emails);

  // Search for potential logo image sources
  const logos = Array.from(new Set(html.match(/https:\/\/static\.wixstatic\.com\/media\/[a-zA-Z0-9_~\-.]+\.(?:png|jpg|webp|gif|svg)/g) || []));
  console.log('Image URLs count:', logos.length);
  console.log('PNG/SVG images:', logos.filter(l => l.includes('.png') || l.includes('.svg')));

  // Search for address patterns or Turkish keywords
  const $ = cheerio.load(html);
  const text = $('body').text().replace(/\s+/g, ' ');
  console.log('Body Text snippet (first 1000 chars):', text.slice(0, 1000));
}

analyzeFile('scripts/wix_page.html');
analyzeFile('scripts/hakkimizda.html');
analyzeFile('scripts/uyku-testi.html');
