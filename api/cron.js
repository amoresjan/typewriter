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
    const backendUrl = process.env.VITE_API_URL;
    if (!backendUrl) {
      throw new Error("VITE_API_URL is not defined");
    }

    const res = await fetch(`${backendUrl}/api/news/generate/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cronSecret}`,
      },
    });

    const data = await res.json();
    return response.status(res.status).json(data);
  } catch (error) {
    return response.status(500).json({ success: false, error: error.message });
  }
}
