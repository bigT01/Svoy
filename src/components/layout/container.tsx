import React from "react";

type Props = React.PropsWithChildren<{ className?: string }>;

export default function Container({ className = "", children }: Props) {
  return (
    <div
      className={[
        "mx-auto w-full",
        "max-w-[1280px] 2xl:max-w-[1440px]",
        "px-4 xs:px-5 md:px-6 lg:px-8",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
