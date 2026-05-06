export default function handler(req, res) {
    if (req.method === 'POST') {
        const { departement, pseudo, message } = req.body;

        // Ici, tu pourrais envoyer les données vers une base de données (comme Supabase ou MongoDB)
        console.log(`Nouveau défi pour le ${departement} par ${pseudo}: ${message}`);

        return res.status(200).json({ status: 'success', message: 'Défi reçu !' });
    } else {
        // Si quelqu'un essaie d'accéder à l'URL sans envoyer de formulaire
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}