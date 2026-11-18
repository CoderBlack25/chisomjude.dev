import "dotenv/config";

import express from "express";
import { rateLimit } from "express-rate-limit";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const app = express();

const PORT = Number(process.env.PORT) || 3001;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

// Cache successful responses for five minutes.
const CACHE_TTL = 5 * 60 * 1000;
const cache = new Map();

app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));

// Limit requests to prevent unnecessary API usage.
const contributionsLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please try again shortly.",
  },
});

const CONTRIBUTIONS_QUERY = `
  query (
    $login: String!
    $from: DateTime!
    $to: DateTime!
  ) {
    user(login: $login) {
      login
      name
      url

      contributionsCollection(
        from: $from
        to: $to
      ) {
        contributionCalendar {
          totalContributions

          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
              weekday
            }
          }
        }
      }
    }
  }
`;

/**
 * Returns an ISO date-time range covering the last 365 days,
 * including today.
 */
function getDateRange() {
  const today = new Date();

  const end = new Date(
    Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      23,
      59,
      59,
    ),
  );

  const start = new Date(end);

  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - 364);

  return {
    from: start.toISOString(),
    to: end.toISOString(),
  };
}

/**
 * Fetches contribution data from GitHub's GraphQL API.
 */
async function fetchContributions() {
  const { from, to } = getDateRange();

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({
      query: CONTRIBUTIONS_QUERY,
      variables: {
        login: GITHUB_USERNAME,
        from,
        to,
      },
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const error = new Error(`GitHub API returned HTTP ${response.status}.`);

    error.status = response.status;
    throw error;
  }

  const result = await response.json();

  if (result.errors?.length) {
    console.error("GitHub GraphQL errors:", result.errors);

    throw new Error(
      result.errors[0]?.message || "GitHub GraphQL request failed.",
    );
  }

  const user = result.data?.user;

  if (!user) {
    const error = new Error("GitHub user was not found.");
    error.status = 404;
    throw error;
  }

  const calendar = user.contributionsCollection?.contributionCalendar;

  if (!calendar) {
    throw new Error("GitHub did not return contribution calendar data.");
  }

  return {
    user: {
      login: user.login,
      name: user.name,
      profileUrl: user.url,
    },
    totalContributions: calendar.totalContributions,
    weeks: calendar.weeks,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * GET /api/github/contributions
 */
app.get("/api/github/contributions", contributionsLimiter, async (req, res) => {
  try {
    if (!GITHUB_USERNAME || !GITHUB_TOKEN) {
      console.error("Missing GitHub environment variables.");

      return res.status(500).json({
        error: "GitHub integration is not configured.",
      });
    }

    const cacheKey = GITHUB_USERNAME.toLowerCase();
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      res.set("Cache-Control", "public, max-age=300");

      return res.json(cached.data);
    }

    const data = await fetchContributions();

    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    res.set("Cache-Control", "public, max-age=300");

    return res.json(data);
  } catch (error) {
    console.error("Contribution API error:", error);

    if (error.name === "TimeoutError" || error.name === "AbortError") {
      return res.status(504).json({
        error: "GitHub took too long to respond. Please try again.",
      });
    }

    if (error.status === 404) {
      return res.status(404).json({
        error: "GitHub user was not found. Check your username.",
      });
    }

    if (error.status === 401 || error.status === 403) {
      return res.status(502).json({
        error: "GitHub authentication failed or the API limit was reached.",
      });
    }

    return res.status(502).json({
      error: "Unable to retrieve GitHub contributions.",
    });
  }
});

// Serve the React production build when available.
const distPath = path.join(projectRoot, "dist");
const indexPath = path.join(distPath, "index.html");

if (existsSync(indexPath)) {
  app.use(express.static(distPath));

  // React SPA fallback.
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api/")) {
      return next();
    }

    return res.sendFile(indexPath);
  });
}

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
