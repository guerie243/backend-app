/**
 * Migration Script: Add likes_count field to all existing annonces
 * 
 * This script initializes the likes_count field to 0 for all annonces
 * that don't already have this field.
 * 
 * Usage: node src/utils/add-likes-count-field.js
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'AndyDB';
const COLLECTION_NAME = 'Annonces';

async function addLikesCountField() {
    if (!MONGODB_URI) {
        console.error('❌ MONGODB_URI not found in environment variables');
        process.exit(1);
    }

    const client = new MongoClient(MONGODB_URI);

    try {
        console.log('🔌 Connecting to MongoDB...');
        await client.connect();
        console.log('✅ Connected successfully');

        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        // Count total annonces
        const totalCount = await collection.countDocuments();
        console.log(`📊 Total annonces in database: ${totalCount}`);

        // Count annonces without likes_count field
        const withoutLikesCount = await collection.countDocuments({
            likes_count: { $exists: false }
        });
        console.log(`📊 Annonces without likes_count field: ${withoutLikesCount}`);

        if (withoutLikesCount === 0) {
            console.log('✅ All annonces already have the likes_count field. Nothing to do.');
            return;
        }

        // Update all annonces without likes_count field
        console.log('🔄 Adding likes_count field to annonces...');
        const result = await collection.updateMany(
            { likes_count: { $exists: false } },
            {
                $set: {
                    likes_count: 0,
                    updatedAt: new Date().toISOString()
                }
            }
        );

        console.log(`✅ Migration completed successfully!`);
        console.log(`   - Modified: ${result.modifiedCount} annonces`);
        console.log(`   - Matched: ${result.matchedCount} annonces`);

        // Verify the migration
        const remainingWithoutLikes = await collection.countDocuments({
            likes_count: { $exists: false }
        });

        if (remainingWithoutLikes === 0) {
            console.log('✅ Verification: All annonces now have the likes_count field');
        } else {
            console.warn(`⚠️  Warning: ${remainingWithoutLikes} annonces still without likes_count field`);
        }

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await client.close();
        console.log('🔌 Database connection closed');
    }
}

// Run the migration
addLikesCountField()
    .then(() => {
        console.log('🎉 Migration script finished');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Fatal error:', error);
        process.exit(1);
    });
