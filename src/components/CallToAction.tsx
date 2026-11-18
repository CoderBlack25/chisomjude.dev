import { RiArrowRightUpLongFill } from "react-icons/ri";

const CallToAction = () => {
  return (
    <section className="mx-auto w-full max-w-2xl px-6">
      <div className="border-b-[0.5px] border-(--border)">
        <div className="flex flex-col space-y-4 py-14">
          <p className="text-xs font-bold uppercase tracking-wider text-(--text-h)">
            Have a project in mind?
          </p>

          <h2 className="max-w-xs text-2xl font-bold tracking-[-0.055em] text-(--accent) sm:text-5xl">
            Let's make something useful and fun.
          </h2>

          <div className="mt-2">
            <a
              href=""
              className="inline-flex items-center gap-1 bg-(--accent) text-black hover:bg-(--text-h) hover:-translate-y-0.5 text-xs font-semibold py-2.25 px-3.5 border border-black transition-[translate,background,border-color] duration-200 ease-[ease]"
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
