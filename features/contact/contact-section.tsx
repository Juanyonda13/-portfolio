"use client"

import { ScrollRevealText } from "@/components/ui/scroll-reveal-text"
import content from "@/constants/content.json"

const { contact } = content

export function ContactSection() {
  return (
    <section id="contact" className="py-32 px-6 md:px-12 bg-black">
      <div className="max-w-[900px] mx-auto text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[rgba(255,255,255,0.38)] mb-8">
          {contact.label}
        </p>

        <div className="mb-12">
          {contact.titleLines.map((line, i) => (
            <h2
              key={i}
              className="font-sans font-extrabold uppercase leading-[0.95] tracking-[-0.02em]"
              style={{ fontSize: "clamp(48px, 12vw, 100px)" }}
            >
              <ScrollRevealText as="span" className="block" fromMuted="rgba(255,255,255,0.35)">
                {line}
              </ScrollRevealText>
            </h2>
          ))}
        </div>

        <div className="overflow-hidden py-6 border-y border-[rgba(255,255,255,0.1)]">
          <div className="marquee-container">
            <div className="marquee-content">
              {[...Array(4)].map((_, i) => (
                <span
                  key={i}
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-[rgba(255,255,255,0.15)] mx-8 whitespace-nowrap"
                >
                  {contact.marquee}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <a
            href={contact.emailHref}
            className="btn-gradient-hover font-sans font-bold text-[13px] uppercase tracking-[0.1em] bg-white text-black px-9 py-4"
          >
            <span>{contact.email}</span>
          </a>
          <a
            href={contact.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans font-bold text-[13px] uppercase tracking-[0.1em] px-9 py-4 border border-[rgba(255,255,255,0.2)] text-[rgba(255,255,255,0.7)] hover:border-white hover:text-white transition-all flex items-center gap-2"
          >
            {contact.linkedinLabel} <span>↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}
