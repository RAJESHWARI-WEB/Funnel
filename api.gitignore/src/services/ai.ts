import OpenAI from 'openai';

let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
}

export const scoreLeadsWithAI = async (leads: any[], userProfile: any | null) => {
    if (!openai) {
        console.warn("No OPENAI_API_KEY found. Mocking AI scoring.");
        return leads.map(lead => ({
            ...lead,
            opportunityScore: Math.floor(Math.random() * 4) + 6, // 6 to 9
            aiReasoning: 'Mock reasoning: Has high reviews but missing digital presence.',
            conversionLikelihood: Math.random() > 0.5 ? 'High' : 'Medium'
        }));
    }

    // Batch process all leads in one prompt to save API calls
    const prompt = `
    You are an AI lead qualification expert.
    Analyze the following businesses as potential clients for the user.
    
    User Profile Context:
    Business Type: ${userProfile?.businessType || 'Marketing Agency'}
    Target Audience: ${userProfile?.targetAudience || 'Local Businesses'}
    Services: ${userProfile?.services || 'Web Development, SEO'}
    Notes: ${userProfile?.notes || 'None'}

    Leads to analyze:
    ${JSON.stringify(leads, null, 2)}

    For each lead, provide:
    1. Opportunity Score (1-10)
    2. Reasoning (Why is this a good target?)
    3. Conversion Likelihood ('High', 'Medium', 'Low')

    Respond in pure JSON array format exactly matching the input array length, with each object containing:
    {
      "opportunityScore": number,
      "aiReasoning": string,
      "conversionLikelihood": "High" | "Medium" | "Low"
    }
  `;

    try {
        const response = await openai!.chat.completions.create({
            model: "gpt-4o-mini", // fast and cheap
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error("No array returned from OpenAI");

        // The result might be an object containing the array if json_object format is strict.
        const parsed = JSON.parse(result);
        const scoredArray = parsed.leads || parsed.results || (Array.isArray(parsed) ? parsed : Object.values(parsed)[0]);

        if (!Array.isArray(scoredArray)) {
            throw new Error("Failed to parse array from OpenAI");
        }

        return leads.map((lead, index) => ({
            ...lead,
            opportunityScore: scoredArray[index]?.opportunityScore || 5,
            aiReasoning: scoredArray[index]?.aiReasoning || "AI scoring fallback",
            conversionLikelihood: scoredArray[index]?.conversionLikelihood || "Medium"
        }));

    } catch (error) {
        console.error("OpenAI Error:", error);
        // Fallback
        return leads.map(lead => ({
            ...lead,
            opportunityScore: 5,
            aiReasoning: 'AI Service Error',
            conversionLikelihood: 'Low'
        }));
    }
};
