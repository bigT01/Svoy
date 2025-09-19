"use client";

import Image from "next/image";
import {useTranslations} from "next-intl";

export type Dish = {
  id: any;
  // i18nKey: string; // The API data does not provide this
  name_ru: string;
  name_en: string;
  name_kk: string;
  description_ru: string;
  price: string;
  image: string;
  icons?: string[];   // e.g. ["/icons/menu/vegan.svg", "/icons/menu/spicy.svg"]
  frame?: boolean;
};

function iconMeta(src: string) {
  const vegan = src.includes("vegan");
  const spicy = src.includes("spicy");
  return {
    name: vegan ? "vegan" : spicy ? "spicy" : "icon",
    bg: vegan ? "#1E9E31" : spicy ? "#941A1A" : "transparent",
  };
}

export default function DishCard({
  dish,
  showTopDivider = false
}: { dish: Dish; showTopDivider?: boolean }) {
  // Use the name_ru and description_ru properties directly, without i18n
  const title = dish.name_ru;
  const desc  = dish.description_ru;

  return (
    <article
      className={[
        "w-full bg-white pb-6",
        showTopDivider && "pt-6 border-t border-[#E4C7C7]"
      ].filter(Boolean).join(" ")}
    >
      {/* 2 columns: media (fixed) | content (flex) */}
      <div
        className={[
          "grid items-start gap-3 md:gap-5 lg:pl-[33px]",
          // media column width = left offset + frame
          // mobile: 18 + 157 = 175
          // tablet: 20 + 170 = 190
          // desktop: 20 + 180 = 200
          "grid-cols-[175px_1fr] md:grid-cols-[190px_1fr] lg:grid-cols-[200px_1fr]"
        ].join(" ")}
      >
        {/* ========= MEDIA (frame + circular photo) ========= */}
        <div className="relative h-[157px] md:h-[170px] lg:h-[180px] w-[175px] md:w-[190px] lg:w-[200px]">
          {/* inner box positioned by the left offset (18 / 20 / 20) and sized like the frame */}
          <div className="absolute top-0 left-[18px] md:left-[20px] w-[157px] h-[157px] md:w-[170px] md:h-[170px] lg:w-[180px] lg:h-[180px] flex items-center justify-center">
            {/* frame */}
            {dish.frame !== false && (
              <img
                src="/icons/menu/diagonal-frame.svg"
                alt=""
                className="absolute inset-0 pointer-events-none select-none"
                draggable={false}
              />
            )}

            {/* circular photo centered inside the frame */}
            <div className="relative overflow-hidden rounded-full w-[130px] h-[130px] md:w-[140px] md:h-[140px] lg:w-[150px] lg:h-[150px]">
              <Image
                src={`https://api.svoy-lounge.kz${dish.image}`}
                alt=""
                fill
                sizes="(min-width:1024px) 150px, (min-width:768px) 140px, 130px"
                className="object-cover"
                draggable={false}
                priority={false}
              />
            </div>
          </div>
        </div>

        {/* ========= CONTENT ========= */}
        <div className="min-w-0 md:max-w-[478px] lg:max-w-[720px]">
          {!!title && (
            <h3 className="font-raleway font-semibold uppercase text-[#961515] leading-[1]
                           text-[20px] md:text-[26px] lg:text-[28px]">
              {title}
            </h3>
          )}

          {!!desc && (
            <p className="mt-3 text-[#961515] leading-[1] text-[14px] md:text-[16px]">
              {desc}
            </p>
          )}

          {/* Price + Icons (always one line) */}
          <div className="mt-4 md:mt-6 flex items-center justify-between">
            <div className="font-raleway font-semibold text-[#961515] leading-[1]
                            text-[20px] md:text-[22px] lg:text-[24px]">
              {dish.price}
            </div>

            {!!dish.icons?.length && (
              <div className="flex items-center gap-2 md:gap-3">
                {dish.icons.map((src, i) => {
                  const file = src.endsWith(".svg") ? src : `${src}.svg`;
                  const {name, bg} = iconMeta(file);
                  return (
                    <span
                      key={`${file}-${i}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                      style={{ backgroundColor: bg }}
                      aria-label={name}
                    >
                      <Image src={file} alt={name} width={18} height={18} />
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

// function FilterToggle({label}: {label: string}) {
//   const [checked, setChecked] = useState(false);
//   const id = `flt-${useId()}`;
//   return (
//     <label
//       htmlFor={id}
//       className={cx(
//         "flex-none inline-flex items-center justify-between snap-start cursor-pointer select-none gap-3 lg:gap-4",
//         "min-w-[288px] h-[52px] pl-4 pr-[66px] py-[18px]",
//         "lg:min-w-0 lg:h-[66px] lg:pl-6 lg:pr-[89px] lg:py-[21.5px]"
//       )}
//     >
//       <span
//         className={cx(
//           "font-raleway font-medium text-[14px] leading-[1] transition-opacity",
//           checked ? "text-[#961515] opacity-100" : "text-[#961515] opacity-50"
//         )}
//       >
//         {label}
//       </span>
//       {/* <ToggleSwitch id={id} checked={checked} onChange={setChecked} /> */}
//     </label>
//   );
// }