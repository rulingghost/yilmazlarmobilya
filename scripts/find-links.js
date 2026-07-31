import fs from 'fs';

const html = fs.readFileSync('scripts/wix_page.html', 'utf8');

// Find all hrefs
const hrefs = html.match(/href=["']([^"']+)["']/g) || [];
const cleanHrefs = Array.from(new Set(hrefs.map(h => h.replace(/^href=["']/, '').replace(/["']$/, ''))));
console.log('All Hrefs count:', cleanHrefs.length);
console.log('Sample Hrefs:', cleanHrefs.filter(h => h.includes('wixsite') || h.startsWith('/')).slice(0, 30));

// Find page slug / page titles in JSON
const pagesMatch = html.match(/["']pageUriSEO["']:\s*["']([^"']+)["']/g) || [];
console.log('Page URI SEOs:', Array.from(new Set(pagesMatch)));

// Find all menu titles & links
const titleMatches = html.match(/["']title["']:\s*["']([^"']+)["']/g) || [];
const cleanTitles = Array.from(new Set(titleMatches.map(t => t.replace(/^["']title["']:\s*["']/, '').replace(/["']$/, ''))));
console.log('Titles found:', cleanTitles.slice(0, 40));
