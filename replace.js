const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');

function walk(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace variations
      let newContent = content
        .replace(/BloodConnect/g, 'RaktaSetu')
        .replace(/Blood Connect/g, 'Rakta Setu')
        .replace(/Blood<span className="text-primary-red">Connect<\/span>/g, 'Rakta<span className="text-primary-red">Setu</span>');
        
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log('Updated:', fullPath);
      }
    }
  }
}

walk(dir);
console.log('Done!');
