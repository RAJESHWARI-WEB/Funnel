import express from 'express';
import { PrismaClient } from '@prisma/client';
import { scrapeMockData } from '../services/scraper';
import { scoreLeadsWithAI } from '../services/ai';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/start', authenticateToken, async (req: AuthRequest, res: express.Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        // For MVP, user profile is passed in or fetched. Assuming it's in the DB.
        const userProfile = await prisma.userProfile.findUnique({ where: { userId } });

        // Create SearchSession
        const searchSession = await prisma.searchSession.create({
            data: {
                userId,
                status: 'processing'
            }
        });

        // 1. Scrape Mock Data and apply deterministic filters
        // Filters: Rating >= 4.2, Review Count >= 30, No Website (mock implementation randomizes this)
        const rawLeads = await scrapeMockData(userProfile?.location || 'San Francisco, CA');

        // 2. Filter Leads
        const filteredLeads = rawLeads.filter(lead =>
            lead.rating >= 4.2 &&
            lead.reviewCount >= 30 &&
            !lead.websiteUrl
        );

        // Limit to 10-20 for MVP batching
        const leadsToScore = filteredLeads.slice(0, 15);

        // 3. AI Scoring
        // Batch process leads with OpenAI
        const scoredLeads = await scoreLeadsWithAI(leadsToScore, userProfile);

        // 4. Save Leads to DB
        const createdLeads = await Promise.all(
            scoredLeads.map(lead =>
                prisma.lead.create({
                    data: {
                        ...lead,
                        searchSessionId: searchSession.id
                    }
                })
            )
        );

        // Update Session
        await prisma.searchSession.update({
            where: { id: searchSession.id },
            data: { status: 'completed' }
        });

        res.json({
            success: true,
            searchSessionId: searchSession.id,
            leads: createdLeads
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Failed to process search' });
    }
});

export default router;
