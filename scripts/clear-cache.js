const fs = require('fs');
const path = require('path');

const nextCacheDir = path.join(__dirname, '..', '.next');

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
    console.log('Deleted:', folderPath);
  }
}

try {
  deleteFolderRecursive(nextCacheDir);
  console.log('Cache cleared successfully!');
} catch (err) {
  console.error('Error clearing cache:', err.message);
}
