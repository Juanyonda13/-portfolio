"use client"

import dynamic from "next/dynamic"

import content from "@/constants/content.json"

const { hero } = content

const IridescentDiamond = dynamic(
  () => import("./iridescent-diamond").then((mod) => mod.IridescentDiamond),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <img
          src={hero.placeholderImage}
          alt=""
          decoding="async"
          fetchPriority="high"
          className="h-full w-full object-contain object-center"
        />
      </div>
    ),
  }
)

const titleLine = hero.titleSegments.join("\u00A0 | \u00A0")

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[64px_64px] opacity-[0.03]"
          aria-hidden
        />
      </div>
      <div className="relative z-10 grid w-full flex-1 grid-cols-1 pb-28 pt-[min(12vh,5rem)] lg:grid-cols-[minmax(0,38rem)_minmax(0,1fr)] lg:items-center lg:gap-x-8 lg:px-12 lg:pb-36 lg:pt-[min(10vh,5rem)] xl:grid-cols-[minmax(0,46rem)_minmax(0,1fr)] xl:gap-x-10">
        <div className="flex w-full min-w-0 flex-col items-start px-6 text-left md:px-10 lg:px-0">
          <p className="mb-5 font-mono text-[11px] tracking-[0.2em] text-[rgba(255,255,255,0.38)]">
            {hero.name}
          </p>

          <h1
            className="hero-word font-sans text-balance font-bold leading-snug tracking-[-0.02em] text-left text-[#9d8bd9]"
            style={{ fontSize: "clamp(22px, 3.6vw, 40px)" }}
          >
            {titleLine}
          </h1>

          <p className="mt-7 max-w-xl font-mono text-[13px] leading-relaxed text-[rgba(255,255,255,0.45)]">
            {hero.paragraph1}
          </p>
          <p className="mt-4 max-w-xl font-mono text-[13px] leading-relaxed text-[rgba(255,255,255,0.45)]">
            {hero.paragraph2}
          </p>

          <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <a
              href={hero.ctaPrimaryHref}
              className="btn-gradient-hover text-center font-sans font-bold text-[13px] uppercase tracking-widest bg-white px-8 py-4 text-black sm:px-9"
            >
              <span>{hero.ctaPrimary}</span>
            </a>
            <a
              href={hero.ctaSecondaryHref}
              className="text-center font-sans font-bold text-[13px] uppercase tracking-widest border border-[rgba(255,255,255,0.2)] px-8 py-4 text-[rgba(255,255,255,0.7)] transition-all hover:border-white hover:text-white sm:px-9"
            >
              {hero.ctaSecondary}
            </a>
          </div>
        </div>

        <div className="relative mt-6 h-[min(46vh,500px)] w-full min-h-[320px] min-w-0 bg-black lg:mt-0 lg:min-h-[min(86vh,780px)] lg:self-stretch">
          <IridescentDiamond />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 sm:bottom-9 sm:gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[rgba(255,255,255,0.38)]">
          {hero.scrollHint}
        </span>
        <div className="h-8 w-px overflow-hidden bg-[rgba(255,255,255,0.2)]">
          <div className="h-full w-full bg-white scroll-line" />
        </div>
      </div>
    </section>
  )
}
