/**
 * Configuración central del sitio: metadatos, navegación y copy reutilizable.
 * Evita duplicar strings entre layout, navbar y futuras rutas.
 */
export const siteConfig = {
  name: "JCYC",
  title: "Juan Camilo Yonda Conda | Senior Fullstack & AI Engineer",
  description:
    "Senior Fullstack Engineer and Applied AI Engineer based in Colombia. Specializing in cloud infrastructure, AI systems, and cutting-edge web technologies.",
  navLinks: [
    { href: "#about", label: "ABOUT" },
    { href: "#projects", label: "PROJECTS" },
    { href: "#experience", label: "EXPERIENCE" },
    { href: "#ai", label: "AI" },
    { href: "#contact", label: "CONTACT" },
  ] as const,
  ctaLabel: "Let's Talk",
  ctaHref: "#contact",
} as const

export type NavLink = (typeof siteConfig.navLinks)[number]
