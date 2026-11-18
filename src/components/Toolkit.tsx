import type { CSSProperties, ReactNode } from "react";

export interface ToolkitItem {
  id: string;
  name: string;
  icon: ReactNode;
  brandColor?: string;
}

interface ToolkitProps {
  items: ToolkitItem[];
  eyebrow?: string;
  title?: string;
}

export default function Toolkit({
  items,
  eyebrow = "TOOLKIT",
  title = "Technologies I work with",
}: ToolkitProps) {
  return (
    <section
      aria-labelledby="toolkit-heading"
      className="mx-auto w-full max-w-2xl px-6"
    >
      <div className="border-b-[0.5px] border-(--border)">
        <div className="flex flex-col space-y-8 py-14">
          <div className="mb-6 space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-(--text-h)">
              {eyebrow}
            </p>

            <h2 className="text-2xl font-bold tracking-[-0.055em] text-(--accent) sm:text-[1.55rem]">
              {title}
            </h2>
          </div>

          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {items.map((item) => (
              <li
                key={item.id}
                style={
                  {
                    "--brand-color": item.brandColor ?? "currentColor",
                  } as CSSProperties
                }
                className="group flex min-h-10 cursor-pointer items-center gap-2.5 border border-(--border) px-1.5 py-2 transition-colors duration-200 hover:border-(--text-h) motion-reduce:transition-none"
              >
                <span
                  aria-hidden="true"
                  className="flex size-5 shrink-0 items-center justify-center transition-colors duration-200 group-hover:text-(--brand-color) motion-reduce:transition-none"
                >
                  {item.icon}
                </span>

                <span className="truncate text-xs font-medium text-(--text) transition-colors duration-200 group-hover:text-(--accent) motion-reduce:transition-none">
                  {item.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
