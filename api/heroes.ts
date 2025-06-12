import type { VercelRequest, VercelResponse } from '@vercel/node';

// This function will be accessible at /api/heroes when deployed on Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Access the API key from Vercel's environment variables
  // IMPORTANT: Ensure VITE_MARVEL_RIVALS_API_KEY is set in Vercel project settings
  const API_KEY = process.env.VITE_MARVEL_RIVALS_API_KEY;

  if (!API_KEY) {
    console.error('Vercel API function error: VITE_MARVEL_RIVALS_API_KEY is not set!');
    return res.status(500).json({ error: 'Server configuration error: API key missing.' });
  }

  try {
    const externalApiUrl = `https://marvelrivalsapi.com/api/v1/heroes`;

    // Make the server-side request to the external API
    const response = await fetch(externalApiUrl, {
      method: 'GET',
      headers: {
        'x-api-key': API_KEY, // <-- This is where the API key is finally added!
        'Accept': 'application/json',
        'Accept-Encoding': 'identity', // Keep this to prevent compression issues
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`External API responded with status ${response.status}: ${errorBody}`);
      // Forward the external API's status and a more descriptive error message
      return res.status(response.status).json({
        error: `Failed to fetch from Marvel Rivals API: ${response.statusText}`,
        details: errorBody // Include details for debugging, but consider removing in production
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error: any) {
    console.error('Error in Vercel API function:', error);
    return res.status(500).json({ error: `Internal Server Error: ${error.message || 'Unknown error'}` });
  }
}