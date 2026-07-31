import fs from 'fs';
import axios from 'axios';

const html = fs.readFileSync('scripts/wix_page.html', 'utf8');

// Search for all png, jpg, webp, svg media URLs
const imgRegex = /https:\/\/static\.wixstatic\.com\/media\/[a-zA-Z0-9_~\-.]+/g;
const allMedia = Array.from(new Set(html.match(imgRegex) || []));

console.log('All unique Wix media URLs:', allMedia.length);

// Let's filter those with 687b99 or 9f762c
const f687 = allMedia.filter(m => m.includes('687b99'));
console.log('687b99 media items:', f687);

// Let's write a script to download the first 20 687b99 items into public/images/
async function download687() {
  if (!fs.existsSync('public/images/wix')) {
    fs.mkdirSync('public/images/wix', { recursive: true });
  }

  for (let i = 0; i < f687.length; i++) {
    const url = f687[i];
    const filename = `public/images/wix/item_${i + 1}.png`;
    try {
      const res = await axios.get(url, { responseType: 'arraybuffer' });
      fs.writeFileSync(filename, res.data);
      console.log(`Saved item_${i+1}.png (${res.data.length} bytes)`);
    } catch (e) {
      console.error(`Failed ${url}:`, e.message);
    }
  }
}

download687();
