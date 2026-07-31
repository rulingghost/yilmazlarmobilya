import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('scripts/wix_page.html', 'utf8');
const $ = cheerio.load(html);

let allText = '';
$('script').each((i, el) => {
  const content = $(el).html() || '';
  allText += content + '\n';
});

// Search for phone numbers, emails, address, logo, text in all script content
console.log('--- Search for Phone Numbers ---');
const phones = allText.match(/(?:\+90|0)[0-9\s()-]{9,15}/g) || [];
console.log('Phones:', Array.from(new Set(phones)));

console.log('--- Search for Emails ---');
const emails = allText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
console.log('Emails:', Array.from(new Set(emails)));

console.log('--- Search for Turkish text strings ---');
const trTexts = allText.match(/"([^"]*(?:mobilya|istikbal|yılmazlar|yilmazlar|adres|tel|iletisim|iletişim|hakkımızda|ürün|salon|koltuk|yatak|yemek|mah|cad|sok|no:)[^"]*)"/gi) || [];
console.log('TR texts found:', Array.from(new Set(trTexts)).slice(0, 40));

// Save all extracted text strings into a readable text file
fs.writeFileSync('scripts/extracted_scripts_text.txt', trTexts.join('\n'));
