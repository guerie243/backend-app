const admin = require('firebase-admin');
const { FIREBASE_SERVICE_ACCOUNT } = require('./src/config/config');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(FIREBASE_SERVICE_ACCOUNT))
    });
}

const db = admin.firestore();

async function migrate() {
    console.log('Starting migration...');
    const annoncesSnap = await db.collection('Annonces').get();
    const vitrinesSnap = await db.collection('Vitrines').get();

    const vitrineMap = {};
    vitrinesSnap.docs.forEach(doc => {
        const data = doc.data();
        vitrineMap[data.slug] = data.type || 'general';
    });

    let count = 0;
    const batch = db.batch();

    for (const doc of annoncesSnap.docs) {
        const data = doc.data();
        if (data.vitrineSlug) {
            const category = vitrineMap[data.vitrineSlug] || 'general';
            if (data.vitrineCategory !== category) {
                batch.update(doc.ref, { vitrineCategory: category });
                count++;
            }
        }
    }

    if (count > 0) {
        await batch.commit();
        console.log(`Updated ${count} annonces with vitrineCategory.`);
    } else {
        console.log('No annonces needed update.');
    }
}

migrate().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
});
