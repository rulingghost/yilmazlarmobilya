import axios from 'axios';
import fs from 'fs';

async function getWixSiteData() {
  const metaSiteId = 'cf96e8ed-9f11-434b-b300-8f1ddf12dc02';
  
  // List of page IDs we found: masterPage, c1dmp, v6l4o, etc.
  const html = fs.readFileSync('scripts/wix_page.html', 'utf8');
  const pageIdMatches = html.match(/["']pageId["']:\s*["']([^"']+)["']/g) || [];
  const pageIds = Array.from(new Set(pageIdMatches.map(p => p.match(/["']pageId["']:\s*["']([^"']+)["']/)[1])));
  pageIds.unshift('masterPage');

  console.log('Fetching data for page IDs:', pageIds.length);

  for (const pageId of pageIds.slice(0, 10)) {
    try {
      const url = `https://pages.parastorage.com/pages/site-pages-by-id?metaSiteId=${metaSiteId}&pageIds=${pageId}`;
      const res = await axios.get(url);
      console.log(`Successfully fetched ${pageId}: keys =`, Object.keys(res.data));
      fs.writeFileSync(`scripts/page_${pageId}.json`, JSON.stringify(res.data, null, 2));
    } catch (err) {
      console.log(`Failed to fetch ${pageId}:`, err.message);
    }
  }
}

getWixSiteData();
