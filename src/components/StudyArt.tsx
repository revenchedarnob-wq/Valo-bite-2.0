/**
 * StudyArt — generative CSS artwork per study. No image assets.
 * Shared by the home gallery, the archive index, and detail pages.
 */

export function StudyArt({ slug }: { slug: string }) {
  switch (slug) {
    case "petal-field-pavilion":
      return (
        <div className="relative h-full w-full bg-gradient-to-br from-[#efe9dd] to-[#d8cdb6]">
          <div
            className="absolute inset-0 opacity-70"
            style={{
              background:
                "repeating-conic-gradient(from 12deg at 50% 58%, rgba(179,161,132,0.28) 0deg 14deg, transparent 14deg 34deg)",
            }}
          />
          <div className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fdfcfa,#cbb995_60%,#a08b64)] shadow-[inset_0_2px_10px_rgba(255,255,255,0.9),0_18px_40px_-18px_rgba(33,30,25,0.45)]" />
        </div>
      );
    case "hush-chambers-ii":
      return (
        <div className="relative h-full w-full overflow-hidden bg-[#e9e4d8]">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute rounded-full border border-clay/40"
              style={{
                inset: `${18 + i * 14}%`,
                boxShadow: "inset 0 0 24px rgba(179,161,132,0.25)",
              }}
            />
          ))}
          <div className="absolute top-[38%] left-[38%] h-6 w-6 rounded-full bg-ink/80 blur-[2px]" />
        </div>
      );
    case "alabaster-drift":
      return (
        <div className="relative h-full w-full bg-gradient-to-b from-[#f6f4ee] to-[#ded3bc]">
          <div className="absolute top-1/2 left-1/2 h-28 w-28 -translate-x-1/2 -translate-y-[70%] rounded-full bg-[radial-gradient(circle_at_32%_28%,#ffffff,#dccfb2_55%,#b3a184)] shadow-[inset_0_2px_12px_rgba(255,255,255,0.95),0_22px_44px_-20px_rgba(33,30,25,0.4)]" />
          <div className="absolute inset-x-0 bottom-[22%] h-px bg-gradient-to-r from-transparent via-ink/25 to-transparent" />
          <div className="absolute right-[16%] bottom-[26%] h-10 w-10 rounded-full bg-white/60 blur-md" />
        </div>
      );
    case "meridian-fold":
      return (
        <div className="relative h-full w-full bg-gradient-to-br from-[#ece7db] to-[#cfc2a6]">
          <div
            className="absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(115deg, rgba(33,30,25,0.1) 0px, rgba(33,30,25,0.02) 18px, transparent 42px)",
            }}
          />
          <div className="absolute top-1/2 left-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[2rem] border border-white/70 bg-white/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_20px_48px_-20px_rgba(33,30,25,0.35)] backdrop-blur-sm" />
        </div>
      );
    case "tidal-resonance-hall":
      return (
        <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-[#e8e6df] to-[#b9b3a4]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute right-[12%] h-16 w-16 rounded-full border border-white/70 bg-white/25 backdrop-blur-sm"
              style={{ bottom: `${14 + i * 20}%` }}
            />
          ))}
          <div className="absolute inset-x-0 bottom-0 h-[26%] bg-[linear-gradient(180deg,rgba(87,82,74,0.18),rgba(87,82,74,0.32))]" />
          <div className="absolute bottom-[24%] left-1/2 h-1.5 w-40 -translate-x-1/2 rounded-full bg-clay/50 blur-[3px]" />
        </div>
      );
    case "caustic-garden":
    default:
      return (
        <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-[#211e19] to-[#3d382f]">
          {[
            [22, 30],
            [48, 18],
            [68, 44],
            [36, 58],
            [78, 66],
            [58, 76],
          ].map(([left, top], i) => (
            <div
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-alabaster/90 blur-[0.5px]"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                boxShadow: "0 0 10px 2px rgba(244,243,239,0.5)",
              }}
            />
          ))}
          <div className="absolute bottom-[18%] left-[15%] right-[15%] h-10 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(179,161,132,0.35),transparent_70%)]" />
        </div>
      );
  }
}