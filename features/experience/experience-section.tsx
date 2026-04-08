"use client"

import { ScrollRevealText } from "@/components/ui/scroll-reveal-text"
import content from "@/constants/content.json"
import {
  Experience3DIcon,
  type ExperienceIconVariant,
} from "./experience-3d-icon"

const { experience } = content

export function ExperienceSection() {
  return (
    <section id="experience" className="py-32 px-6 md:px-12 bg-black">
      <div className="max-w-7xl mx-auto">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[rgba(255,255,255,0.38)] block">
          {experience.label}
        </span>

        <h2 className="font-sans text-[clamp(36px,6vw,56px)] font-extrabold uppercase leading-none tracking-[-0.02em] mt-6 mb-16">
          <ScrollRevealText as="span" className="block" fromMuted="rgba(255,255,255,0.35)">
            {experience.title}
          </ScrollRevealText>
        </h2>

        <div className="relative">
          <div className="absolute left-[22px] top-3 bottom-3 w-px bg-[rgba(255,255,255,0.1)]" />

          <div className="space-y-14">
            {experience.items.map((exp) => (
              <div key={exp.company} className="relative pl-20">
                <div className="absolute left-0 top-0">
                  <Experience3DIcon variant={exp.iconVariant as ExperienceIconVariant} />
                </div>

                <div>
                  <h3 className="font-sans text-[24px] font-extrabold uppercase">
                    <ScrollRevealText as="span" className="block" fromMuted="rgba(255,255,255,0.35)">
                      {exp.company}
                    </ScrollRevealText>
                  </h3>
                  <p className="font-mono text-[12px] text-[rgba(255,255,255,0.45)] mt-1 uppercase tracking-widest">
                    {exp.role} · {exp.date}
                  </p>
                  <p className="font-mono text-[13px] text-[rgba(255,255,255,0.45)] mt-4 max-w-xl leading-[1.8]">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
