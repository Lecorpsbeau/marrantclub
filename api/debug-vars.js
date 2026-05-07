module.exports = async function handler(req, res) {
    const pass = process.env.ADMIN_PASSWORD || process.env.ADMIN_PASS || process.env.PASSWORD;
    
    return res.status(200).json({
        message: "Diagnostic précis",
        password_length: pass ? pass.length : 0,
        detected_keys: Object.keys(process.env).filter(k => k.includes('PASS') || k.includes('ADMIN')),
        tip: "Si length n'est pas 3, c'est que Vercel utilise encore l'ancienne valeur."
    });
};
