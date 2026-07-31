import axios from 'axios';
import fs from 'fs';

const candidateImages = [
  'https://static.wixstatic.com/media/687b99_561861f094ba45348142feaf866c4f4c~mv2.png',
  'https://static.wixstatic.com/media/687b99_416c4b7439d74a598f1f5a5200e490e6~mv2.png',
  'https://static.wixstatic.com/media/687b99_34e83d14989e4d79825ac7410a324719~mv2.png',
  'https://static.wixstatic.com/media/687b99_2843732d830742588129a57894e43e38~mv2.png',
  'https://static.wixstatic.com/media/687b99_f15edad6b3ca462e92a8d8eea22f203a~mv2.png',
  'https://static.wixstatic.com/media/687b99_ae042af12f364bd297e396c609bd4ec1~mv2.png',
  'https://static.wixstatic.com/media/687b99_015ab01ee2fd404fb69fcaebd32dade8~mv2.png',
  'https://static.wixstatic.com/media/9f762c_a8096267074e436f944666194b3b7bda~mv2.png'
];

async function downloadCandidates() {
  if (!fs.existsSync('public/images')) {
    fs.mkdirSync('public/images', { recursive: true });
  }

  for (let i = 0; i < candidateImages.length; i++) {
    const url = candidateImages[i];
    const ext = url.split('.').pop();
    const filename = `public/images/candidate_${i + 1}.${ext}`;
    try {
      console.log(`Downloading ${url} -> ${filename}`);
      const res = await axios.get(url, { responseType: 'arraybuffer' });
      fs.writeFileSync(filename, res.data);
      console.log(`Saved ${filename} (${res.data.length} bytes)`);
    } catch (e) {
      console.error(`Failed ${url}:`, e.message);
    }
  }
}

downloadCandidates();
