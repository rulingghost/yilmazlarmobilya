import fs from 'fs';

try {
  const modelText = fs.readFileSync('scripts/wix_model.json', 'utf8');
  const model = JSON.parse(modelText);
  console.log('Model keys:', Object.keys(model));
  if (model.site) console.log('Site:', model.site);
  if (model.siteAssets) console.log('Site Assets:', model.siteAssets);
  
  // Save pretty JSON for analysis
  fs.writeFileSync('scripts/wix_model_pretty.json', JSON.stringify(model, null, 2));
} catch (e) {
  console.error(e);
}
