import { RiArrowRightUpLongFill } from "react-icons/ri";

const Hero = () => {
  return (
    <section
      aria-labelledby="hero-name"
      className="w-full mx-auto max-w-2xl px-4 sm:px-6"
    >
      <div className="border-b-[0.5px] border-(--border)">
        <div className="flex flex-col space-y-8 py-14">
          <h1 className="uppercase font-bold text-xs tracking-wider text-(--text-h)">
            Frontend Developer
          </h1>

          <div className="flex items-center gap-4 sm:gap-5">
            <img
              src="/my-image.webp"
              alt="Chisom Jude"
              className="size-16 shrink-0 sm:size-20 md:size-24"
            />
            <h2
              id="hero-name"
              className="text-(--accent) text-[clamp(2rem,10vw,4.75rem)] tracking-[-0.08em] font-bold"
            >
              Chisom Jude
            </h2>
          </div>

          <p className="text-(--text) leading-7">
            I’m Chisom, a frontend developer focused on building clean, fast,
            and intuitive interfaces. I pay close attention to the details that
            make products enjoyable to use, from thoughtful layouts and
            responsiveness to subtle interactions. I’m constantly learning,
            refining my skills, and pushing myself to build better experiences.
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            <a
              href="#"
              aria-label="View Chisom Jude's resume"
              className="inline-flex min-h-11 items-center justify-center bg-(--accent) text-black hover:bg-(--text-h) hover:-translate-y-0.5 text-xs font-semibold py-2.5 px-4 border border-black transition-[translate,background,border-color] duration-200 ease-[ease] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--text-h) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg)"
            >
              View resume
            </a>
            <a
              href="mailto:koderblac@gmail.com"
              aria-label="Say hello via email"
              className="inline-flex min-h-11 items-center gap-1 py-2 text-(--accent) text-xs font-bold hover:text-(--text-h) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--text-h) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg) rounded-xs"
            >
              <span className="underline underline-offset-6 decoration-(--accent)">
                Say hello
              </span>
              <RiArrowRightUpLongFill className="text-xs" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
