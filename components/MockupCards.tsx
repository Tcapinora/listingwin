"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Bell,
  Bookmark,
  Download,
  Heart,
  Home,
  Menu,
  MessageCircle,
  MonitorPlay,
  MoreHorizontal,
  Search,
  Send,
  Share2,
  Store,
  ThumbsUp,
  Users,
  Video,
} from "lucide-react";
import { useAgentProfile } from "@/components/AgentProfileProvider";
import { generatePropertyWriteup } from "@/lib/copy";
import { getPrimaryPropertyPhoto, getPropertyPhotos } from "@/lib/listingImages";
import { openHomeOptions } from "@/lib/openHome";
import { socialHandle } from "@/lib/social";
import type { ListingState } from "@/lib/types";

function Logo({ src, agencyName }: { src: string; agencyName: string }) {
  const displayName = agencyName || "Plum Property";

  if (src) {
    return (
      <Image
        src={src}
        alt={`${displayName} logo`}
        width={120}
        height={48}
        className="max-h-10 w-auto object-contain"
        unoptimized
      />
    );
  }

  return (
    <div className="rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
      {displayName}
    </div>
  );
}

function PhoneFrame({
  children,
  tone = "dark",
}: {
  children: React.ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <div className="relative mx-auto aspect-[9/19.5] w-full max-w-[355px] rounded-[3.1rem] bg-gradient-to-br from-[#1c1c1f] via-black to-[#2b201b] p-[10px] shadow-2xl ring-1 ring-black/40">
      <div className="absolute inset-[3px] rounded-[2.95rem] border border-[#c47b52]/55 pointer-events-none" />
      <div
        className={`relative h-full overflow-hidden rounded-[2.55rem] ${
          tone === "dark" ? "bg-[#070c11] text-white" : "bg-white text-slate-950"
        }`}
      >
        <div className="absolute left-1/2 top-2 z-20 h-7 w-24 -translate-x-1/2 rounded-full bg-black shadow-inner">
          <span className="absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-slate-900 ring-1 ring-slate-700" />
        </div>
        {children}
      </div>
    </div>
  );
}

