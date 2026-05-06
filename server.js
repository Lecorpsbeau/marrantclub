const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Stockage temporaire (en attendant une base de données)
let defisRecus = [];

app.post('/api/soumettre-defi', (req, res) => {
    const nouveauDefi = {
        departement: req.body.departement,
        pseudo: req.body.pseudo,
        message: req.body.message,
        date: new Date()
    };

    defisRecus.push(nouveauDefi);
    console.log("Nouveau défi reçu pour le Marrant Club !", nouveauDefi);

    res.status(200).send({ message: "Défi bien enregistré sur le serveur !" });
});

app.listen(PORT, () => {
    console.log(`Serveur prêt sur http://localhost:${PORT}`);
});