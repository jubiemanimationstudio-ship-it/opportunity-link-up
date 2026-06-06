import { site } from "@/lib/site";

export default function manifest() {
  return {
    name: site.name,
    short_name: "Link-Up",
    description: site.description,
    start_url: "/",
    display: "standalone" as const,
    background_color: "#ffffff",
    theme_color: "#0B2545",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" as const },
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" as const }
    ]
  };
}
