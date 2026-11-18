//import { RiArrowRightUpLongFill } from "react-icons/ri";

const Projects = () => {
  return (
    <section
      aria-labelledby="projects-heading"
      className="mx-auto w-full max-w-2xl px-4 sm:px-6"
    >
      <div className="border-b-[0.5px] border-(--border)">
        <div className="flex flex-col space-y-4 py-14">
          <p className="text-xs font-bold uppercase tracking-wider text-(--text-h)">
            Selected Works
          </p>

          <h2
            id="projects-heading"
            className="text-2xl font-bold tracking-[-0.055em] text-(--accent) sm:text-[1.55rem]"
          >
            Projects
          </h2>
        </div>
      </div>
    </section>
  );
};

export default Projects;
