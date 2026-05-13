const fs = require('fs');
const path = require('path');

const basePath = 'C:\\Gestionale-edile-GP-master\\apps\\api\\src';
const directories = ['personale', 'mezzi', 'materiali', 'subappaltatori', 'sal', 'fatture', 'sicurezza'];

console.log('Creating directories in:', basePath, '\n');

let successCount = 0;
let failureCount = 0;

directories.forEach(dir => {
    const fullPath = path.join(basePath, dir);
    try {
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
            console.log('[SUCCESS] Created: ' + fullPath);
            successCount++;
        } else {
            console.log('[EXISTS] Already exists: ' + fullPath);
        }
    } catch (err) {
        console.log('[FAILED] Error creating ' + fullPath + ': ' + err.message);
        failureCount++;
    }
});

// Verification
console.log('\n=== Final Verification ===');
try {
    const items = fs.readdirSync(basePath);
    const dirs = items.filter(item => {
        try {
            const fullPath = path.join(basePath, item);
            const stat = fs.statSync(fullPath);
            return stat.isDirectory();
        } catch {
            return false;
        }
    });
    
    const targetDirs = ['personale', 'mezzi', 'materiali', 'subappaltatori', 'sal', 'fatture', 'sicurezza'];
    targetDirs.forEach(targetDir => {
        if (dirs.includes(targetDir)) {
            console.log('✓ ' + path.join(basePath, targetDir));
        } else {
            console.log('✗ NOT FOUND: ' + path.join(basePath, targetDir));
        }
    });
} catch (err) {
    console.log('Error during verification: ' + err.message);
}

console.log('\n[SUMMARY] ' + successCount + ' directories created, ' + failureCount + ' failures');
