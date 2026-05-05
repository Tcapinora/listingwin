"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { UploadCard } from "@/components/UploadCard";
import { useAgentProfile } from "@/components/AgentProfileProvider";
import type { AgentProfile } from "@/lib/types";
import { fileToOptimizedDataUrl } from "@/lib/imageFiles";
import { socialHandle } from "@/lib/social";

const profileFields: Array<{
  id: keyof Omit<
    AgentProfile,
    | "agencyLogo"
    | "agencyLogos"
    | "agentTeamPhotos"
    | "brandColor"
    | "instagramTemplate"
    | "facebookTemplate"
    | "photographyMorning"
    | "photographyAfternoon"
    | "photographyTwilight"
  >;
  label: string;
  placeholder: string;
}> = [
  { id: "agentName", label: "Agent name", placeholder: "Alex Morgan" },
  { id: "agencyName", label: "Agency name", placeholder: "North & Co Property" },
  {
    id: "agencyWebsite",
    label: "Agency website URL",
    placeholder: "https://agency.com.au",
  },
  {
    id: "agentInstagramUrl",
    label: "Agent Instagram URL",
    placeholder: "https://instagram.com/alexmorgan",
  },
  {
    id: "agentFacebookUrl",
    label: "Agent Facebook URL",
    placeholder: "https://facebook.com/alexmorganproperty",
  },
  {
    id: "agencyInstagramUrl",
    label: "Agency Instagram URL",
    placeholder: "https://instagram.com/northandco",
  },
  {
    id: "agencyFacebookUrl",
    label: "Agency Facebook URL",
    placeholder: "https://facebook.com/northandcoproperty",
  },
  { id: "phone", label: "Phone number", placeholder: "0412 345 678" },
  { id: "email", label: "Email", placeholder: "alex@agency.com.au" },
];

