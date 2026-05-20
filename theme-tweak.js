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

            // Rimuovo il forte gradiente scuro/ambra in favore di un gradiente grigio/slate elegante
            content = content.replaceAll('from-stone-900 via-stone-800 to-amber-900', 'from-slate-800 via-slate-700 to-slate-800');

            // Cambio gli hex hardcoded inseriti in precedenza
            content = content.replaceAll('#1c1917', '#1e293b'); // stone-900 -> slate-800

            // Sostituisco tutte le classi "stone" (marroncino scuro) con "slate" (grigio professionale)
            // ma scalate di uno step più chiaro per non renderlo troppo "nero"
            content = content.replaceAll('stone-900', 'slate-800');
            content = content.replaceAll('stone-800', 'slate-700');
            content = content.replaceAll('stone-700', 'slate-600');
            content = content.replaceAll('stone-600', 'slate-500');
            content = content.replaceAll('stone-500', 'slate-400');
            content = content.replaceAll('stone-400', 'slate-300');
            content = content.replaceAll('stone-300', 'slate-200');

            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDirectory('./apps/web/app');
