import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('scripts/wix_page.html', 'utf8');
const $ = cheerio.load(html);

console.log('--- Page Title ---');
console.log($('title').text());

console.log('--- All Image Elements ---');
$('img').each((i, el) => {
  console.log(`img ${i}: src=${$(el).attr('src')} alt=${$(el).attr('alt')}`);
});

console.log('--- All SVGs ---');
$('svg').each((i, el) => {
  console.log(`svg ${i}:`, $(el).attr('id') || $(el).attr('class') || 'no-id');
});

console.log('--- All Paragraphs & Headings & Spans ---');
$('h1, h2, h3, h4, h5, h6, p, span, a, div').each((i, el) => {
  const text = $(el).text().trim();
  if (text && text.length < 200 && !text.includes('function') && !text.includes('{')) {
    // filter repetitive short text
  }
});

// Search for strings matching phone, email, address, logo, mobilya, vs in the entire html file
const matches = html.match(/"text":"[^"]+"/g) || [];
console.log('Found "text" JSON properties:', matches.length);
const cleanTexts = matches.map(m => m.replace(/"text":"/, '').replace(/"$/, '')).filter(t => t.length > 2 && !t.startsWith('<') && !t.includes('{'));
console.log('Sample clean texts from JSON:', Array.from(new Set(cleanTexts)).slice(0, 50));

// Also search for all script blocks that might contain page data
$('script').each((i, el) => {
  const content = $(el).html();
  if (content && (content.includes('masterPage') || content.includes('siteData') || content.includes('structure') || content.includes('props'))) {
    console.log(`Script ${i} length: ${content.length}`);
    if (content.length < 5000) {
      console.log(`Script ${i}:`, content.slice(0, 500));
    }
  }
});
