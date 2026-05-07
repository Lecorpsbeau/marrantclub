const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Sert les fichiers statiques (index.html, admin.html, etc.)

// Stockage temporaire (en attendant Upstash en prod)
let defisRecus = [];

const getAdminPassword = () => {
    let pass = process.env.ADMIN_PASSWORD || process.env.ADMIN_PASS || process.env.PASSWORD || "marrant";
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
        res.status(401).json({ error: "Mot de passe incorrect." });
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
        defis: defisRecus
    });
});

// Route pour soumettre un défi
app.post('/api/soumettre', (req, res) => {
    const nouveauDefi = {
        departement: req.body.departement,
        pseudo: req.body.pseudo,
        message: req.body.message,
        date: new Date()
    };

    defisRecus.push(nouveauDefi);
    console.log("Nouveau défi reçu !", nouveauDefi);
    res.status(200).send({ message: "Défi bien enregistré !" });
});

app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 SERVEUR MARRANT CLUB DÉMARRÉ`);
    console.log(`👉 http://localhost:${PORT}`);
    console.log(`👉 Admin: http://localhost:${PORT}/admin.html`);
    console.log(`=========================================`);
});