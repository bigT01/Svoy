import { useTranslations } from "next-intl";

export default function AddressInsteadOfMenu() {
  const t = useTranslations("addressBanner");

  const syganakParts = t("syganak").split(" - ");
  const zhumabaevaParts = t("zhumabaeva").split(" - ");

  return (
    <section id="menu" className="bg-[#fcfcfc] py-16 lg:py-24 border-t border-[#E4C7C7]/40">
      <div className="mx-auto w-full max-w-[1040px] px-4">
        <div className="text-center mb-10 lg:mb-14">
          <h2 className="font-raleway font-bold uppercase text-[#6E2525] text-[28px] lg:text-[40px] leading-[1]">
            Наши локации
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-stretch gap-6 lg:gap-10">
          
          {/* Syganak */}
          <div className="flex-1 bg-white border-2 border-[#E4C7C7] p-8 lg:p-12 rounded-xl shadow-sm flex flex-col justify-center text-center group hover:border-[#6E2525] transition-all duration-300">
            <div className="w-16 h-16 mx-auto mb-6 bg-[#6E2525]/5 rounded-full flex items-center justify-center group-hover:bg-[#6E2525]/10 transition-colors">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21C16 17.3333 19 13.6667 19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10C5 13.6667 8 17.3333 12 21Z" stroke="#6E2525" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="10" r="3" stroke="#6E2525" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="font-raleway font-bold text-[22px] lg:text-[28px] text-[#6E2525] mb-4 uppercase tracking-tight">
              {syganakParts[0]}
            </h3>
            <p className="font-inter text-[16px] lg:text-[18px] text-[#151515]/80 leading-relaxed max-w-[340px] mx-auto">
              {syganakParts[1] || t("syganak")}
            </p>
          </div>

          {/* Zhumabaeva */}
          <div className="flex-1 bg-[#6E2525] text-white p-8 lg:p-12 rounded-xl shadow-2xl flex flex-col justify-center text-center relative overflow-hidden group">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-colors duration-500"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="w-16 h-16 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm relative z-10">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 19V6L12 3L20 6V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 19V15L12 13L16 15V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="font-raleway font-bold text-[22px] lg:text-[28px] mb-4 uppercase tracking-tight relative z-10">
              {zhumabaevaParts[0]}
            </h3>
            <p className="font-inter text-[16px] lg:text-[18px] text-white/90 leading-relaxed max-w-[340px] mx-auto relative z-10 mb-8">
              {zhumabaevaParts[1] || t("zhumabaeva")}
            </p>
            
            <div className="mt-auto inline-block mx-auto px-6 py-2.5 border border-white/20 rounded-full text-[15px] font-medium bg-white/10 backdrop-blur-md relative z-10 whitespace-nowrap">
              {t("halls")}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
