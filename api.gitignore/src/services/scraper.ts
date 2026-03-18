interface ScrapedLead {
    businessName: string;
    location: string;
    rating: number;
    reviewCount: number;
    websiteUrl: string | null;
}

export const scrapeMockData = async (location: string): Promise<ScrapedLead[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate random data mimicking a Google Maps Search
    const types = ['Dental Care', 'Plumbing & Heating', 'Landscaping', 'Roofing', 'Café', 'Auto Repair'];
    const leads: ScrapedLead[] = [];

    for (let i = 0; i < 50; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const hasWebsite = Math.random() > 0.6; // 40% chance of NO website

        leads.push({
            businessName: `${location.split(',')[0]} ${type} ${i + 1}`,
            location,
            rating: +(Math.random() * (5 - 3) + 3).toFixed(1), // 3.0 to 5.0
            reviewCount: Math.floor(Math.random() * 200) + 5, // 5 to 205
            websiteUrl: hasWebsite ? `https://example${i}.com` : null
        });
    }

    return leads;
};
