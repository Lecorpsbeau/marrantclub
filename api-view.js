import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // 1. RÉCUPÉRATION DE L'IP (Vercel transmet l'IP via ce header)
    const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // 2. CONFIGURATION DES VARIABLES (À configurer dans Vercel Settings > Environment Variables)
    const MY_IP = process.env.ADMIN_IP; // Ton IP (ex: "82.123.45.67")
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; // Ton mot de passe secret

    // 3. SÉCURITÉ IP (Optionnelle : s'active seulement si ADMIN_IP est configuré)
    if (MY_IP && !userIp.includes(MY_IP)) {
        console.warn(`Tentative d'accès bloquée : IP ${userIp}`);
        return res.status(403).json({ error: "Accès interdit : IP non autorisée." });
    }

    // 4. SÉCURITÉ MOT DE PASSE
    const providedPass = (req.headers['authorization'] || '').trim();
    const actualPass = (ADMIN_PASSWORD || '').trim();

    if (!actualPass) {
        return res.status(500).json({ error: "Le mot de passe admin n'est pas configuré sur Vercel." });
    }

    if (providedPass !== actualPass) {
        return res.status(401).json({ error: "Mot de passe incorrect." });
    }

    try {
        // 5. RÉCUPÉRATION DES DÉFIS DANS UPSTASH/KV
        // On récupère tout de la liste 'defis_recus' du plus récent au plus ancien
        const defis = await kv.lrange('defis_recus', 0, -1);

        return res.status(200).json(defis);
    } catch (error) {
        console.error("Erreur Upstash:", error);
        return res.status(500).json({ error: "Erreur lors de la lecture de la base de données." });
    }
}