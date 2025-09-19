"use client";

import DishCard, { type Dish } from "@/components/menu/dishCard";

export default function MenuGroup({
  id,
  title,
  items,
  first = false
}: {
  id?: string;
  title: string;
  items: Dish[];
  first?: boolean;
}) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-title` : undefined}
      className={[
        "mx-auto w-full max-w-[1040px] px-4",
        first ? "mt-12 lg:mt-[117px]" : "mt-16 lg:mt-20"
      ].join(" ")}
    >
      <h3 id={id ? `${id}-title` : undefined}
          className="font-raleway font-bold text-[#961515] text-[22px] tb:text-[26px] lg:text-[28px] leading-[1.1]">
        {title}
      </h3>

      <div className="mt-6 lg:mt-12" />

      <div className="divide-y divide-[#E4C7C7]">
        {items.map((dish, idx) => (
          <DishCard key={dish.id} dish={dish} showTopDivider={idx > 0} />
        ))}
      </div>
    </section>
  );
}
