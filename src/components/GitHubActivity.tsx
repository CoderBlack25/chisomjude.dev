import GitHubContributions from "@/components/GitHubContributions";

const GitHubActivity = () => {
  return (
    <section
      aria-labelledby="github-activity-heading"
      className="mx-auto w-full max-w-2xl px-4 sm:px-6"
    >
      <div className="border-b-[0.5px] border-(--border)">
        <div className="flex flex-col space-y-4 py-14">
          <p className="text-xs font-bold uppercase tracking-wider text-(--text-h)">
            Open Source
          </p>

          <h2
            id="github-activity-heading"
            className="text-2xl font-bold tracking-[-0.055em] text-(--accent) sm:text-[1.55rem]"
          >
            Github activity
          </h2>

          <GitHubContributions />
        </div>
      </div>
    </section>
  );
};

export default GitHubActivity;
