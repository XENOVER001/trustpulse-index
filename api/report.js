/**
 * Vercel Serverless Function: api/report.js
 * 
 * Securely reads 'process.env.MY_GITHUB_TOKEN', fetches public/index.html from 
 * GitHub, decodes the base64 content stream, prepends the new user submission 
 * inside the 'const trustRegistryData = [];' ledger array, and commits the 
 * updated file back to the repository.
 */

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { handle, platform, reviewText } = req.body;

    if (!handle || !platform || !reviewText) {
      return res.status(400).json({ error: "Missing required parameters (handle, platform, reviewText)." });
    }

    const githubToken = process.env.MY_GITHUB_TOKEN;
    if (!githubToken) {
      return res.status(500).json({
        error: "Configuration Error: MY_GITHUB_TOKEN environment variable is missing on the server."
      });
    }

    // Determine repo owner and name from GITHUB_REPOSITORY (e.g. "owner/repo") or MY_GITHUB_REPO
    const repoFullName = process.env.GITHUB_REPOSITORY || process.env.MY_GITHUB_REPO;
    if (!repoFullName) {
      return res.status(500).json({
        error: "Configuration Error: GITHUB_REPOSITORY or MY_GITHUB_REPO environment variable is missing on the server."
      });
    }

    const [owner, repo] = repoFullName.split("/");
    if (!owner || !repo) {
      return res.status(500).json({
        error: "Configuration Error: Repository environment variable must be in 'owner/repo' format."
      });
    }

    const filePath = process.env.GITHUB_FILE_PATH || "public/index.html";
    const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    // 1. Fetch file details from GitHub to get current content & SHA
    const fetchResponse = await fetch(githubApiUrl, {
      method: "GET",
      headers: {
        "Authorization": `token ${githubToken}`,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "TrustPulse-Vercel-App"
      }
    });

    if (!fetchResponse.ok) {
      const errText = await fetchResponse.text();
      return res.status(fetchResponse.status).json({
        error: `Failed to fetch '${filePath}' from GitHub repository. Ensure the file exists and the token has correct permissions.`,
        details: errText
      });
    }

    const fileData = await fetchResponse.json();
    const sha = fileData.sha;
    // Decode base64 content
    const decodedHtml = Buffer.from(fileData.content, "base64").toString("utf-8");

    // 2. Inject incoming user submission into 'const trustRegistryData = [];'
    const newEntry = {
      id: `DISP-${Math.floor(Math.random() * 900000 + 100000)}`,
      handle: handle.trim(),
      platform: platform.trim(),
      reportText: reviewText.trim(),
      frictionScore: 4, // default dispute rating
      timestamp: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    const regex = /const\s+trustRegistryData\s*=\s*\[([\s\S]*?)\];/;
    let modifiedHtml = decodedHtml;

    if (regex.test(decodedHtml)) {
      modifiedHtml = decodedHtml.replace(regex, (match, p1) => {
        const inner = p1.trim();
        const entryStr = JSON.stringify(newEntry, null, 2);
        if (inner === "") {
          return `const trustRegistryData = [\n  ${entryStr}\n];`;
        } else {
          return `const trustRegistryData = [\n  ${entryStr},\n  ${inner}\n];`;
        }
      });
    } else {
      return res.status(500).json({
        error: "Parsing Error: Could not locate 'const trustRegistryData = [];' array declaration inside target file on GitHub."
      });
    }

    // 3. Re-encode updated HTML to base64
    const updatedContentBase64 = Buffer.from(modifiedHtml, "utf-8").toString("base64");

    // 4. PUT updated file back to GitHub
    const putResponse = await fetch(githubApiUrl, {
      method: "PUT",
      headers: {
        "Authorization": `token ${githubToken}`,
        "Content-Type": "application/json",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "TrustPulse-Vercel-App"
      },
      body: JSON.stringify({
        message: "🤖 Community Entry Log",
        content: updatedContentBase64,
        sha: sha
      })
    });

    if (!putResponse.ok) {
      const putErrText = await putResponse.text();
      return res.status(putResponse.status).json({
        error: "Failed to commit updated file to GitHub.",
        details: putErrText
      });
    }

    return res.status(200).json({
      success: true,
      message: "Submission saved and committed successfully to GitHub ledger!",
      entry: newEntry
    });

  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: error.message || "An internal error occurred." });
  }
}
