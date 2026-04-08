"use client"

import { ScrollRevealText } from "@/components/ui/scroll-reveal-text"
import content from "@/constants/content.json"
import { useEffect, useRef, useState } from "react"

const { about } = content

interface StatCardProps {
  value: string
  label: string
  delay: number
}

function StatCard({ value, label, delay }: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  const numericValue = parseInt(value.replace(/\D/g, ""))
  const suffix = value.replace(/\d/g, "")

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const timeout = setTimeout(() => {
      const duration = 1500
      const steps = 30
      const increment = numericValue / steps
      let current = 0

      const interval = setInterval(() => {
        current += increment
        if (current >= numericValue) {
          setCount(numericValue)
          clearInterval(interval)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [isVisible, numericValue, delay])

  return (
    <div
      ref={ref}
      className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.1)] p-7 flex flex-col hover:border-[rgba(255,255,255,0.25)] hover:bg-[rgba(255,255,255,0.04)] transition-all duration-300"
    >
      <span className="font-sans text-[56px] font-extrabold text-white leading-none">
        {count}
        {suffix}
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[rgba(255,255,255,0.38)] mt-2">
        {label}
      </span>
    </div>
  )
}

const ABOUT_TITLE_PASTEL = { r: 168, g: 200, b: 240 } as const
const ABOUT_TITLE_MUTED = "rgba(168, 200, 240, 0.22)"

export function AboutSection() {
  return (
    <section id="about" className="py-32 px-6 md:px-12 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-[60%]">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[rgba(255,255,255,0.38)]">
              {about.label}
            </span>

            <div className="mt-6 mb-8 space-y-0 leading-[0.95]">
              {about.headlineWords.map((word, index) => (
                <div
                  key={index}
                  className="font-sans text-[clamp(48px,8vw,72px)] font-extrabold uppercase"
                >
                  <ScrollRevealText
                    className="block"
                    as="span"
                    fromMuted={ABOUT_TITLE_MUTED}
                    toRgb={ABOUT_TITLE_PASTEL}
                  >
                    {word}
                  </ScrollRevealText>
                </div>
              ))}
            </div>

            <p className="font-mono text-[13px] text-[rgba(255,255,255,0.45)] leading-[1.8] max-w-[480px]">
              {about.body}
            </p>
          </div>

          <div className="lg:w-[40%]">
            <div className="grid grid-cols-2 gap-4">
              {about.stats.map((stat) => (
                <StatCard
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                  delay={stat.delay}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
