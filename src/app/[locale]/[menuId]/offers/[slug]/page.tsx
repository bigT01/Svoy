import { notFound } from "next/navigation";
import OfferPageClient from "@/components/sections/offerPageClient";
import { getOfferBySlug } from "@/data/offers";


export default function OfferPage({
  params,
}: {
  params: { locale: string; menuId: string; slug: string };
}) {
  return <OfferPageClient/>;
}

export const dynamic = "force-dynamic";
