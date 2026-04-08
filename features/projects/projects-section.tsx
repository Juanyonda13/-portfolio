"use client"

import { ScrollRevealText } from "@/components/ui/scroll-reveal-text"
import content from "@/constants/content.json"

const { projects } = content

export function ProjectsSection() {
  return (
    <section id="projects" className="py-32 px-6 md:px-12 bg-black">
      <div className="max-w-7xl mx-auto">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[rgba(255,255,255,0.38)] block">
          {projects.label}
        </span>

        <h2 className="font-sans text-[clamp(52px,10.8vw,160px)] font-semibold uppercase leading-none tracking-[-0.02em] mt-6 mb-16">
          <ScrollRevealText as="span" className="block" fromMuted="rgba(255,255,255,0.35)">
            {projects.title}
          </ScrollRevealText>
        </h2>

        <div>
          {projects.items.map((project, index) => (
            <div
              key={project.number}
              className={`group flex flex-col md:flex-row items-start md:items-center gap-6 py-8 border-b border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.02)] transition-all cursor-pointer px-4 -mx-4 ${
                index === 0 ? "border-t border-[rgba(255,255,255,0.1)]" : ""
              }`}
            >
              <span className="font-mono text-[48px] font-bold text-[rgba(255,255,255,0.1)] w-24 shrink-0">
                {project.number}
              </span>

              <div className="flex-1">
                <h3 className="font-sans text-[24px] md:text-[32px] font-extrabold uppercase tracking-tight">
                  <ScrollRevealText as="span" className="block" fromMuted="rgba(255,255,255,0.35)">
                    {project.title}
                  </ScrollRevealText>
                </h3>
                <p className="font-mono text-[13px] text-[rgba(255,255,255,0.45)] mt-2">
                  {project.description}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden md:flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono px-3 py-1 text-[10px] uppercase tracking-widest border border-[rgba(255,255,255,0.2)] text-[rgba(255,255,255,0.5)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-[20px] text-white opacity-30 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