export function AgentProfileModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { profile, updateProfile } = useAgentProfile();
  const socialFields = new Set([
    "agentInstagramUrl",
    "agentFacebookUrl",
    "agencyInstagramUrl",
    "agencyFacebookUrl",
  ]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 px-4 py-6 backdrop-blur-sm">
      <div className="mx-auto max-h-[calc(100vh-3rem)] max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-soft lg:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
              Agent Profile
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Edit profile
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              These details are reused automatically across future listings.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:text-gray-950"
            aria-label="Close profile editor"
            title="Close profile editor"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {profileFields.map((field) => (
            <label
              key={field.id}
              className={field.id === "agencyWebsite" ? "sm:col-span-2" : ""}
            >
              <span className="text-sm font-semibold text-gray-800">
                {field.label}
              </span>
              <input
                value={profile[field.id]}
                onChange={(event) =>
                  updateProfile({ [field.id]: event.target.value })
                }
                placeholder={field.placeholder}
                className="mt-2 w-full rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-gray-950 outline-none transition focus:border-blue-400 focus:bg-white"
              />
              {socialFields.has(field.id) && profile[field.id] ? (
                <span className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
                  {socialHandle(profile[field.id])}
                </span>
              ) : null}
            </label>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-blue-100 bg-blue-50/50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                Marketing colour
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight">
                Match the agent’s brand
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Used in portal previews and future seller-facing templates.
              </p>
            </div>
            <label className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
              <input
                type="color"
                value={profile.brandColor || "#123f53"}
                onChange={(event) =>
                  updateProfile({ brandColor: event.target.value })
                }
                className="h-12 w-14 cursor-pointer rounded-xl border border-gray-200 bg-white p-1"
                aria-label="Marketing brand colour"
                title="Marketing brand colour"
              />
              <input
                value={profile.brandColor || "#123f53"}
                onChange={(event) =>
                  updateProfile({ brandColor: event.target.value })
                }
                className="w-28 rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-2 text-sm font-semibold text-gray-950 outline-none focus:border-blue-400"
                aria-label="Brand colour hex value"
              />
            </label>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-5">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              Agent and team photos
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight">
              Add personal trust photos
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Upload up to 2 photos of the agent or team. These are saved to
              the Agent Profile and shown near the end of the vendor
              presentation.
            </p>
          </div>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-blue-50/60 px-5 py-6 text-center transition hover:border-blue-400 hover:bg-blue-50">
            <span className="text-sm font-semibold text-blue-950">
              Upload agent / team photos
            </span>
            <span className="mt-1 text-xs text-blue-900/70">
              Maximum 2 saved. Landscape or portrait photos both work.
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const files = Array.from(event.target.files || []);

                if (!files.length) {
                  return;
                }

                void Promise.all(
                  files.map((file) => fileToOptimizedDataUrl(file, 1200, 0.86)),
                ).then((photos) => {
                  updateProfile({
                    agentTeamPhotos: [
                      ...profile.agentTeamPhotos,
                      ...photos.filter(
                        (photo) => !profile.agentTeamPhotos.includes(photo),
                      ),
                    ].slice(0, 2),
                  });
                });

                event.currentTarget.value = "";
              }}
            />
          </label>

          {profile.agentTeamPhotos.length ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {profile.agentTeamPhotos.map((photo, index) => (
                <div
                  key={`${photo.slice(0, 32)}-${index}`}
                  className="rounded-2xl border border-gray-200 bg-white p-3"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                    <Image
                      src={photo}
                      alt={`Agent or team photo ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateProfile({
                        agentTeamPhotos: profile.agentTeamPhotos.filter(
                          (_, photoIndex) => photoIndex !== index,
                        ),
                      })
                    }
                    className="mt-3 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-5">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              Agency logo library
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight">
              Save logos for future use
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Upload up to 2 agency logos or signboard brand marks once, then
              choose the active logo for presentations and portal/social
              previews.
            </p>
          </div>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-blue-50/60 px-5 py-6 text-center transition hover:border-blue-400 hover:bg-blue-50">
            <span className="text-sm font-semibold text-blue-950">
              Upload agency logos / signboard marks
            </span>
            <span className="mt-1 text-xs text-blue-900/70">
              PNG recommended for transparent backgrounds. Maximum 2 saved.
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const files = Array.from(event.target.files || []);

                if (!files.length) {
                  return;
                }

                void Promise.all(
                  files.map((file) => fileToOptimizedDataUrl(file, 900, 0.88)),
                ).then((logos) => {
                  const nextLogos = [
                    ...profile.agencyLogos,
                    ...logos.filter((logo) => !profile.agencyLogos.includes(logo)),
                  ].slice(0, 2);

                  updateProfile({
                    agencyLogos: nextLogos,
                    agencyLogo: profile.agencyLogo || nextLogos[0] || "",
                  });
                });

                event.currentTarget.value = "";
              }}
            />
          </label>

          {profile.agencyLogos.length ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {profile.agencyLogos.map((logo, index) => {
                const selected = profile.agencyLogo === logo;

                return (
                  <div
                    key={`${logo.slice(0, 32)}-${index}`}
                    className={`rounded-2xl border bg-white p-3 ${
                      selected ? "border-blue-700" : "border-gray-200"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => updateProfile({ agencyLogo: logo })}
                      className="checkerboard relative grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-xl bg-white p-4"
                    >
                      <Image
                        src={logo}
                        alt={`Agency logo ${index + 1}`}
                        width={180}
                        height={100}
                        className="max-h-full w-auto object-contain"
                        unoptimized
                      />
                    </button>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => updateProfile({ agencyLogo: logo })}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          selected
                            ? "bg-blue-700 text-white"
                            : "bg-blue-50 text-blue-800"
                        }`}
                      >
                        {selected ? "Active" : "Use logo"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const nextLogos = profile.agencyLogos.filter(
                            (_, logoIndex) => logoIndex !== index,
                          );
                          updateProfile({
                            agencyLogos: nextLogos,
                            agencyLogo:
                              profile.agencyLogo === logo
                                ? nextLogos[0] || ""
                                : profile.agencyLogo,
                          });
                        }}
                        className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-5">
              <UploadCard
                label="Agency logo"
                hint="Saved to your Agent Profile"
                value={profile.agencyLogo}
                assetKey="agencyLogo"
                onChange={(_, value) =>
                  updateProfile({
                    agencyLogo: value,
                    agencyLogos: value ? [value] : [],
                  })
                }
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-blue-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
