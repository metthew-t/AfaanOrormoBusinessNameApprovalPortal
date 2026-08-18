const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/Pc/Afaan Oromo Business Name Approval Portal/apps/backend/src';

function walk(currentDir) {
  const files = fs.readdirSync(currentDir);
  for (const file of files) {
    const fullPath = path.join(currentDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('../../../../shared')) {
        content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/shared/g, '../../../../../shared');
        fs.writeFileSync(fullPath, content);
        console.log('Fixed', fullPath);
      }
    }
  }
}

walk(dir);
