import axios from "axios";

/**
 * Get artist name from TVDB API using IMDB ID
 * @param imdbId - IMDB ID (e.g., "tt3881914")
 * @returns Promise<string | null> - Artist name or null if not found/failed
 */
export async function getArtistNameFromTVDB(imdbId: string): Promise<string | null> {
  try {
    const response = await axios.get(`https://thetvdb.com/api/GetSeriesByRemoteID.php?imdbid=${imdbId}`, {
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    // Parse XML response to extract SeriesName
    const xmlText = response.data;
    const seriesNameMatch = xmlText.match(/<SeriesName>([^<]+)<\/SeriesName>/);

    if (seriesNameMatch && seriesNameMatch[1] && seriesNameMatch[1].trim()) {
      return seriesNameMatch[1].trim();
    }

    return null;
  } catch (error) {
    console.log(`[TVDB] API failed for IMDB ID: ${imdbId}. Error:`, error);
    return null;
  }
}
