import Image from "next/image";

export default function BrandLogo({ compact = false, className = "" }) {
  const size = compact ? 36 : 44;

  return (
    <span
      className={`relative inline-flex items-center justify-center shrink-0 ${
        compact ? "h-12 w-15" : "h-12 w-12 sm:h-13 sm:w-12"
      } ${className}`}
      role="img"
      aria-label="EduLearn"
    >
      <Image
        src="/logo.png"
        alt="EduLearn"
        width={size}
        height={size}
        className="w-full h-full object-contain drop-shadow-xs"
        priority
      />
    </span>
  );
}
