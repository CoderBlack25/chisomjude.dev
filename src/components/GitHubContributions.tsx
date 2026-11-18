import { useEffect, useMemo, useState } from "react";
import { RiArrowRightUpLongFill } from "react-icons/ri";

type ContributionLevel =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE";

interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: ContributionLevel;
  weekday: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionsResponse {
  user: {
    login: string;
    name: string | null;
    profileUrl: string;
  };
  totalContributions: number;
  weeks: ContributionWeek[];
  updatedAt: string;
}

const CONTRIBUTION_COLORS: Record<ContributionLevel, string> = {
  NONE: "var(--contribution-0)",
  FIRST_QUARTILE: "var(--contribution-1)",
  SECOND_QUARTILE: "var(--contribution-2)",
  THIRD_QUARTILE: "var(--contribution-3)",
  FOURTH_QUARTILE: "var(--contribution-4)",
};

const WEEKDAYS = ["Sun", "", "Tue", "", "Thu", "", "Sat"];

const numberFormatter = new Intl.NumberFormat("en-US");

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function formatContributionLabel(day: ContributionDay) {
  const count = day.contributionCount;

  const contributionText = count === 1 ? "contribution" : "contributions";

  return `${count} ${contributionText} on ${formatDate(day.date)}`;
}

export default function GitHubContributions() {
  const [data, setData] = useState<ContributionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    const fetchContributions = async () => {
      try {
        const response = await fetch("/api/github/contributions", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        let result: unknown = null;
        try {
          result = await response.json();
        } catch {
          throw new Error(
            `Unable to parse server response (HTTP ${response.status}).`,
          );
        }

        if (!response.ok) {
          let message = `Request failed with status ${response.status}.`;

          if (result && typeof result === "object") {
            const resObj = result as Record<string, unknown>;
            if (typeof resObj.error === "string") {
              message = resObj.error;
            } else if (
              resObj.error &&
              typeof resObj.error === "object" &&
              "message" in resObj.error &&
              typeof (resObj.error as { message: unknown }).message === "string"
            ) {
              message = (resObj.error as { message: string }).message;
            } else if (typeof resObj.message === "string") {
              message = resObj.message;
            }
          }

          throw new Error(message);
        }

        if (
          !result ||
          typeof result !== "object" ||
          !("weeks" in result) ||
          !Array.isArray((result as ContributionsResponse).weeks) ||
          !("user" in result) ||
          !(result as ContributionsResponse).user
        ) {
          throw new Error("Invalid contribution data received from server.");
        }

        if (!ignore) {
          setData(result as ContributionsResponse);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading contributions.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void fetchContributions();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [retryCount]);

  // Find the first week containing the first day of each month.
  const monthLabels = useMemo(() => {
    if (!data) return [];

    return data.weeks.flatMap((week, weekIndex) => {
      const firstDayOfMonth = week.contributionDays.find(
        (day) => day.date.slice(-2) === "01",
      );

      if (!firstDayOfMonth) return [];

      const label = new Intl.DateTimeFormat("en-US", {
        month: "short",
        timeZone: "UTC",
      }).format(new Date(`${firstDayOfMonth.date}T00:00:00Z`));

      return [{ label, weekIndex }];
    });
  }, [data]);

  const retry = () => {
    setLoading(true);
    setError(null);
    setRetryCount((count) => count + 1);
  };

  if (loading && !data) {
    return (
      <div className="w-full space-y-5">
        <div className="animate-pulse space-y-2">
          <div className="h-5 w-40 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-56 rounded bg-slate-200 dark:bg-slate-800" />
        </div>

        <div className="w-full overflow-x-auto touch-pan-x pb-2">
          <div className="flex min-w-max gap-1">
            {Array.from({ length: 30 }).map((_, index) => (
              <div key={index} className="flex shrink-0 flex-col gap-1">
                {Array.from({ length: 7 }).map((_, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="size-3 animate-pulse rounded-[3px] bg-slate-200 dark:bg-slate-800"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <p role="status" aria-live="polite" className="text-xs text-slate-500">
          Loading GitHub contributions...
        </p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="flex flex-col items-start gap-3 rounded-lg border border-slate-200 p-5 dark:border-slate-800"
      >
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          Unable to load GitHub contributions
        </p>

        <p className="text-sm text-slate-500">{error}</p>

        <button
          type="button"
          onClick={retry}
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 px-4 py-2.5 text-xs font-medium transition-colors hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--text-h) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg)"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { user, weeks, totalContributions, updatedAt } = data;

  return (
    <div className="w-full space-y-6">
      {/* Section heading */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm text-slate-500">
            {numberFormatter.format(totalContributions)} contributions in the
            last year
          </p>
        </div>

        <a
          href={user.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1 py-2 text-(--accent) text-xs font-bold hover:text-(--text-h) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--text-h) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg) rounded-xs"
        >
          <span className="underline underline-offset-6 decoration-(--accent)">
            @{user.login}
          </span>
          <span className="sr-only"> (opens in a new tab)</span>

          <RiArrowRightUpLongFill className="text-xs" aria-hidden="true" />
        </a>
      </div>

      {/* Contribution calendar */}
      <div className="w-full overflow-x-auto touch-pan-x pb-2">
        <div className="min-w-max">
          {/* Month labels */}
          <div
            className="mb-2 grid gap-0.75 pl-8"
            style={{
              gridTemplateColumns: `repeat(${weeks.length}, 12px)`,
            }}
          >
            {monthLabels.map(({ label, weekIndex }) => (
              <span
                key={`${label}-${weekIndex}`}
                className="whitespace-nowrap text-[10px] text-slate-500"
                style={{
                  gridColumn: weekIndex + 1,
                }}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            {/* Weekday labels */}
            <div
              className="grid shrink-0 gap-0.75 text-[9px] text-slate-500"
              style={{
                gridTemplateRows: "repeat(7, 12px)",
              }}
            >
              {WEEKDAYS.map((day, index) => (
                <span key={index} className="flex items-center">
                  {day}
                </span>
              ))}
            </div>

            {/* Contribution squares */}
            <div className="flex gap-0.75">
              {weeks.map((week, weekIndex) => {
                // Ensure every week has exactly seven positions.
                const days = Array.from(
                  { length: 7 },
                  (_, weekday) =>
                    week.contributionDays.find(
                      (day) => day.weekday === weekday,
                    ) ?? null,
                );

                return (
                  <div
                    key={weekIndex}
                    className="grid gap-0.75"
                    style={{
                      gridTemplateRows: "repeat(7, 12px)",
                    }}
                  >
                    {days.map((day, dayIndex) => {
                      if (!day) {
                        return (
                          <span
                            key={dayIndex}
                            aria-hidden="true"
                            className="size-3"
                          />
                        );
                      }

                      return (
                        <div
                          key={day.date}
                          role="img"
                          aria-label={formatContributionLabel(day)}
                          title={formatContributionLabel(day)}
                          className="size-3 rounded-[3px] transition-opacity duration-150 hover:opacity-70"
                          style={{
                            backgroundColor:
                              CONTRIBUTION_COLORS[day.contributionLevel],
                          }}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] text-slate-500">
          Updated{" "}
          {new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(updatedAt))}
        </p>

        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="mr-1 text-[10px] text-slate-500">Less</span>

          {Object.values(CONTRIBUTION_COLORS).map((color, index) => (
            <span
              key={index}
              className="size-3 rounded-[3px]"
              style={{
                backgroundColor: color,
              }}
            />
          ))}

          <span className="ml-1 text-[10px] text-slate-500">More</span>
        </div>
      </div>

      {/* Error indicator if a refresh fails after previous data loaded */}
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="flex items-center justify-between gap-3 text-xs text-red-600 dark:text-red-400"
        >
          <span>{error}. Showing previously loaded data.</span>

          <button
            type="button"
            onClick={retry}
            className="inline-flex min-h-11 items-center py-2 px-1 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--text-h) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg) rounded-xs"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
