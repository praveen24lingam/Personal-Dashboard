const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = fs.statSync(dirFile).isDirectory() ? walkSync(dirFile, filelist) : filelist.concat(dirFile);
    } catch (err) {
      if (err.code === 'OOM' || err.code === 'EMFILE') throw err;
    }
  });
  return filelist;
};

const files = walkSync('./src').filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove unused React import
  content = content.replace(/import React(?:, \{.*?\})? from 'react';\n/g, match => {
    if (match.includes('{')) {
      // Extract what's inside {}
      const named = match.match(/\{([^}]+)\}/)[1];
      return `import {${named}} from 'react';\n`;
    }
    return '';
  });
  
  // Fix width attribute in th
  content = content.replace(/<th width="40">/g, '<th style={{ width: "40px" }}>');
  
  // Fix unused Video import in Sidebar
  if (file.includes('Sidebar.tsx')) {
    content = content.replace(/, Video/g, '');
  }

  fs.writeFileSync(file, content, 'utf8');
});

console.log('Fixed TS errors.');
