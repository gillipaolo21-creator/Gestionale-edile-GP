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

            // Colors hex replacements
            content = content.replaceAll('#0054B4', '#d97706'); // amber-600
            content = content.replaceAll('#003A7D', '#b45309'); // amber-700
            content = content.replaceAll('#FBFBFB', '#1c1917'); // stone-900

            // Tailwind class replacements for dark mode
            content = content.replaceAll('bg-white', 'bg-stone-800');
            content = content.replaceAll('text-stone-900', 'text-stone-100');
            content = content.replaceAll('text-slate-900', 'text-stone-100');
            content = content.replaceAll('text-gray-900', 'text-stone-100');

            content = content.replaceAll('text-stone-800', 'text-stone-200');
            content = content.replaceAll('text-slate-800', 'text-stone-200');

            content = content.replaceAll('text-stone-600', 'text-stone-300');
            content = content.replaceAll('text-slate-600', 'text-stone-300');

            content = content.replaceAll('text-stone-500', 'text-stone-400');
            content = content.replaceAll('text-slate-500', 'text-stone-400');

            content = content.replaceAll('bg-stone-50', 'bg-stone-800/50');
            content = content.replaceAll('bg-slate-50', 'bg-stone-800/50');

            content = content.replaceAll('bg-stone-100', 'bg-stone-700/50');
            content = content.replaceAll('bg-slate-100', 'bg-stone-700/50');

            content = content.replaceAll('border-stone-200', 'border-stone-700');
            content = content.replaceAll('border-slate-200', 'border-stone-700');

            content = content.replaceAll('border-stone-300', 'border-stone-600');
            content = content.replaceAll('border-slate-300', 'border-stone-600');

            // The texture / specific gradients
            content = content.replaceAll('bg-texture', 'bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900');

            // Exception: if there is text-white inside a amber-600 button, leave it alone.
            // Our replacements didn't touch text-white.

            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDirectory('./apps/web/app');
