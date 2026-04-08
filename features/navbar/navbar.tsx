"use client"

import { useState } from "react"

import { siteConfig } from "@/config/site"
import content from "@/constants/content.json"

const { navLinks, name, ctaHref, ctaLabel } = siteConfig
const { toggleMenuAria } = content.nav

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-12 py-6">
      <div className="flex items-center justify-between">
        {/* Logo - Syne Extra Bold */}
        <a 
          href="#" 
          className="font-sans font-extrabold text-[20px] tracking-[0.15em] uppercase text-white"
        >
          {name}
        </a>

        {/* Desktop Nav - Space Mono */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[12px] uppercase tracking-[0.1em] text-[rgba(255,255,255,0.7)] hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <a
          href={ctaHref}
          className="hidden md:block font-sans font-bold text-[13px] uppercase tracking-[0.1em] px-6 py-3 border border-[rgba(255,255,255,0.2)] text-[rgba(255,255,255,0.7)] hover:border-white hover:text-white transition-all"
        >
          {ctaLabel}
        </a>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white p-2"
          aria-label={toggleMenuAria}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black border-t border-[rgba(255,255,255,0.1)] mt-6 pt-6">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-mono text-[12px] uppercase tracking-[0.1em] text-[rgba(255,255,255,0.7)] hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href={ctaHref}
              onClick={() => setIsOpen(false)}
              className="font-sans font-bold text-[13px] uppercase tracking-[0.1em] px-6 py-3 border border-[rgba(255,255,255,0.2)] text-[rgba(255,255,255,0.7)] w-fit"
            >
              {ctaLabel}
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
