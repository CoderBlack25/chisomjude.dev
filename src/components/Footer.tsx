interface SocialLink {
  label: string;
  href: string;
}

const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: "Email", href: "mailto:koderblac@gmail.com" },
  { label: "GitHub", href: "https://github.com/CoderBlack25" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/chisom-chukwuma-80b033205/",
  },
  { label: "X", href: "https://x.com/logicdey4u" },
] as const;

const OWNER_NAME = "Chisom Jude";

export default function Footer(): React.JSX.Element {
  const year: number = new Date().getFullYear();

  return (
    <footer className="w-full">
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:gap-4 sm:text-left px-4 sm:px-6 py-5 text-xs font-medium text-(--text)">
        <p>
          &copy; {year} {OWNER_NAME}
        </p>

        <nav aria-label="Social links">
          <ul className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {SOCIAL_LINKS.map(({ label, href }) => {
              const isExternal: boolean = href.startsWith("http");

              return (
                <li key={label}>
                  <a
                    href={href}
                    {...(isExternal && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                    className="inline-flex min-h-11 items-center py-2.5 px-1 transition-colors duration-200 hover:text-(--text-h) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--text-h) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg) rounded-xs"
                  >
                    <span>{label}</span>
                    {isExternal && (
                      <span className="sr-only"> (opens in a new tab)</span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
