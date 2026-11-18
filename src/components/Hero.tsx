import { RiArrowRightUpLongFill } from "react-icons/ri";

const Hero = () => {
  return (
    <section className="w-full mx-auto max-w-2xl px-6">
      <div className="border-b-[0.5px] border-(--border)">
        <div className="flex flex-col space-y-8 py-14">
          <h1 className="uppercase font-bold text-xs tracking-wider text-(--text-h)">
            Frontend Developer
          </h1>

          <div className="flex items-center gap-5">
            <img
              src="/my-image.webp"
              alt="my profile image"
              className="w-24 h-24"
            />
            <h2 className="text-(--accent) text-[clamp(2.55rem,11.5vw,4.75rem)] tracking-[-0.08em] font-bold">
              Chisom Jude
            </h2>
          </div>

          <p className="text-(--text) leading-7">
            I’m Chisom, a frontend developer who builds clean, fast interfaces.
            I’ve been working professionally for just over a year, and I care a
            lot about the details that make a product feel good to use, from
            layout and responsiveness to small interactions. I’m always pushing
            myself to grow and improve.
          </p>

          <div className="flex items-center gap-5">
            <a
              href=""
              className="inline-block bg-(--accent) text-black hover:bg-(--text-h) hover:-translate-y-0.5 text-xs font-semibold py-2.25 px-3.5 border border-black transition-[translate,background,border-color] duration-200 ease-[ease]"
            >
              View resume
            </a>
            <a
              href=""
              className="inline-flex items-center gap-1 text-(--accent) text-xs font-bold hover:text-(--text-h)"
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
