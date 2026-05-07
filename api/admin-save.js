
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.ADMIN_PASS || "marrant";
    const providedPass = (req.headers['x-password'] || '').trim();
    let actualPass = ADMIN_PASSWORD.replace(/^["']|["']$/g, '').trim();

    if (providedPass !== actualPass) {
        return res.status(401).json({ error: "Interdit" });
    }

    try {
        const { departments, liveConfig } = req.body;

        // 1. Générer le contenu du fichier data.js
        const fileContent = `// DONNÉES OFFICIELLES DU MARRANT CLUB\n` +
            `const DEPARTMENTS = ${JSON.stringify(departments, null, 4)};\n\n` +
            `const LIVE_CONFIG = ${JSON.stringify(liveConfig, null, 4)};\n`;

        const filePath = path.join(process.cwd(), 'data.js');
        
        // 2. Écrire le fichier
        fs.writeFileSync(filePath, fileContent);

        // 3. Git Push (uniquement si on est en local)
        if (process.env.NODE_ENV !== 'production') {
            exec('git add data.js && git commit -m "Admin update: data.js" && git push origin main', (err, stdout, stderr) => {
                if (err) {
                    console.error("Git Error:", stderr);
                } else {
                    console.log("Git Success:", stdout);
                }
            });
        }

        return res.status(200).json({ success: true, message: "Fichier mis à jour et push lancé !" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
