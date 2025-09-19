"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useId } from "react";
import { useTranslations, useLocale } from "next-intl"; // Import useLocale
import { useParams } from "next/navigation";
import ToggleSwitch from "@/components/ui/toggleSwitch";
import MenuGroup from "@/components/menu/menuGroup";
import axios from "axios";

// --- Utility Functions ---
function cx(...p: Array<string | boolean | null | undefined>) {
  return p.filter(Boolean).join(" ");
}

/**
 * Gets the localized text for a given field based on the current locale.
 * Fallbacks to Russian if the requested locale is not available.
 */
function getLocalizedText(
  item: any,
  locale: string,
  field: "title" | "name" | "description"
): string {
  const key = `${field}_${locale === "kz" ? "kk" : locale}`; // Map 'kz' to 'kk'
  // Safely check for the key, and fall back to Russian
  return item[key] || item[`${field}_ru`] || "";
}

// --- Interfaces for API data ---
interface Dish {
  id: number;
  name_ru: string;
  name_en: string | null;
  name_kk: string | null;
  price: string;
  description_ru: string;
  description_kk: string | null;
  description_en: string | null;
  image: string;
  i18nKey?: string;
}

interface Category {
  id: number;
  name_ru: string;
  name_en: string | null;
  name_kk: string | null;
  description_ru: string;
  description_kk: string | null;
  description_en: string | null;
  dishes: number[];
}

interface Menu {
  id: number;
  title_ru: string;
  title_kk: string | null;
  title_en: string | null;
  description_ru: string;
  description_kk: string | null;
  description_en: string | null;
  categories: number[];
  hall: number;
  is_active: boolean;
}

