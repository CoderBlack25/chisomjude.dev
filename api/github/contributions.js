const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

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

let cachedData = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  if (!GITHUB_USERNAME || !GITHUB_TOKEN) {
    console.error(
      "Missing GitHub environment variables on Vercel: GITHUB_USERNAME or GITHUB_TOKEN is undefined.",
    );
    return res.status(500).json({
      error:
        "GitHub integration is not configured. Missing GITHUB_USERNAME or GITHUB_TOKEN in Vercel environment variables.",
    });
  }

  if (cachedData && Date.now() - cacheTimestamp < CACHE_TTL) {
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=60",
    );
    return res.status(200).json(cachedData);
  }

  try {
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
      console.error(
        `GitHub API HTTP error: ${response.status} ${response.statusText}`,
      );
      const isAuthError = response.status === 401 || response.status === 403;
      return res.status(isAuthError ? 502 : response.status).json({
        error: isAuthError
          ? "GitHub authentication failed or API limit reached. Check your GITHUB_TOKEN."
          : `GitHub API returned HTTP ${response.status}.`,
      });
    }

    const result = await response.json();

    if (result.errors?.length) {
      console.error("GitHub GraphQL errors:", JSON.stringify(result.errors));
      return res.status(502).json({
        error: result.errors[0]?.message || "GitHub GraphQL request failed.",
      });
    }

    const user = result.data?.user;

    if (!user) {
      console.error(`GitHub user not found: "${GITHUB_USERNAME}"`);
      return res.status(404).json({
        error: `GitHub user "${GITHUB_USERNAME}" was not found. Check GITHUB_USERNAME.`,
      });
    }

    const calendar = user.contributionsCollection?.contributionCalendar;

    if (!calendar) {
      console.error("GitHub did not return contribution calendar data.");
      return res.status(502).json({
        error: "GitHub did not return contribution calendar data.",
      });
    }

    const data = {
      user: {
        login: user.login,
        name: user.name,
        profileUrl: user.url,
      },
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks,
      updatedAt: new Date().toISOString(),
    };

    cachedData = data;
    cacheTimestamp = Date.now();

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=60",
    );
    return res.status(200).json(data);
  } catch (error) {
    console.error("Contribution API error on Vercel:", error);

    if (error.name === "TimeoutError" || error.name === "AbortError") {
      return res.status(504).json({
        error: "GitHub took too long to respond. Please try again.",
      });
    }

    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Unable to retrieve GitHub contributions.",
    });
  }
}
