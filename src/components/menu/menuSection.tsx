"use client";
import {useCallback, useEffect, useMemo, useRef, useState, useId} from "react";
import {useTranslations} from "next-intl";
import ToggleSwitch from "@/components/ui/toggleSwitch";
import MenuGroup from "@/components/menu/menuGroup";
import axios from "axios";
import { usePathname } from "next/navigation";

// Utility function
function cx(...p: Array<string | false | null | undefined>) {
  return p.filter(Boolean).join(" ");
}

// Interfaces for API data
interface Dish {
  id: number;
  name_ru: string;
  name_en: string;
  price: string;
  description_ru: string;
  i18nKey: string; // Add missing property
  image: string;   // Add missing property
  name_kk: string; // Add missing property to match Dish type in dishCard.tsx
}

interface Category {
  id: number;
  name_ru: string;
  name_en: string;
  name_kk: string;
  description_ru: string;
  dishes: number[]; // From API, this is a number array of dish IDs
}

interface Menu {
  id: number;
  title_ru: string;
  title_en: string;
  description_ru: string;
  categories: number[];
  hall: number;
  is_active: boolean;
}

export default function MenuSection({
  initialActiveIndex = 0,
  onChange
}: {
  initialActiveIndex?: number;
  onChange?(i: number, label: string): void;
}) {
  const t = useTranslations();
  const pathname = usePathname();
  
  const title = t("menu.title");

  const [active, setActive] = useState(initialActiveIndex);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [allDishes, setAllDishes] = useState<Dish[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // tab button refs (TS-safe)
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const setBtnRef = useCallback(
    (idx: number) => (el: HTMLButtonElement | null) => { btnRefs.current[idx] = el; },
    []
  );

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        // 1. Fetch a specific menu (e.g., menu with ID 2)
        const menuResponse = await axios.get(
          "/api/menu/2/"
        );
        const fetchedMenu = menuResponse.data;
        setMenu(fetchedMenu);

        // 2. Fetch all dishes and all categories in separate calls
        const [categoriesResponse, dishesResponse] = await Promise.all([
          axios.get('/api/categories/'),
          axios.get('/api/dishes/')
        ]);
        
        setCategories(categoriesResponse.data);
        setAllDishes(dishesResponse.data);

      } catch (err) {
        console.error("Ошибка загрузки меню или категорий:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuData();
  }, []);

  const groups = useMemo(() => {
    if (!categories || !allDishes || !menu) return [];

    // Filter categories that are part of the current menu
    const menuCategories = categories.filter(cat => menu.categories.includes(cat.id));

    // Map each category to a group object with its corresponding dishes
    return menuCategories.map(cat => ({
      key: `cat-${cat.id}`,
      title: cat.name_ru,
      items: allDishes.filter(dish => (cat.dishes as any).includes(dish.id))
    }));
  }, [categories, allDishes, menu]);

  useEffect(() => {
    if (loading || !groups.length) return;
    
    const newActiveIndex = Math.min(Math.max(0, active), groups.length - 1);
    setActive(newActiveIndex);

    btnRefs.current[newActiveIndex]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest"
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

  if (loading) {
    return (
      <section id="menu" className="w-full h-96 flex items-center justify-center bg-white">
        <p className="text-xl font-raleway font-bold text-[#961515]">Загрузка меню...</p>
      </section>
    );
  }

  return (
    <section id="menu" className="w-full bg-white overflow-x-hidden">
      {/* Title */}
      <div className="mx-auto w-full max-w-[1040px] px-4">
        <h2 className="pt-8 lg:pt-12 font-raleway font-bold uppercase text-[#961515] text-[28px] lg:text-[40px] leading-[1]">
          {menu ? menu.title_ru : title}
        </h2>
      </div>
      <div className="mt-6 lg:mt-16" />
      {/* Categories */}
      <div className="w-full">
        <div className="mx-auto w-full max-w-[1040px] px-4">
          <div
            role="tablist"
            aria-label={menu ? menu.title_ru : title}
            className={cx(
              "relative flex items-stretch h-[56px] lg:h-[63px]",
              "overflow-x-auto overflow-y-hidden lg:overflow-x-visible",
              "snap-x snap-mandatory",
              "border border-[#961515] bg-white",
              "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            )}
          >
            {groups.map((g, i) => (
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
      <div className="mt-10" />
      {/* Filters */}
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
      {/* Real groups */}
      {groups.filter(g => g.items.length > 0).map((g, idx) => (
        <div key={g.key} id={`panel-${g.key}`} role="tabpanel" aria-labelledby={`tab-${g.key}`}>
          <MenuGroup id={`group-${g.key}`} title={g.title} items={g.items} first={idx === 0} />
        </div>
      ))}
      {/* Back-to-top — mobile only */}
      <div className="mx-auto w-full max-w-[1040px] px-4 mt-8 md:hidden">
        <div className="flex">
          <button
            type="button"
            onClick={scrollToMenu}
            aria-label="Back to menu"
            className="ml-auto mr-6 h-14 w-14 bg-[#961515] text-white"
            style={{ paddingTop: 15, paddingRight: 16, paddingBottom: 17, paddingLeft: 16 }}
          >
            <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M6 14l6-6 6 6" />
            </svg>
          </button>
        </div>
      </div>
      {/* Spacer before footer:
          - 66px on mobile/tablet
          - 85px on desktop */}
      <div className="h-[66px] lg:h-[85px]" aria-hidden />
    </section>
  );
}

function FilterToggle({label}: {label: string}) {
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