// --- Main Component ---
export default function MenuSection({
  initialActiveIndex = 0,
  onChange,
}: {
  initialActiveIndex?: number;
  onChange?(i: number, label: string): void;
}) {
  const t = useTranslations();
  const locale = useLocale(); // Get the current locale
  const params = useParams();

  const [active, setActive] = useState(initialActiveIndex);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [allDishes, setAllDishes] = useState<Dish[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const setBtnRef = useCallback(
    (idx: number) => (el: HTMLButtonElement | null) => {
      btnRefs.current[idx] = el;
    },
    []
  );

  // --- Data Fetching Logic ---
  useEffect(() => {
    const menuId = params.menuId;

    if (!menuId) {
      console.error("Menu ID not found in URL parameters.");
      setLoading(false);
      return;
    }

    const fetchMenuData = async () => {
      try {
        setLoading(true);
        const [menuResponse, categoriesResponse, dishesResponse] = await Promise.all([
          axios.get(`/api/menu/${menuId}/`),
          axios.get("/api/categories/"),
          axios.get("/api/dishes/"),
        ]);

        setMenu(menuResponse.data);
        setCategories(categoriesResponse.data);
        setAllDishes(dishesResponse.data);
      } catch (err) {
        console.error("Ошибка загрузки данных меню:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuData();
  }, [params]);

  // --- Process and Structure Data for Rendering ---
  const groups = useMemo(() => {
    if (!categories || !allDishes || !menu) return [];

    const menuCategories = categories.filter((cat) =>
      menu.categories.includes(cat.id)
    );

    return menuCategories.map((cat) => ({
      key: `cat-${cat.id}`,
      title: getLocalizedText(cat, locale, "name"), // Use localized name
      items: allDishes.filter((dish) => (cat.dishes as any).includes(dish.id)).map(dish => ({
        ...dish,
        name: getLocalizedText(dish, locale, "name"),
        description: getLocalizedText(dish, locale, "description"),
      })),
    }));
  }, [categories, allDishes, menu, locale]); // Add locale to dependency array

  // --- Effects for UI Interaction ---
  useEffect(() => {
    if (loading || !groups.length) return;

    const newActiveIndex = Math.min(Math.max(0, active), groups.length - 1);
    setActive(newActiveIndex);

    btnRefs.current[newActiveIndex]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
    onChange?.(newActiveIndex, groups[newActiveIndex].title);
  }, [active, groups, onChange, loading]);

  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToGroup = (key: string, index: number) => {
    setActive(index);
    document.getElementById(`group-${key}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // --- Component Rendering ---
  if (loading) {
    return (
      <section id="menu" className="w-full h-96 flex items-center justify-center bg-white">
        <p className="text-xl font-raleway font-bold text-[#961515]">Загрузка меню...</p>
      </section>
    );
  }

  return (
    <section id="menu" className="w-full bg-white overflow-x-hidden">
      <div className="mx-auto w-full max-w-[1040px] px-4">
        <h2 className="pt-8 lg:pt-12 font-raleway font-bold uppercase text-[#961515] text-[28px] lg:text-[40px] leading-[1]">
          {menu ? getLocalizedText(menu, locale, "title") : t("menu.title")} {/* Use localized title */}
        </h2>
      </div>

      <div className="mt-6 lg:mt-16" />

      <RenderTabs
        groups={groups}
        active={active}
        scrollToGroup={scrollToGroup}
        setBtnRef={setBtnRef}
      />

      <div className="mt-10" />
      'mid'
      {/* const json = [
        [2,0,1],
        [1,2,0],
        [1,2,0]
      ] */}


      {/* <RenderFilters t={t} /> */}

      {groups.filter((g) => g.items.length > 0).map((g, idx) => (
        <div key={g.key} id={`panel-${g.key}`} role="tabpanel" aria-labelledby={`tab-${g.key}`}>
          <MenuGroup id={`group-${g.key}`} title={g.title} items={g.items}  first={idx === 0} />
        </div>
      ))}

      {/* Back-to-top button */}
      <div className="mx-auto w-full max-w-[1040px] px-4 mt-8 md:hidden">
        <div className="flex">
          <button
            type="button"
            onClick={scrollToMenu}
            aria-label="Back to menu"
            className="ml-auto mr-6 h-14 w-14 bg-[#961515] text-white flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M6 14l6-6 6 6" />
            </svg>
          </button>
        </div>
      </div>
      <div className="h-[66px] lg:h-[85px]" aria-hidden />
    </section>
  );
}

// --- Child Components for Readability ---
const RenderTabs = ({ groups, active, scrollToGroup, setBtnRef }: any) => {
  return (
    <div className="w-full">
      <div className="mx-auto w-fit max-w-[1040px] px-4">
        <div
          role="tablist"
          aria-label="Menu categories"
          className={cx(
            "relative flex items-stretch h-[56px] lg:h-[63px]",
            "overflow-x-auto overflow-y-hidden lg:overflow-x-visible",
            "snap-x snap-mandatory",
            "border border-[#961515] bg-white",
            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          )}
        >
          {groups.map((g: any, i: number) => (
            <button
              key={g.key}
              id={`tab-${g.key}`}
              ref={setBtnRef(i)}
              role="tab"
              aria-selected={i === active}
              aria-controls={`panel-${g.key}`}
              onClick={() => scrollToGroup(g.key, i)}
              className={cx(
                "flex-none snap-start flex items-center h-[56px] lg:h-[63px]",
                "px-6 lg:px-[34px]",
                i === 0 ? "border-0" : "border-l",
                "border-[#961515]",
                "text-[16px] lg:text-[20px] leading-none",
                i === active ? "bg-[#961515] text-white" : "bg-white text-[#961515]"
              )}
            >
              {g.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const RenderFilters = ({ t }: { t: any }) => {
  return (
    <div className="w-full">
      <div className="mx-auto w-full lg:max-w-[772px]">
        <div className="overflow-x-auto px-4 whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="inline-flex items-stretch bg-white border border-[#961515] divide-x divide-[#961515] lg:mx-auto">
            <FilterToggle label={t("menu.filters.vegOnly")} />
            <FilterToggle label={t("menu.filters.noSpicy")} />
          </div>
        </div>
      </div>
    </div>
  );
};

function FilterToggle({ label }: { label: string }) {
  const [checked, setChecked] = useState(false);
  const id = `flt-${useId()}`;
  return (
    <label
      htmlFor={id}
      className={cx(
        "flex-none inline-flex items-center justify-between snap-start cursor-pointer select-none gap-3 lg:gap-4",
        "min-w-[288px] h-[52px] pl-4 pr-[66px] py-[18px]",
        "lg:min-w-0 lg:h-[66px] lg:pl-6 lg:pr-[89px] lg:py-[21.5px]"
      )}
    >
      <span
        className={cx(
          "font-raleway font-medium text-[14px] leading-[1] transition-opacity",
          checked ? "text-[#961515] opacity-100" : "text-[#961515] opacity-50"
        )}
      >
        {label}
      </span>
      <ToggleSwitch id={id} checked={checked} onChange={setChecked} />
    </label>
  );
}