function CampaignCreative({
  listing,
  variant,
}: {
  listing: ListingState;
  variant: "instagram" | "facebook";
}) {
  const { profile } = useAgentProfile();
  const address = listing.details.address || "Property Address";
  const propertyPhoto = getPrimaryPropertyPhoto(listing);
  const styleTemplate =
    variant === "instagram"
      ? listing.assets.instagramTemplate || profile.instagramTemplate
      : listing.assets.facebookTemplate || profile.facebookTemplate;
  const agentName = profile.agentName || listing.details.agentName || "Agent name";
  const phone = profile.phone || listing.details.phone || "Phone";
  const brandColor = profile.brandColor || "#123f53";
  const agencyName = profile.agencyName || listing.details.agencyName || "Plum Property";
  const logo = profile.agencyLogo || listing.assets.agencyLogo;
  const [lineOne, ...rest] = address.split(",");
  const suburb = rest.join(",").trim() || "Suburb";

  if (styleTemplate) {
    return (
      <div className="p-[5.5%] text-white" style={{ backgroundColor: brandColor }}>
        <div className="relative overflow-hidden rounded-[4%] bg-slate-900">
          <div className="relative aspect-[4/5] opacity-95">
            <Image
              src={styleTemplate}
              alt={`${variant} marketing style reference`}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0" style={{ backgroundColor: `${brandColor}26` }} />
          </div>
          <div className="absolute inset-x-[7%] top-[16%] overflow-hidden rounded-[4%] border-4 border-white bg-slate-100 shadow-2xl">
            <div className="relative aspect-[4/3]">
              {propertyPhoto ? (
                <Image
                  src={propertyPhoto}
                  alt="Property photo inserted into social template"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="grid h-full place-items-center text-sm font-semibold text-slate-500">
                  Property photo
                </div>
              )}
            </div>
          </div>
          <div className="absolute bottom-[6%] left-[7%] right-[7%] rounded-[4%] bg-white/94 p-[4%] text-slate-950 shadow-card backdrop-blur">
            <p className="text-base font-semibold leading-tight">
              {lineOne}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              {suburb} · {agentName} · {phone}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-[5.5%] text-white" style={{ backgroundColor: brandColor }}>
      <div className="mb-[4%] flex items-center justify-between gap-[4%]">
        <div className="flex min-w-0 items-center gap-[3%]">
          <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-white p-1.5">
            {logo ? (
              <Image
                src={logo}
                alt={`${agencyName} logo`}
                width={64}
                height={64}
                className="h-full w-full object-contain"
                unoptimized
              />
            ) : (
              <span className="text-sm font-bold text-slate-950">
                {agencyName.slice(0, 1)}
              </span>
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {agencyName}
            </p>
            <p className="text-[11px] text-white/70">
              Campaign mockup
            </p>
          </div>
        </div>
        <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold">
          Seller preview
        </span>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[4%] bg-gray-200">
        {propertyPhoto ? (
          <Image
            src={propertyPhoto}
            alt="Social property creative"
            fill
            className="object-cover"
            unoptimized
          />
        ) : null}
        <div className="absolute right-[5%] top-[6%] grid h-[31%] w-[31%] place-items-center rounded-full bg-[#bcc6ff] text-center font-serif text-2xl leading-tight text-black">
          <span>
            Just
            <br />
            Listed
          </span>
        </div>
      </div>

      <div className="mt-[4.5%] grid grid-cols-[1fr_1.1fr] gap-[5%]">
        <div>
          <p className="text-lg leading-tight">
            {lineOne}
          </p>
          <p className="mt-1 text-lg leading-tight">
            {suburb}
          </p>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-gray-200">
            <span>4</span>
            <span>bed</span>
            <span>2</span>
            <span>bath</span>
            <span>1</span>
            <span>car</span>
          </div>
        </div>
        <div>
          <p className="text-base leading-tight text-[#c2c9ff]">
            Auction 2nd May 10am
          </p>
          <div className="mt-7 space-y-1 text-[11px] text-[#c2c9ff]">
            <p>
              {agentName} {phone}
            </p>
            <p>{agencyName}</p>
          </div>
        </div>
      </div>

      {variant === "instagram" ? (
        <div className="mt-3 text-xs text-[#6f91ff]">
          830 · View insights
        </div>
      ) : null}
    </div>
  );
}

function PhotoPager({
  photos,
  value,
  onChange,
}: {
  photos: string[];
  value: number;
  onChange: (index: number) => void;
}) {
  if (photos.length <= 1) {
    return null;
  }

  return (
    <div className="absolute bottom-4 right-4 flex gap-1 rounded-full bg-white/90 p-1 shadow-card backdrop-blur">
      {photos.map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onChange(index)}
          className={`h-7 min-w-7 rounded-full px-2 text-xs font-semibold transition ${
            value === index
              ? "bg-gray-950 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          aria-label={`Show property photo ${index + 1}`}
          title={`Show property photo ${index + 1}`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
}

function brochureSaleLine(details: ListingState["details"]) {
  if (details.brochureStatus === "Price guide TBC") {
    return "Price guide TBC";
  }

  if (details.brochureStatus === "Show price") {
    return details.brochurePrice || details.agentPriceGuide || "Price on request";
  }

  return details.brochureStatus;
}

export function MockupCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-card">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold text-gray-950">{title}</h3>
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 text-gray-500"
          title="Export placeholder"
          aria-label="Export placeholder"
        >
          <Download size={15} />
        </button>
      </div>
      {children}
    </section>
  );
}

export function BrochurePreview({ listing }: { listing: ListingState }) {
  const { details, assets } = listing;
  const { profile } = useAgentProfile();
  const photos = getPropertyPhotos(listing);
  const [photoIndex, setPhotoIndex] = useState(0);
  const selectedPhoto = photos[Math.min(photoIndex, photos.length - 1)] || "";
  const agentName = profile.agentName || details.agentName;
  const agencyName = profile.agencyName || details.agencyName || "Plum Property";
  const phone = profile.phone || details.phone;
  const email = profile.email || details.email;
  const website = profile.agencyWebsite || details.agencyWebsite;
  const logo = profile.agencyLogo || assets.agencyLogo;
  const saleLine = brochureSaleLine(details);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="relative h-80 bg-gray-100">
        {selectedPhoto ? (
          <Image
            src={selectedPhoto}
            alt="Brochure property"
            fill
            className="object-cover"
            unoptimized
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <p className="text-xs uppercase tracking-[0.25em] opacity-80">
            {saleLine}
          </p>
          <h4 className="mt-2 text-2xl font-semibold leading-tight">
            {details.address || "Property address"}
          </h4>
        </div>
        <PhotoPager photos={photos} value={photoIndex} onChange={setPhotoIndex} />
      </div>
      <div className="space-y-5 p-6">
        <div className="flex items-center justify-between gap-4">
          <Logo src={logo} agencyName={agencyName} />
          <p className="text-right text-sm font-semibold text-gray-950">
            {agencyName}
          </p>
        </div>
        <div className="rounded-2xl bg-blue-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            Brochure headline
          </p>
          <p className="mt-1 text-2xl font-semibold text-blue-950">
            {saleLine}
          </p>
        </div>
        <p className="text-sm leading-6 text-gray-600">
          {generatePropertyWriteup(details).slice(0, 165)}...
        </p>
        <div className="rounded-2xl border border-gray-200 p-4 text-sm">
          <p className="font-semibold text-gray-950">
            {agentName || "Agent name"}
          </p>
          <p className="mt-1 text-gray-500">{phone || "Phone number"}</p>
          <p className="break-words text-gray-500">{email || "Email"}</p>
          <p className="break-words text-gray-500">{website || agencyName}</p>
        </div>
      </div>
    </div>
  );
}

export function BrochureBookPreview({ listing }: { listing: ListingState }) {
  const { details, assets } = listing;
  const { profile } = useAgentProfile();
  const photos = getPropertyPhotos(listing);
  const [page, setPage] = useState(0);
  const agentName = profile.agentName || details.agentName || "Agent name";
  const agencyName = profile.agencyName || details.agencyName || "Agency name";
  const phone = profile.phone || details.phone || "Phone number";
  const email = profile.email || details.email || "Email address";
  const logo = profile.agencyLogo || assets.agencyLogo;
  const saleLine = brochureSaleLine(details);
  const pages = [
    {
      title: "Cover",
      eyebrow: saleLine,
      heading: details.address || "Property address",
      body: generatePropertyWriteup(details).slice(0, 170),
      image: photos[0],
    },
    {
      title: "Campaign",
      eyebrow: "Launch strategy",
      heading: "A premium market launch",
      body: "Professional photography, portal presence, social proof, signboard visibility, open home energy, and seller follow-up in one clear campaign.",
      image: photos[1] || photos[0],
    },
    {
      title: "Lifestyle",
      eyebrow: "Buyer story",
      heading: "The lifestyle buyers remember",
      body: details.notes || "Use the best lifestyle angles to show the emotional reason buyers should inspect, compete, and remember this home.",
      image: photos[2] || photos[0],
    },
    {
      title: "Agent",
      eyebrow: "Presented by",
      heading: agentName,
      body: `${agencyName} · ${phone} · ${email}`,
      image: photos[3] || photos[0],
    },
  ];
  const currentPage = pages[page];

  return (
    <div className="overflow-hidden rounded-xl border border-blue-100 bg-blue-50/60 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
            4-page brochure
          </p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight">
            {currentPage.title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(0, value - 1))}
            className="grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-bold shadow-sm disabled:opacity-40"
            disabled={page === 0}
            aria-label="Previous brochure page"
            title="Previous brochure page"
          >
            ‹
          </button>
          <span className="min-w-14 text-center text-sm font-semibold text-blue-950">
            {page + 1}/4
          </span>
          <button
            type="button"
            onClick={() => setPage((value) => Math.min(3, value + 1))}
            className="grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-bold shadow-sm disabled:opacity-40"
            disabled={page === 3}
            aria-label="Next brochure page"
            title="Next brochure page"
          >
            ›
          </button>
        </div>
      </div>

      <div className="relative mx-auto max-w-xl overflow-hidden rounded-2xl bg-white shadow-soft">
        <div className="relative h-80 bg-gray-100">
          {currentPage.image ? (
            <Image
              src={currentPage.image}
              alt={`${currentPage.title} brochure page`}
              fill
              className="object-cover"
              unoptimized
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
          {page === 0 ? (
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white">
                {saleLine}
              </p>
              <Logo src={logo} agencyName={agencyName} />
            </div>
          ) : null}
        </div>
        <div className="space-y-3 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
            {currentPage.eyebrow}
          </p>
          <h4 className="text-2xl font-semibold leading-tight text-gray-950">
            {currentPage.heading}
          </h4>
          <p className="text-sm leading-6 text-gray-600">{currentPage.body.slice(0, 210)}</p>
          <div className="rounded-2xl border border-gray-200 p-3 text-sm">
            <p className="font-semibold text-gray-950">{agentName}</p>
            <p className="mt-1 text-gray-500">{phone}</p>
            <p className="break-words text-gray-500">{email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FlyerPreview({ listing }: { listing: ListingState }) {
  const { details, assets } = listing;
  const { profile } = useAgentProfile();
  const photos = getPropertyPhotos(listing);
  const [photoIndex, setPhotoIndex] = useState(0);
  const selectedPhoto = photos[Math.min(photoIndex, photos.length - 1)] || "";
  const agentName = profile.agentName || details.agentName;
  const agencyName = profile.agencyName || details.agencyName || "Plum Property";
  const phone = profile.phone || details.phone;
  const email = profile.email || details.email;
  const website = profile.agencyWebsite || details.agencyWebsite;
  const logo = profile.agencyLogo || assets.agencyLogo;
  const priceGuide = details.agentPriceGuide || "Price guide to be confirmed";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-950">
      <div className="relative h-80">
        {selectedPhoto ? (
          <Image
            src={selectedPhoto}
            alt="Flyer property"
            fill
            className="object-cover opacity-88"
            unoptimized
          />
        ) : null}
        <PhotoPager photos={photos} value={photoIndex} onChange={setPhotoIndex} />
      </div>
      <div className="space-y-3 p-6">
        <div className="flex items-center justify-between gap-4">
          <Logo src={logo} agencyName={agencyName} />
          <p className="text-right text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            {agencyName}
          </p>
        </div>
        <h4 className="text-2xl font-semibold leading-tight">
          Premium launch campaign
        </h4>
        <p className="text-sm leading-6 text-gray-600">
          {details.address || "Property address"}
        </p>
        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            Proposed price guide
          </p>
          <p className="mt-1 text-2xl font-semibold">{priceGuide}</p>
        </div>
        <div className="space-y-1 rounded-2xl border border-gray-200 p-4 text-xs text-gray-600">
          <p className="font-semibold uppercase tracking-[0.18em] text-gray-950">
            {agentName || "Agent name"}
          </p>
          <p>
            {phone || "Phone"} · {email || "Email"}
          </p>
          <p className="break-words">{website || "Agency website"}</p>
        </div>
      </div>
    </div>
  );
}

export function OpenHomePreview({ listing }: { listing: ListingState }) {
  const photos = getPropertyPhotos(listing);
  const propertyPhoto = photos[0] || "";
  const buyers = openHomeOptions.map((option) => ({
    ...option,
    overlay: listing.openHomeOverlays[option.key]?.[0] || {
      x: 56,
      y: 50,
      width: 24,
    },
  })).filter((option) => listing.openHomeVisible[option.key] !== false);

  return (
    <div className="overflow-hidden rounded-xl border border-blue-100 bg-blue-950 text-white">
      <div className="relative aspect-[16/10] bg-blue-100">
        {propertyPhoto ? (
          <Image
            src={propertyPhoto}
            alt="Open home buyer preview"
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="grid h-full place-items-center text-sm font-semibold text-blue-950">
            Property photo
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        {propertyPhoto
          ? buyers.map((buyer) => (
              <div
                key={buyer.key}
                className="absolute"
                style={{
                  left: `${buyer.overlay.x}%`,
                  top: `${buyer.overlay.y}%`,
                  width: `${buyer.overlay.width}%`,
                }}
              >
                <Image
                  src={buyer.src}
                  alt={buyer.label}
                  width={520}
                  height={520}
                  className="h-auto w-full drop-shadow-[0_14px_18px_rgba(0,0,0,0.32)]"
                  unoptimized
                />
              </div>
            ))
          : null}
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">
          Open Home preview
        </p>
        <h4 className="mt-2 text-xl font-semibold tracking-tight">
          Show the seller what buyer energy could look like.
        </h4>
        <p className="mt-2 text-sm leading-6 text-blue-100">
          Transparent buyer cutouts can be staged on any uploaded property
          image to make the campaign feel tangible before launch.
        </p>
      </div>
    </div>
  );
}

export function PhotographyStylePreview() {
  const { profile } = useAgentProfile();
  const [style, setStyle] = useState<"morning" | "afternoon" | "twilight">(
    "morning",
  );
  const options = {
    morning: profile.photographyMorning,
    afternoon: profile.photographyAfternoon,
    twilight: profile.photographyTwilight,
  };
  const photos = options[style] || [];

  return (
    <div className="overflow-hidden rounded-xl border border-blue-100 bg-white">
      <div className="border-b border-slate-100 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
          Photography style
        </p>
        <h4 className="mt-2 text-xl font-semibold tracking-tight">
          Show the vendor the photography direction.
        </h4>
        <div className="mt-4 flex flex-wrap gap-2">
          {(["morning", "afternoon", "twilight"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStyle(item)}
              className={`rounded-full px-4 py-2 text-xs font-semibold capitalize ${
                style === item
                  ? "bg-blue-700 text-white"
                  : "bg-blue-50 text-blue-900"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
        {photos.length ? (
          photos.slice(0, 5).map((photo, index) => (
            <div
              key={`${style}-${index}`}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100"
            >
              <Image
                src={photo}
                alt={`${style} photography ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ))
        ) : (
          <div className="rounded-2xl bg-blue-50 p-5 text-sm leading-6 text-blue-900 sm:col-span-2 lg:col-span-3">
            Upload stock examples in the builder to show morning, afternoon,
            and twilight photography styles.
          </div>
        )}
      </div>
    </div>
  );
}

export function SitePlanPreview({ listing }: { listing: ListingState }) {
  const aerial = listing.assets.sitePlanAerial;
  const address = listing.details.address || "Property address";

  return (
    <div className="overflow-hidden rounded-xl border border-blue-100 bg-white">
      <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="relative min-h-72 bg-blue-50">
          {aerial ? (
            <Image
              src={aerial}
              alt="Aerial reference"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="grid h-full min-h-72 place-items-center p-6 text-center text-sm font-semibold text-blue-950">
              Upload a Google Maps aerial image to create a site plan concept.
            </div>
          )}
          <div className="absolute inset-0 bg-blue-950/20" />
          <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-blue-950 shadow-card">
            Aerial reference
          </div>
        </div>

        <div className="bg-[#eef4e8] p-5">
          <div className="relative mx-auto aspect-[4/3] max-w-xl overflow-hidden rounded-lg border border-green-700/30 bg-[#a8db6f] shadow-inner">
            {aerial ? (
              <Image
                src={aerial}
                alt="Aerial image used as faint site plan guide"
                fill
                className="object-cover opacity-18 mix-blend-multiply"
                unoptimized
              />
            ) : null}
            <div className="absolute inset-0 bg-[#a8db6f]/85" />
            <div className="absolute inset-x-[8%] top-[4%] h-[28%] rounded-b-[55%] border border-green-700/20 bg-[#b7e47b]" />
            <div className="absolute right-[8%] top-[6%] h-[20%] w-[28%] rounded-[45%] bg-[#54bdf4] shadow-inner">
              <span className="absolute inset-0 grid place-items-center text-[10px] font-semibold uppercase text-blue-950">
                Pool
              </span>
            </div>
            <div className="absolute left-[12%] top-[34%] h-[34%] w-[64%] border-[5px] border-gray-700 bg-white shadow-card">
              <div className="absolute inset-1 bg-[repeating-linear-gradient(135deg,rgba(148,163,184,.32)_0,rgba(148,163,184,.32)_1px,transparent_1px,transparent_8px)]" />
              <span className="absolute inset-0 grid place-items-center text-sm font-semibold uppercase tracking-[0.12em] text-gray-700">
                Residence
              </span>
            </div>
            <div className="absolute bottom-[8%] left-[30%] h-[26%] w-[16%] rounded-t-[55%] bg-[#e9e4ce]" />
            <div className="absolute bottom-[18%] left-[26%] h-[12%] w-[9%] rounded-lg bg-red-700 shadow-card" />
            <div className="absolute bottom-[18%] left-[37%] h-[12%] w-[9%] rounded-lg bg-red-800 shadow-card" />
            <div className="absolute right-[8%] top-[31%] h-[24%] w-[20%] bg-[#d9d2bd] text-center text-[9px] font-semibold uppercase text-gray-600">
              <span className="grid h-full place-items-center">Covered area</span>
            </div>
            {[
              ["left-[8%]", "top-[13%]"],
              ["left-[17%]", "top-[26%]"],
              ["left-[7%]", "bottom-[12%]"],
              ["right-[13%]", "bottom-[10%]"],
              ["right-[7%]", "top-[44%]"],
              ["left-[52%]", "top-[18%]"],
              ["left-[68%]", "top-[5%]"],
            ].map(([x, y], index) => (
              <span
                key={`${x}-${y}`}
                className={`absolute ${x} ${y} h-5 w-5 rounded-full bg-green-600 shadow-[0_0_0_4px_rgba(34,197,94,.2)]`}
                style={{ transform: `scale(${index % 2 ? 0.8 : 1})` }}
              />
            ))}
            <div className="absolute inset-4 border border-green-900/20" />
          </div>
          <div className="mt-4 rounded-2xl bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
              Concept site plan
            </p>
            <h4 className="mt-2 text-lg font-semibold tracking-tight text-gray-950">
              {address}
            </h4>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              A clean concept plan for the presentation. Use it as a visual aid,
              not as a survey or legal drawing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PropertyPortalPreview({ listing }: { listing: ListingState }) {
  const { details } = listing;
  const { profile } = useAgentProfile();
  const photos = getPropertyPhotos(listing);
  const primaryPhoto = photos[0] || "";
  const gallery = [0, 1, 2, 3].map((index) => photos[index] || primaryPhoto);
  const brandColor = profile.brandColor || "#123f53";
  const agencyName =
    profile.agencyName || details.agencyName || "Agency Property";
  const agentName = profile.agentName || details.agentName || "Agent name";
  const price =
    details.brochurePrice ||
    details.agentPriceGuide ||
    details.sellerExpectedPrice ||
    "$3,495,000+";
  const address = details.address || "3003/30 Hollins Crescent, New Farm";
  const logo = profile.agencyLogo || listing.assets.agencyLogo;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-[#f7f7f8] p-4 shadow-card">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-xl bg-white shadow-soft">
        <div
          className="flex items-center justify-between px-5 py-4 text-white"
          style={{ backgroundColor: brandColor }}
        >
          <div className="flex items-center gap-3">
            {logo ? (
              <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-xl bg-white p-1">
                <Image
                  src={logo}
                  alt={`${agencyName} logo`}
                  width={44}
                  height={44}
                  className="h-full w-full object-contain"
                  unoptimized
                />
              </span>
            ) : (
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/35 text-sm font-bold">
                {agencyName.slice(0, 1)}
              </span>
            )}
            <div>
              <p className="text-lg font-semibold leading-none tracking-[0.08em]">
                {agencyName}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] opacity-80">
                Property
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="hidden text-sm font-semibold sm:block">{agentName}</p>
            <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-white text-sm font-bold text-gray-950 shadow-card">
              {agentName
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </span>
          </div>
        </div>

        <div className="grid gap-1 border-b border-white bg-white">
          <div className="relative aspect-[16/9] bg-gray-100">
            {gallery[0] ? (
              <Image
                src={gallery[0]}
                alt="Portal hero property"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="grid h-full place-items-center text-sm font-semibold text-gray-500">
                Main property image
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            <button
              type="button"
              className="absolute bottom-4 right-4 rounded-xl bg-black/55 px-4 py-2 text-xs font-semibold text-white backdrop-blur"
            >
              View media
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {gallery.slice(1).map((photo, index) => (
              <div key={index} className="relative aspect-[4/3] bg-gray-100">
                {photo ? (
                  <Image
                    src={photo}
                    alt={`Portal supporting property ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="grid h-full place-items-center text-xs font-semibold text-gray-400">
                    Image {index + 2}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div
          className="h-2"
          style={{ backgroundColor: brandColor }}
          aria-hidden="true"
        />

        <div className="p-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-2xl font-semibold tracking-tight text-gray-950">
                {price}
              </p>
              <p className="mt-3 text-lg leading-7 text-gray-700">{address}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-gray-700">
                <span>3 bed</span>
                <span>2 bath</span>
                <span>2 car</span>
                <span>279m²</span>
                <span>House</span>
              </div>
            </div>
            <button
              type="button"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gray-200 text-2xl leading-none text-gray-600"
              aria-label="Save listing preview"
              title="Save listing preview"
            >
              ☆
            </button>
          </div>
          <div className="mt-6 rounded-2xl bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Portal preview
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Shows sellers how their home could appear on a major property
              portal, using the first 4 uploaded listing photos and the
              agent’s saved brand colour.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SocialPreview({
  listing,
  type,
}: {
  listing: ListingState;
  type: "Instagram" | "Facebook";
}) {
  const { details, assets } = listing;
  const { profile } = useAgentProfile();
  const agentName = profile.agentName || details.agentName || "Vern Gilbert";
  const agencyName = profile.agencyName || details.agencyName || "Plum Property";
  const logo = profile.agencyLogo || assets.agencyLogo;
  const agentSocial =
    type === "Instagram" ? profile.agentInstagramUrl : profile.agentFacebookUrl;
  const agencySocial =
    type === "Instagram"
      ? profile.agencyInstagramUrl
      : profile.agencyFacebookUrl;
  const agentHandle = socialHandle(agentSocial, agentName);
  const agencyHandle = socialHandle(agencySocial, agencyName);
  const brandColor = profile.brandColor || "#123f53";

  if (type === "Instagram") {
    return (
      <PhoneFrame tone="dark">
        <div className="flex h-full flex-col bg-[#070c11] text-white">
          <div className="h-1.5 shrink-0" style={{ backgroundColor: brandColor }} />
          <div className="flex shrink-0 items-center justify-between px-6 pb-2 pt-11 text-sm font-semibold">
            <span>12:55</span>
            <div className="flex items-end gap-1">
              <span className="h-2.5 w-1.5 rounded-sm bg-white/55" />
              <span className="h-3.5 w-1.5 rounded-sm bg-white/75" />
              <span className="h-5 w-1.5 rounded-sm bg-white" />
              <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs text-black">
                81
              </span>
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 pb-3">
            <span className="text-4xl font-light leading-none">‹</span>
            <div className="text-center">
              <p className="text-base font-semibold leading-tight">Posts</p>
              <p className="text-sm leading-tight text-gray-300">{agentHandle}</p>
            </div>
            <span className="w-8" />
          </div>
          <div className="flex shrink-0 items-center gap-3 px-4 py-3">
            <div
              className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-white"
              style={{ boxShadow: `0 0 0 2px ${brandColor}` }}
            >
              {logo ? (
                <Image
                  src={logo}
                  alt={`${agencyName} social avatar`}
                  width={48}
                  height={48}
                  className="h-full w-full object-contain p-1.5"
                  unoptimized
                />
              ) : (
                <span className="text-xs font-bold text-gray-950">
                  {(agentName || "A").slice(0, 1)}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {agentHandle}{" "}
                <span className="font-normal text-gray-300">and {agencyHandle}</span>
              </p>
              <p className="text-xs text-gray-400">7 April</p>
            </div>
            <MoreHorizontal size={22} />
          </div>
          <div className="mx-3 shrink-0 overflow-hidden rounded-[1.45rem]">
            <CampaignCreative listing={listing} variant="instagram" />
          </div>
          <div className="mt-2 flex shrink-0 items-center justify-between px-4 py-2">
            <div className="flex items-center gap-4">
              <Heart size={24} />
              <MessageCircle size={24} />
              <Send size={24} />
            </div>
            <Bookmark size={24} />
          </div>
          <div className="min-h-0 flex-1 space-y-1 px-4 pb-4 text-xs leading-5">
            <p className="text-gray-500">Mockup image for seller preview.</p>
            <p>
              Liked by <span className="font-semibold">{agencyHandle.replace("@", "")}</span>{" "}
              and others
            </p>
            <p>
              <span className="font-semibold">{agentHandle}</span> NEW LISTING
            </p>
            <p className="truncate text-gray-300">
              {(details.address || "PROPERTY ADDRESS").toUpperCase()} · premium
              campaign preview
            </p>
          </div>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame tone="light">
      <div className="flex h-full flex-col bg-white text-gray-950">
        <div className="h-1.5 shrink-0" style={{ backgroundColor: brandColor }} />
        <div className="flex shrink-0 items-center justify-between px-6 pb-2 pt-11 text-sm font-semibold">
          <span>12:56</span>
          <div className="flex items-end gap-1">
            <span className="h-2.5 w-1.5 rounded-sm bg-gray-400" />
            <span className="h-3.5 w-1.5 rounded-sm bg-gray-500" />
            <span className="h-5 w-1.5 rounded-sm bg-gray-900" />
            <span className="ml-2 rounded-full bg-black px-2 py-0.5 text-xs text-white">
              80
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3 px-4 pb-4">
          <span className="text-4xl font-light leading-none">‹</span>
          <p className="min-w-0 flex-1 truncate text-xl font-bold">{agentName}</p>
          <MoreHorizontal size={24} />
          <Search size={28} />
        </div>
        <div className="flex shrink-0 items-center gap-4 px-4 pb-3 text-sm font-semibold">
          <span className="rounded-full bg-blue-50 px-4 py-2 text-blue-600">
            All
          </span>
          <span>Photos</span>
          <span>Reels</span>
          <span className="hidden min-[350px]:inline">Mentions</span>
        </div>
        <div className="flex shrink-0 items-center gap-3 px-4 pb-3">
          <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200">
            {logo ? (
              <Image
                src={logo}
                alt={`${agencyName} Facebook avatar`}
                width={52}
                height={52}
                className="h-full w-full object-contain p-1.5"
                unoptimized
              />
            ) : (
              <span className="text-sm font-bold">{(agentName || "A").slice(0, 1)}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {agentName}{" "}
              <span className="font-normal text-gray-600">
                is with {agencyName || agencyHandle}
              </span>
            </p>
            <p className="text-xs text-gray-500">7 Apr · public</p>
          </div>
          <MoreHorizontal className="text-gray-500" size={22} />
        </div>
        <p className="shrink-0 px-4 pb-3 text-base">
          NEW LISTING... <span className="font-semibold text-gray-500">See more</span>
        </p>
        <div className="mx-3 shrink-0 overflow-hidden rounded-[1.45rem]">
          <CampaignCreative listing={listing} variant="facebook" />
        </div>
        <div className="mt-2 flex shrink-0 items-center justify-between border-b border-gray-200 px-4 pb-3 pt-1">
          <div className="flex items-center gap-5">
            <ThumbsUp className="text-blue-600" size={23} />
            <MessageCircle className="text-gray-600" size={23} />
            <Share2 className="text-gray-600" size={23} />
          </div>
          <span className="text-sm text-gray-500">5 reactions</span>
        </div>
        <p className="shrink-0 px-4 pt-3 text-xs text-gray-400">
          Mockup image for seller preview.
        </p>
        <div className="mt-auto grid shrink-0 grid-cols-6 gap-1 border-t border-gray-200 px-3 py-3 text-center text-[9px] font-semibold text-gray-900">
          <span className="grid place-items-center gap-1 text-blue-600">
            <Home size={22} /> Home
          </span>
          <span className="grid place-items-center gap-1">
            <Video size={22} /> Reels
          </span>
          <span className="grid place-items-center gap-1">
            <Users size={22} /> Friends
          </span>
          <span className="grid place-items-center gap-1">
            <Store size={22} /> Market
          </span>
          <span className="grid place-items-center gap-1">
            <Bell size={22} /> Alerts
          </span>
          <span className="grid place-items-center gap-1">
            <Menu size={22} /> Menu
          </span>
        </div>
      </div>
    </PhoneFrame>
  );
}

export function WriteupPanel({ listing }: { listing: ListingState }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-950">
        <MonitorPlay size={16} />
        AI-style property write-up
      </div>
      <p className="text-base leading-8 text-gray-700">
        {generatePropertyWriteup(listing.details)}
      </p>
    </div>
  );
}
