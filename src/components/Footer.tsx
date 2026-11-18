interface SocialLink {
  label: string;
  href: string;
}

const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: "Email", href: "mailto:you@example.com" },
  { label: "GitHub", href: "https://github.com/your-username" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/your-username" },
] as const;

const OWNER_NAME = "Chisom Jude";

export default function Footer(): React.JSX.Element {
  const year: number = new Date().getFullYear();

  return (
    <footer className="w-full">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-6 py-5 text-xs font-medium text-(--text)">
        <p>
          &copy; {year} {OWNER_NAME}
        </p>

        <nav aria-label="Social links">
          <ul className="flex items-center gap-6">
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
                    className="transition-colors duration-200 hover:text-(--text-h)"
                  >
                    {label}
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
