
module.exports = async function handler(req, res) {
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.ADMIN_PASS || "marrant";
    const providedPass = (req.headers['x-password'] || '').trim();
    let actualPass = ADMIN_PASSWORD.replace(/^["']|["']$/g, '').trim();

    if (providedPass === actualPass) {
        return res.status(200).json({ success: true });
    } else {
        return res.status(401).json({ 
            error: "Mot de passe incorrect.",
            debug: `Recu: ${providedPass.length} car., Attendu: ${actualPass.length} car.` 
        });
    }
};
