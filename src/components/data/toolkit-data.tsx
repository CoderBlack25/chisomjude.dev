import type { ToolkitItem } from "../Toolkit";
import FigmaIcon from "@/components/icons/FigmaIcon";
import { FaReact, FaHtml5 } from "react-icons/fa";
import { FaCss, FaGitAlt, FaCloudflare } from "react-icons/fa6";
import { SiTypescript, SiSupabase, SiVite } from "react-icons/si";
import { IoLogoJavascript, IoLogoGithub } from "react-icons/io5";
import { RiNextjsFill, RiTailwindCssFill, RiNodejsLine } from "react-icons/ri";
import { TbApi } from "react-icons/tb";

export const toolkitItems: ToolkitItem[] = [
  {
    id: "html",
    name: "HTML",
    icon: <FaHtml5 />,
    brandColor: "#E34F26",
  },
  {
    id: "css",
    name: "CSS",
    icon: <FaCss />,
    brandColor: "#1572B6",
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: <IoLogoJavascript />,
    brandColor: "#F7DF1E",
  },
  {
    id: "react",
    name: "React",
    icon: <FaReact />,
    brandColor: "#61DAFB",
  },
  {
    id: "nextjs",
    name: "Next.js",
    icon: <RiNextjsFill />,
    brandColor: "#FFFFFF",
  },
  {
    id: "typescript",
    name: "TypeScript",
    icon: <SiTypescript />,
    brandColor: "#3178C6",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    icon: <RiTailwindCssFill />,
    brandColor: "#06B6D4",
  },
  {
    id: "nodejs",
    name: "Node.js",
    icon: <RiNodejsLine />,
    brandColor: "#5FA04E",
  },
  {
    id: "api",
    name: "APIs",
    icon: <TbApi />,
    brandColor: "#94A3B8",
  },
  {
    id: "supabase",
    name: "Supabase",
    icon: <SiSupabase />,
    brandColor: "#3FCF8E",
  },
  {
    id: "git",
    name: "GIT",
    icon: <FaGitAlt />,
    brandColor: "#F05032",
  },
  {
    id: "github",
    name: "GitHub",
    icon: <IoLogoGithub />,
    brandColor: "#FFFFFF",
  },
  {
    id: "vite",
    name: "Vite",
    icon: <SiVite />,
    brandColor: "#646CFF",
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    icon: <FaCloudflare />,
    brandColor: "#F38020",
  },
  {
    id: "figma",
    name: "Figma",
    icon: <FigmaIcon />,
  },
];
