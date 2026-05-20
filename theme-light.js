const fs = require('node:fs');
const path = require('node:path');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;

            // Remove the dark gradients from page.tsx and login
            content = content.replaceAll('bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800', 'bg-[#D7D7D7]');

            // Revert backgrounds to light, using #D7D7D7 for page backgrounds and white for cards
            content = content.replaceAll('bg-slate-800/50', 'bg-white');
            content = content.replaceAll('bg-slate-800/60', 'bg-white');
            content = content.replaceAll('bg-slate-800/80', 'bg-white');
            content = content.replaceAll('bg-slate-800', 'bg-white');

            content = content.replaceAll('bg-slate-700/50', 'bg-gray-50');
            content = content.replaceAll('bg-slate-700', 'bg-gray-100');

            // Text colors back to dark
            content = content.replaceAll('text-slate-100', 'text-gray-900');
            content = content.replaceAll('text-slate-200', 'text-gray-800');
            content = content.replaceAll('text-slate-300', 'text-gray-600');
            content = content.replaceAll('text-slate-400', 'text-gray-500');
            content = content.replaceAll('text-slate-500', 'text-gray-400');

            // Borders back to light
            content = content.replaceAll('border-slate-700', 'border-gray-200');
            content = content.replaceAll('border-slate-600', 'border-gray-300');

            // Other specific backgrounds
            content = content.replaceAll('bg-[#1e293b]', 'bg-[#D7D7D7]');

            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDirectory('./apps/web/app');
