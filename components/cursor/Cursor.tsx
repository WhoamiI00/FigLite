import CursorSVG from "@/public/assets/CursorSVG";

type Props = {
  color: string;
  x: number;
  y: number;
  message?: string;
  activeTool?: string;
};

const TOOL_BADGES: Record<string, string> = {
  select: "\u2196",
  rectangle: "\u25A1",
  circle: "\u25CB",
  triangle: "\u25B3",
  line: "\u2215",
  freeform: "\u270F",
  text: "T",
  image: "\uD83D\uDDBC",
  comments: "\uD83D\uDCAC",
  star: "\u2606",
  pentagon: "\u2B1F",
  hexagon: "\u2B22",
  arrow: "\u2192",
  diamond: "\u25C7",
  heart: "\u2661",
  cloud: "\u2601",
  bubble: "\uD83D\uDCAD",
};

const Cursor = ({ color, x, y, message, activeTool }: Props) => {
  const toolBadge = activeTool ? TOOL_BADGES[activeTool] || activeTool : null;

  return (
    <div
      className='pointer-events-none absolute left-0 top-0'
      style={{ transform: `translateX(${x}px) translateY(${y}px)` }}
    >
      <CursorSVG color={color} />

      {toolBadge && !message && (
        <div
          className='absolute left-3 top-5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] leading-none text-white'
          style={{ backgroundColor: color }}
        >
          {toolBadge}
        </div>
      )}

      {message && (
        <div
          className='absolute left-2 top-5 rounded-3xl px-4 py-2'
          style={{ backgroundColor: color, borderRadius: 20 }}
        >
          <p className='whitespace-nowrap text-sm leading-relaxed text-white'>
            {message}
          </p>
        </div>
      )}
    </div>
  );
};

export default Cursor;
