"use client";

type Props = {
  targetId: string;
  offset?: number;
  className?: string;
  ariaLabel?: string;
  size?: number; // px
};

export default function ArrowDown({
  targetId,
  offset = 0,
  className = "",
  ariaLabel = "Scroll down",
  size = 28,
}: Props) {
  const onClick = () => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={["bg-transparent p-0 border-0", className].join(" ")}
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
  );
}
