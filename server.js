const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static('.')); 

const getAdminPassword = () => {
    let pass = process.env.ADMIN_PASSWORD || process.env.ADMIN_PASS || "marrant";
    return pass.replace(/^["']|["']$/g, '').trim();
};

// Route de test
app.get('/api/test', (req, res) => {
    res.json({ message: "Serveur local OK", time: new Date().toLocaleTimeString() });
});

// Route de login
app.all('/api/login', (req, res) => {
    const providedPass = (req.headers['x-password'] || '').trim();
    const actualPass = getAdminPassword();

    if (providedPass === actualPass) {
        res.json({ success: true });
    } else {
        res.status(401).json({ 
            error: "Mot de passe incorrect.",
            debug: `Recu: ${providedPass.length} car., Attendu: ${actualPass.length} car.`
        });
    }
});

// SAUVEGARDE ET PUSH
app.post('/api/admin-save', (req, res) => {
    const providedPass = (req.headers['x-password'] || '').trim();
    const actualPass = getAdminPassword();

    if (providedPass !== actualPass) {
        return res.status(401).json({ error: "Interdit" });
    }

    const { departments, liveConfig } = req.body;
    const fileContent = `// DONNÉES OFFICIELLES DU MARRANT CLUB\n` +
        `const DEPARTMENTS = ${JSON.stringify(departments, null, 4)};\n\n` +
        `const LIVE_CONFIG = ${JSON.stringify(liveConfig, null, 4)};\n`;

    try {
        fs.writeFileSync(path.join(__dirname, 'data.js'), fileContent);
        
        console.log("💾 data.js sauvegardé localement.");

        // Lancer le push git en arrière-plan
        exec('git add data.js && git commit -m "Admin update: data.js" && git push origin main', (err, stdout, stderr) => {
            if (err) {
                console.error("❌ Erreur Git Push:", stderr);
            } else {
                console.log("🚀 Git Push réussi !");
            }
        });

        res.json({ success: true, message: "Enregistré et push lancé !" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route pour voir les défis (admin)
app.get('/api/api-view', (req, res) => {
    const providedPass = (req.headers['x-password'] || '').trim();
    const actualPass = getAdminPassword();

    if (providedPass !== actualPass) {
        return res.status(401).json({ error: "Interdit" });
    }

    res.json({
        timestamp: new Date().toLocaleTimeString('fr-FR'),
        defis: [] // On pourrait charger depuis KV ici
    });
});

app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 SERVEUR MARRANT CLUB DÉMARRÉ`);
    console.log(`👉 http://localhost:${PORT}`);
    console.log(`=========================================`);
});