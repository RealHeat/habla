import type { CSSProperties, ReactElement, ReactNode, SVGProps } from "react";
import type { IconKey } from "./types";

type IconProps = Omit<SVGProps<SVGSVGElement>, "stroke" | "fill"> & {
  size?: number;
  sw?: number;
  vb?: string;
  stroke?: string;
  fill?: string;
  style?: CSSProperties;
  children?: ReactNode;
  d?: string;
};

function Svg({
  size = 16,
  sw = 1.5,
  vb = "0 0 24 24",
  stroke = "currentColor",
  fill,
  children,
  ...rest
}: IconProps) {
  return (
    <svg
      className="ico"
      width={size}
      height={size}
      viewBox={vb}
      fill={fill || "none"}
      stroke={stroke}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

const Home = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5 10v9h14v-9" />
  </Svg>
);
const Spark = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3v4" />
    <path d="M12 17v4" />
    <path d="M3 12h4" />
    <path d="M17 12h4" />
    <path d="M6 6l2.5 2.5" />
    <path d="M15.5 15.5 18 18" />
    <path d="M6 18l2.5-2.5" />
    <path d="M15.5 8.5 18 6" />
  </Svg>
);
const Level = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 19V9" />
    <path d="M10 19V5" />
    <path d="M16 19v-7" />
    <path d="M22 19v-3" />
  </Svg>
);
const Play = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 4v16l13-8z" />
  </Svg>
);
const Check = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12.5 10 17 19 7" />
  </Svg>
);
const X = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12" />
    <path d="M18 6 6 18" />
  </Svg>
);
const Trash = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16" />
    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    <path d="M6 7v13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7" />
  </Svg>
);
const Edit = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 20h4l11-11-4-4L4 16z" />
  </Svg>
);
const Plus = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </Svg>
);
const Mic = (p: IconProps) => (
  <Svg {...p}>
    <rect x="9" y="3" width="6" height="12" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0" />
    <path d="M12 18v3" />
  </Svg>
);
const Keyboard = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="6" width="18" height="13" rx="2" />
    <path d="M7 10h.01" />
    <path d="M11 10h.01" />
    <path d="M15 10h.01" />
    <path d="M19 10h.01" />
    <path d="M7 14h.01" />
    <path d="M11 14h.01" />
    <path d="M15 14h.01" />
    <path d="M19 14h.01" />
    <path d="M8 17h8" />
  </Svg>
);
const Send = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12 19 5l-7 14-2-6z" />
    <path d="M5 12l5 1" />
  </Svg>
);
const Arrow = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </Svg>
);
const ArrowL = (p: IconProps) => (
  <Svg {...p}>
    <path d="M19 12H5" />
    <path d="M11 18l-6-6 6-6" />
  </Svg>
);
const History = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
    <path d="M12 7v5l3 2" />
  </Svg>
);
const Doc = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 3h7l5 5v13H7z" />
    <path d="M14 3v5h5" />
  </Svg>
);
const Coffee = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 9h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
    <path d="M17 11h2a2 2 0 0 1 0 4h-2" />
    <path d="M7 5c0-1 1-1 1-2" />
    <path d="M11 5c0-1 1-1 1-2" />
  </Svg>
);
const Globe = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c3 3 4 6 4 9s-1 6-4 9c-3-3-4-6-4-9s1-6 4-9z" />
  </Svg>
);
const Family = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M3 20c0-3 3-5 6-5s6 2 6 5" />
    <path d="M14 20c0-2 1.5-3.5 3-3.5s3 1.5 3 3.5" />
  </Svg>
);
const School = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3 2 8l10 5 10-5z" />
    <path d="M6 10v6c0 2 3 3 6 3s6-1 6-3v-6" />
  </Svg>
);
const Pause = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 5v14" />
    <path d="M15 5v14" />
  </Svg>
);
const Stop = (p: IconProps) => (
  <Svg {...p}>
    <rect x="6" y="6" width="12" height="12" rx="1" />
  </Svg>
);
const Chev = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 6l6 6-6 6" />
  </Svg>
);
const Sparkle = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
  </Svg>
);
const Bolt = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13 3 5 14h6l-1 7 8-11h-6l1-7z" />
  </Svg>
);
const Flame = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 1-3s1 2 3 2c0-3-2-4 1-8z" />
  </Svg>
);
const Settings = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h0a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </Svg>
);
const Star = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l2.7 6 6.3.6-4.8 4.3 1.4 6.1L12 16.9 6.4 20l1.4-6.1L3 9.6l6.3-.6z" />
  </Svg>
);

export const I: Record<IconKey, (p: IconProps) => ReactElement> = {
  Home,
  Spark,
  Level,
  Play,
  Check,
  X,
  Trash,
  Edit,
  Plus,
  Mic,
  Keyboard,
  Send,
  Arrow,
  ArrowL,
  History,
  Doc,
  Coffee,
  Globe,
  Family,
  School,
  Pause,
  Stop,
  Chev,
  Sparkle,
  Bolt,
  Flame,
  Settings,
  Star,
};

export type { IconProps };
