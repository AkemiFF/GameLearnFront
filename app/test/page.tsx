import Image from 'next/image';

export default function TestPage() {
    return (
        <div style={{ position: 'relative', width: '500px', height: '300px' }}>
            <h1>Bienvenue sur la page de test</h1>
            <Image
                src="/images/default.png" // Chemin corrigé
                alt="Exemple d'image"
                fill // Utilisation du mode remplissage
                style={{
                    objectFit: 'contain', // Adapte l'image au conteneur
                }}
                quality={75} // Optimisation de la qualité
                priority // Pré-chargement pour les images LCP
            />
        </div>
    );
}