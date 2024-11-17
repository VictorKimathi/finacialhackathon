// pages/api/store_embedding.js
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabaseUrl = process.env.SUPABASE_URL_LC_CHATBOT;
const supabaseKey = process.env.SUPABASE_API_KEY;
const client = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { text, embeddings } = req.body;

        try {
            // Store the document and its embeddings in the Supabase `documents` table
            const { error } = await client
                .from('documents')
                .insert([{ text, embedding: embeddings }]);

            if (error) throw error;

            // Retrieve matching documents
            const { data: matches, error: matchError } = await client.rpc('match_documents', {
                query_embedding: embeddings,
                match_threshold: 0.8,
                match_count: 5
            });

            if (matchError) throw matchError;

            res.status(200).json({ matches });
        } catch (error) {
            console.log('Error storing/retrieving embeddings:', error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Only POST method is allowed' });
    }
}
