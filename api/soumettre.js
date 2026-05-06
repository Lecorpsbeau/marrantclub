import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { departement, pseudo, message } = req.body || {};

        // Validation du message
        if (!message || message.length > 500) {
            return res.status(400).send("Message invalide ou trop long !");
        }
        
        // Validation du département (01-95, 2A, 2B)
        const depRegex = /^([0-8][0-9]|9[0-5]|2A|2B)$/i;
        if (!departement || !depRegex.test(departement)) {
            return res.status(400).send("Département invalide.");
        }

        // Nettoyage basique (Sanitize)
        const sanitize = (str) => String(str).replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const safePseudo = sanitize(pseudo || "Anonyme");
        const safeMessage = sanitize(message);

        try {
            // Sauvegarde dans la base de données Vercel KV (Upstash)
            const nouveauDefi = {
                departement,
                pseudo: safePseudo,
                message: safeMessage,
                date: new Date().toISOString()
            };
            
            // Ajoute le défi en haut de la liste 'defis_recus'
            await kv.lpush('defis_recus', JSON.stringify(nouveauDefi));
            
            console.log(`Nouveau défi sauvegardé pour le ${departement} par ${safePseudo}`);
            return res.status(200).json({ status: 'success', message: 'Défi reçu !' });
            
        } catch (error) {
            console.error("Erreur de sauvegarde dans KV:", error);
            return res.status(500).json({ error: "Erreur serveur lors de la sauvegarde." });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}