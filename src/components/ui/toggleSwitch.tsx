"use client";

type Props = {
  id?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
};

export default function ToggleSwitch({ id, checked, onChange }: Props) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        "relative inline-flex items-center",
        "w-[44px] h-[24px] rounded-full transition-colors",
        checked ? "bg-[#961515]" : "bg-neutral-300",
      ].join(" ")}
    >
      <span
        className={[
          "absolute left-0 top-0 m-[3px] h-[18px] w-[18px] rounded-full bg-white transition-transform",
          checked ? "translate-x-[20px]" : "translate-x-0",
        ].join(" ")}
      />
      <span className="sr-only">Toggle</span>
    </button>
  );
}
