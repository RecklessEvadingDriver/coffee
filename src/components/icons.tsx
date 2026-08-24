import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base: P = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  width: 18,
  height: 18,
  "aria-hidden": true,
};

export const IconSearch = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20.5 20.5-3.4-3.4" />
  </svg>
);

export const IconX = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconPlus = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconMinus = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12h14" />
  </svg>
);

export const IconTrash = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M10 4h4M9 7v-3h6v3M6.5 7l1 13h9l1-13M10 11v5M14 11v5" />
  </svg>
);

export const IconBag = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5.5 8h13l.9 12H4.6L5.5 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

export const IconArrowRight = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
);

export const IconArrowDown = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 4v16M6 14l6 6 6-6" />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg {...base} {...p}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);

export const IconChevronDown = (p: P) => (
  <svg {...base} {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const IconMapPin = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const IconFlame = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3c.8 3.2-3.5 4.8-3.5 8.3a3.5 3.5 0 0 0 7 0c0-1.3-.4-2.4-1.1-3.3-.2 1.1-.8 1.8-1.6 2.2C13.8 7.6 14.8 5.4 12 3Z" />
    <path d="M12 21v-3" />
  </svg>
);

export const IconTruck = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" />
    <circle cx="7" cy="18" r="1.8" />
    <circle cx="17" cy="18" r="1.8" />
  </svg>
);

export const IconCard = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="6" width="18" height="13" rx="2" />
    <path d="M3 10.5h18M7 15h4" />
  </svg>
);

export const IconStar = (p: P) => (
  <svg {...base} {...p}>
    <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8L12 3.5Z" />
  </svg>
);

export const IconLeaf = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 19C5 9 12 5 20 5c0 9-5 14-13 14" />
    <path d="M5 19c2-5 6-9 10-11" />
  </svg>
);

export const IconCup = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 10h11v5a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5v-5Z" />
    <path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16M4 22h13" />
    <path d="M8.5 3.5c-.8 1 .8 1.6 0 2.7M12.5 3.5c-.8 1 .8 1.6 0 2.7" />
  </svg>
);

export const IconGrinder = (p: P) => (
  <svg {...base} {...p}>
    <path d="M8 4h8l-1.2 5H9.2L8 4ZM9 9l-1 11h8L15 9M6 4h12" />
    <path d="M10.5 13.5h3" />
  </svg>
);

/** filled coffee bean */
export const IconBeanSolid = (p: P) => (
  <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden {...p}>
    <ellipse
      cx="12"
      cy="12"
      rx="6.4"
      ry="9"
      transform="rotate(28 12 12)"
      fill="currentColor"
    />
    <path
      d="M9.4 4.9c4.3 3.7 1.4 10.5 5.4 14.3"
      fill="none"
      stroke="#1a110b"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

export const IconGear = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.8 13.6 5a7.2 7.2 0 0 1 2.3 1l2.7-.6 1.4 2.4-1.9 2a7.3 7.3 0 0 1 0 2.4l1.9 2-1.4 2.4-2.7-.6a7.2 7.2 0 0 1-2.3 1L12 21.2 10.4 19a7.2 7.2 0 0 1-2.3-1l-2.7.6L4 16.2l1.9-2a7.3 7.3 0 0 1 0-2.4L4 9.8l1.4-2.4 2.7.6a7.2 7.2 0 0 1 2.3-1L12 2.8Z" />
  </svg>
);

export const IconLock = (p: P) => (
  <svg {...base} {...p}>
    <rect x="5" y="10.5" width="14" height="10" rx="2" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3M12 14.5v2.5" />
  </svg>
);

export const IconEdit = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 20h4.5L20 8.5a2.1 2.1 0 0 0-3-3L5.5 17 4 20ZM14.5 6l3 3" />
  </svg>
);

export const IconUpload = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 15V4M7.5 8.5 12 4l4.5 4.5M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" />
  </svg>
);

export const IconBox = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3 4 7v10l8 4 8-4V7l-8-4ZM4 7l8 4m0 0 8-4m-8 4v10" />
  </svg>
);

export const IconRefresh = (p: P) => (
  <svg {...base} {...p}>
    <path d="M20 12a8 8 0 1 1-2.3-5.6M20 3.5V8h-4.5" />
  </svg>
);

export const IconStore = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 9.5 5.5 4h13L20 9.5M4 9.5a2.4 2.4 0 0 0 4 1.6 2.4 2.4 0 0 0 4 0 2.4 2.4 0 0 0 4 0 2.4 2.4 0 0 0 4-1.6M5.5 12v8h13v-8M10 20v-5h4v5" />
  </svg>
);

export const IconAlert = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 4 2.8 19.5h18.4L12 4ZM12 10v4.2M12 17.2v.1" />
  </svg>
);

/** outlined coffee bean */
export const IconBeanLine = (p: P) => (
  <svg {...base} {...p}>
    <ellipse cx="12" cy="12" rx="6.4" ry="9" transform="rotate(28 12 12)" />
    <path d="M9.4 4.9c4.3 3.7 1.4 10.5 5.4 14.3" />
  </svg>
);
