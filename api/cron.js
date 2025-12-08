// Retry helper with exponential backoff for cold starts
async function fetchWithRetry(url, options, retries = 3, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok || res.status < 500) {
        return res;
      }
      // Server error, retry
      console.log(`Attempt ${i + 1} failed with status ${res.status}, retrying...`);
    } catch (error) {
      console.log(`Attempt ${i + 1} failed with error: ${error.message}, retrying...`);
    }
    
    if (i < retries - 1) {
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 1.5; // Exponential backoff
    }
  }
  throw new Error(`Failed after ${retries} retries`);
}

export default async function handler(request, response) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers["authorization"];

  // Verify the request is coming from Vercel Cron
  if (authHeader !== `Bearer ${cronSecret}`) {
    return response
      .status(401)
      .json({ success: false, message: "Unauthorized" });
  }

  try {
    const backendUrl = process.env.API_URL;
    if (!backendUrl) {
      throw new Error("API_URL is not defined");
    }

    console.log(`Calling backend at ${backendUrl}/api/news/generate/`);

    const res = await fetchWithRetry(`${backendUrl}/api/news/generate/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cronSecret}`,
      },
    });

    const data = await res.json();
    console.log("Response from backend:", data);
    return response.status(res.status).json(data);
  } catch (error) {
    console.error("Cron job failed:", error.message);
    return response.status(500).json({ success: false, error: error.message });
  }
}
