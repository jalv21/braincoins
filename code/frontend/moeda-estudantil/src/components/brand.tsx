import logo from "@/assets/braincoins-logo.png";

export function BrainLogo({ size = 56 }: { size?: number }) {
  return (
    <img
      src={logo}
      alt="BrainCoins"
      width={size}
      height={size}
      className="rounded-full shadow-[var(--shadow-mint)] object-contain"
      style={{ width: size, height: size }}
    />
  );
}

export function BrandHeader({ subtitle }: { subtitle?: string }) {
  return (
    <div className="flex items-center gap-4">
      <BrainLogo size={64} />
      <div>
        <h1 className="text-3xl font-bold text-white text-shadow-soft tracking-tight">BrainCoins</h1>
        {subtitle && <p className="text-sm text-white/80">{subtitle}</p>}
      </div>
    </div>
  );
}

export { logo as brainLogoSrc };
