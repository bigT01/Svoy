import { SwiperSlide } from "swiper/react";
import { IOffer } from "./offersSlider";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

function getLocalizedText(
  item: IOffer,
  locale: string,
  field: "name" | "sub_title" | "description"
): string {
  const key = `${field}_${locale === "kz" ? "kk" : locale}` as keyof IOffer;
  const value = item[key];
  return typeof value === 'string' ? value : item[`${field}_ru` as keyof IOffer] as string;
}

function OfferSlide({
  offer,
  locale,
  pathname,
  priority,
}: {
  offer: IOffer;
  locale: string;
  pathname: string;
  priority: boolean;
}) {
  const offerTitle = getLocalizedText(offer, locale, "name");
  const offerSubtitle = getLocalizedText(offer, locale, "sub_title");

  const getImageSrc = (media: any) => {
    if (!media) return "/images/placeholder.jpg";
    if (media.file?.startsWith("http")) return media.file;
    return `https://api.svoy-lounge.kz/resource/halls/media/${media.file}/`;
  };

  const firstMedia = offer.medias?.[0];
  const [imgSrc, setImgSrc] = useState(getImageSrc(firstMedia));

  return (
    <SwiperSlide className="!w-[calc(100vw-32px)] sm:!w-[84vw] md:!w-[78vw] lg:!w-[1000px]">
      <Link href={`/${locale}/${pathname.split("/")[2]}/offers/${offer.id}`}>
        <article className="relative aspect-[1000/492]">
          <Image
            src={imgSrc}
            alt={offerTitle || "Offer image"}
            onError={() => setImgSrc("/images/placeholder.jpg")}
            fill
            priority={priority}
            className="object-cover"
          />
        </article>
      </Link>
    </SwiperSlide>
  );
}

export default OfferSlide;