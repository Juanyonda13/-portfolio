import content from "@/constants/content.json"

const { footer } = content

export function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.1)] px-6 md:px-12 py-6 bg-black">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-mono text-[11px] text-[rgba(255,255,255,0.38)] uppercase tracking-[0.1em]">
          {footer.copyright}
        </span>
        <span className="font-mono text-[11px] text-[rgba(255,255,255,0.38)] uppercase tracking-[0.1em]">
          {footer.credit}
        </span>
      </div>
    </footer>
  )
}
