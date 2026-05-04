import type { OpenHomeOptionKey } from "@/lib/types";

export const openHomeOptions: Array<{
  key: OpenHomeOptionKey;
  label: string;
  src: string;
}> = [
  {
    key: "buyers1",
    label: "Buyer option 1",
    src: "/open-home/1.png",
  },
  {
    key: "buyers2",
    label: "Buyer option 2",
    src: "/open-home/2.png",
  },
  {
    key: "buyers3",
    label: "Buyer option 3",
    src: "/open-home/3.png",
  },
];

export function getOpenHomeOption(key: OpenHomeOptionKey) {
  return openHomeOptions.find((option) => option.key === key) || openHomeOptions[0];
}
