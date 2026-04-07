"use client"

import { ScrollRevealText } from "@/components/ui/scroll-reveal-text"

const projects = [
  {
    number: "01",
    title: "FACIAL RECOGNITION SYSTEM",
    description: "Anti-counterfeiting using AWS Rekognition + Liveness Detection",
    tags: ["AWS", "Node.js", "TypeScript", "AI"],
  },
  {
    number: "02",
    title: "AGRICULTURAL ERP",
    description: "Full ERP with IoT sensors for real-time crop monitoring",
    tags: ["Node.js", "TypeScript", "IoT", "MySQL"],
  },
  {
    number: "03",
    title: "BLOCKCHAIN TRACEABILITY",
    description: "Tamper-proof supply chain records using blockchain + IPFS",
    tags: ["Blockchain", "IPFS", "Node.js", "AWS"],
  },
]

export function ProjectsSection() {
  return (
    <section id="projects" className="py-32 px-6 md:px-12 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Label - Space Mono */}
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[rgba(255,255,255,0.38)] block">
          SELECTED WORK
        </span>

        <h2 className="font-sans text-[clamp(52px,10.8vw,160px)] font-semibold uppercase leading-none tracking-[-0.02em] mt-6 mb-16">
          <ScrollRevealText as="span" className="block" fromMuted="rgba(255,255,255,0.35)">
            PROJECTS.
          </ScrollRevealText>
        </h2>

        {/* Projects List */}
        <div>
          {projects.map((project, index) => (
            <div
              key={project.number}
              className={`group flex flex-col md:flex-row items-start md:items-center gap-6 py-8 border-b border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.02)] transition-all cursor-pointer px-4 -mx-4 ${
                index === 0 ? 'border-t border-[rgba(255,255,255,0.1)]' : ''
              }`}
            >
              {/* Number */}
              <span className="font-mono text-[48px] font-bold text-[rgba(255,255,255,0.1)] w-24 shrink-0">
                {project.number}
              </span>

              {/* Content */}
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

              {/* Tags + Arrow */}
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
