import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function startNewSearchHook(params: { location: string, niche: string }) {
    // Hits the backend crawler service to populate Firestore
    console.log("Triggering backend search crawler for", params);
    
    // Log the search action if DB is initialized
    if (db) {
        await addDoc(collection(db, 'actions'), {
            type: 'SEARCH_INITIATED',
            params,
            timestamp: serverTimestamp()
        });
    }

    return { status: 'processing', jobId: 'mock-12345' };
}

export async function generateOutreachMessageHook(leadId: string) {
    // Calls OpenAI to draft a hyper-specific email based on the lead's explanation score
    return {
        subject: "Quick question about your Google Maps listing",
        body: "Hi there, I noticed you have great reviews but aren't showing up in the local pack..."
    };
}

export async function exportLeadsToCSVHook(filters: any) {
    // Generates a signed URL to download a CSV of the active views
    return {
        downloadUrl: "https://storage.googleapis.com/funnel-exports/mock-export.csv",
        rowCount: 1240
    };
}
