import { RiArrowRightUpLongFill } from "react-icons/ri";

const CallToAction = () => {
  return (
    <section
      aria-labelledby="cta-heading"
      className="mx-auto w-full max-w-2xl px-4 sm:px-6"
    >
      <div className="border-b-[0.5px] border-(--border)">
        <div className="flex flex-col space-y-4 py-14">
          <p className="text-xs font-bold uppercase tracking-wider text-(--text-h)">
            Have a project in mind?
          </p>

          <h2
            id="cta-heading"
            className="max-w-xs text-2xl font-bold tracking-[-0.055em] text-(--accent) sm:max-w-md sm:text-4xl md:max-w-lg md:text-5xl"
          >
            Let's make something useful and fun.
          </h2>

          <div className="mt-2">
            <a
              href="mailto:koderblac@gmail.com"
              aria-label="Let's talk via email"
              className="inline-flex min-h-11 items-center justify-center gap-1.5 bg-(--accent) text-black hover:bg-(--text-h) hover:-translate-y-0.5 text-xs font-semibold py-2.5 px-4 border border-black transition-[translate,background,border-color] duration-200 ease-[ease] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--text-h) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg)"
            >
              <span>Let's talk</span>
              <RiArrowRightUpLongFill className="text-xs" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
