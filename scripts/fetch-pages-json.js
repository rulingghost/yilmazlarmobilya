import axios from 'axios';
import fs from 'fs';

async function fetchWixPages() {
  try {
    const html = fs.readFileSync('scripts/wix_page.html', 'utf8');
    
    // Find pageIds in masterPage or site structure
    const pageIdMatches = html.match(/["']pageId["']:\s*["']([^"']+)["']/g) || [];
    console.log('pageId matches:', pageIdMatches);

    const siteId = 'cf96e8ed-9f11-434b-b300-8f1ddf12dc02';
    
    // Wix stores site structure in siteassets.parastorage.com or pages.parastorage.com
    // Let's search html for any parastorage URLs
    const paraUrls = Array.from(new Set(html.match(/https:\/\/[^"'\s]+\.parastorage\.com\/[^"'\s]+/g) || []));
    console.log('Parastorage URLs found:', paraUrls.length);
    fs.writeFileSync('scripts/para_urls.txt', paraUrls.join('\n'));

    // Search for structure JSON or masterPage JSON in html
    const structureMatch = html.match(/["']structure["']:\s*(\{[\s\S]*?\})\s*,\s*["']/);
    if (structureMatch) {
      console.log('Found structure JSON');
      fs.writeFileSync('scripts/structure.json', structureMatch[1]);
    }

    // Search for props JSON in html
    const propsMatch = html.match(/["']props["']:\s*(\{[\s\S]*?\})\s*,\s*["']/);
    if (propsMatch) {
      console.log('Found props JSON');
      fs.writeFileSync('scripts/props.json', propsMatch[1]);
    }

    // Search for text in raw html using regex for html tags and encoded text
    const textSnippets = html.match(/>([^<]{3,100})</g) || [];
    const cleanSnippets = textSnippets
      .map(s => s.replace(/^[>]/, '').replace(/<$/, '').trim())
      .filter(s => s.length > 2 && !s.startsWith('{') && !s.includes('function') && !s.includes('var '));
    
    console.log('Clean HTML text snippets:', Array.from(new Set(cleanSnippets)).slice(0, 50));
    fs.writeFileSync('scripts/clean_html_snippets.txt', Array.from(new Set(cleanSnippets)).join('\n'));

  } catch (err) {
    console.error(err);
  }
}

fetchWixPages();
