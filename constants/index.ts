export const COLORS = [
  "#DC2626",
  "#D97706",
  "#059669",
  "#7C3AED",
  "#DB2777",
  "#EF4444",
  "#F97316",
  "#10B981",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F59E0B",
  "#3B82F6",
  "#6366F1",
  "#14B8A6",
  "#F43F5E",
  "#A855F7",
  "#22C55E",
  "#EAB308",
];

export const GRADIENTS = [
  { name: "Sunset", value: "linear-gradient(135deg, #ff6b6b, #ffa726)" },
  { name: "Ocean", value: "linear-gradient(135deg, #667eea, #764ba2)" },
  { name: "Forest", value: "linear-gradient(135deg, #11998e, #38ef7d)" },
  { name: "Purple", value: "linear-gradient(135deg, #667eea, #764ba2)" },
  { name: "Pink", value: "linear-gradient(135deg, #f093fb, #f5576c)" },
];

export const shapeElements = [
  {
    icon: "/assets/rectangle.svg",
    name: "Rectangle",
    value: "rectangle",
  },
  {
    icon: "/assets/circle.svg",
    name: "Circle",
    value: "circle",
  },
  {
    icon: "/assets/triangle.svg",
    name: "Triangle",
    value: "triangle",
  },
  {
    icon: "/assets/line.svg",
    name: "Line",
    value: "line",
  },
  {
    icon: "/assets/star.svg",
    name: "Star",
    value: "star",
  },
  {
    icon: "/assets/pentagon.svg",
    name: "Pentagon",
    value: "pentagon",
  },
  {
    icon: "/assets/hexagon.svg",
    name: "Hexagon",
    value: "hexagon",
  },
  {
    icon: "/assets/arrow.svg",
    name: "Arrow",
    value: "arrow",
  },
  {
    icon: "/assets/diamond.svg",
    name: "Diamond",
    value: "diamond",
  },
  {
    icon: "/assets/heart.svg",
    name: "Heart",
    value: "heart",
  },
  {
    icon: "/assets/cloud.svg",
    name: "Cloud",
    value: "cloud",
  },
  {
    icon: "/assets/bubble.svg",
    name: "Speech Bubble",
    value: "bubble",
  },
  {
    icon: "/assets/image.svg",
    name: "Image",
    value: "image",
  },
];

export const drawingElements = [
  {
    icon: "/assets/freeform.svg",
    name: "Free Drawing",
    value: "freeform",
  },
  {
    icon: "/assets/pen.svg",
    name: "Pen Tool",
    value: "pen",
  },
  {
    icon: "/assets/brush.svg",
    name: "Brush",
    value: "brush",
  },
  {
    icon: "/assets/highlighter.svg",
    name: "Highlighter",
    value: "highlighter",
  },
  {
    icon: "/assets/eraser.svg",
    name: "Eraser",
    value: "eraser",
  },
];

export const navElements = [
  {
    icon: "/assets/select.svg",
    name: "Select",
    value: "select",
  },
  {
    icon: "/assets/rectangle.svg",
    name: "Shapes",
    value: shapeElements,
  },
  {
    icon: "/assets/freeform.svg",
    name: "Drawing",
    value: drawingElements,
  },
  {
    icon: "/assets/text.svg",
    value: "text",
    name: "Text",
  },
  {
    icon: "/assets/color-picker.svg",
    value: "colors",
    name: "Colors",
  },
  {
    icon: "/assets/layers.svg",
    value: "layers",
    name: "Layers",
  },
  {
    icon: "/assets/delete.svg",
    value: "delete",
    name: "Delete",
  },
  {
    icon: "/assets/reset.svg",
    value: "reset",
    name: "Reset",
  },
  {
    icon: "/assets/comments.svg",
    value: "comments",
    name: "Comments",
  },
];

export const defaultNavElement = {
  icon: "/assets/select.svg",
  name: "Select",
  value: "select",
};

export const directionOptions = [
  { label: "Bring to Front", value: "front", icon: "/assets/front.svg" },
  { label: "Send to Back", value: "back", icon: "/assets/back.svg" },
];

export const fontFamilyOptions = [
  // Sans-serif fonts
  { value: "Inter", label: "Inter", category: "Sans-serif" },
  { value: "Roboto", label: "Roboto", category: "Sans-serif" },
  { value: "Open Sans", label: "Open Sans", category: "Sans-serif" },
  { value: "Lato", label: "Lato", category: "Sans-serif" },
  { value: "Montserrat", label: "Montserrat", category: "Sans-serif" },
  { value: "Poppins", label: "Poppins", category: "Sans-serif" },
  { value: "Helvetica", label: "Helvetica", category: "Sans-serif" },
  { value: "Arial", label: "Arial", category: "Sans-serif" },

  // Serif fonts
  { value: "Playfair Display", label: "Playfair Display", category: "Serif" },
  { value: "Merriweather", label: "Merriweather", category: "Serif" },
  { value: "Lora", label: "Lora", category: "Serif" },
  { value: "Times New Roman", label: "Times New Roman", category: "Serif" },
  { value: "Georgia", label: "Georgia", category: "Serif" },

  // Monospace fonts
  { value: "Fira Code", label: "Fira Code", category: "Monospace" },
  { value: "Source Code Pro", label: "Source Code Pro", category: "Monospace" },
  { value: "JetBrains Mono", label: "JetBrains Mono", category: "Monospace" },
  { value: "Monaco", label: "Monaco", category: "Monospace" },

  // Display/Decorative fonts
  { value: "Pacifico", label: "Pacifico", category: "Display" },
  { value: "Dancing Script", label: "Dancing Script", category: "Display" },
  { value: "Righteous", label: "Righteous", category: "Display" },
  { value: "Bangers", label: "Bangers", category: "Display" },
  { value: "Lobster", label: "Lobster", category: "Display" },
  { value: "Comic Sans MS", label: "Comic Sans MS", category: "Display" },
  { value: "Brush Script MT", label: "Brush Script MT", category: "Display" },
];

export const fontSizeOptions = [
  { value: "8", label: "8px" },
  { value: "10", label: "10px" },
  { value: "12", label: "12px" },
  { value: "14", label: "14px" },
  { value: "16", label: "16px" },
  { value: "18", label: "18px" },
  { value: "20", label: "20px" },
  { value: "22", label: "22px" },
  { value: "24", label: "24px" },
  { value: "28", label: "28px" },
  { value: "32", label: "32px" },
  { value: "36", label: "36px" },
  { value: "42", label: "42px" },
  { value: "48", label: "48px" },
  { value: "56", label: "56px" },
  { value: "64", label: "64px" },
  { value: "72", label: "72px" },
  { value: "96", label: "96px" },
];

export const fontWeightOptions = [
  {
    value: "400",
    label: "Normal",
  },
  {
    value: "500",
    label: "Semibold",
  },
  {
    value: "600",
    label: "Bold",
  },
];

export const alignmentOptions = [
  { value: "left", label: "Align Left", icon: "/assets/align-left.svg" },
  {
    value: "horizontalCenter",
    label: "Align Horizontal Center",
    icon: "/assets/align-horizontal-center.svg",
  },
  { value: "right", label: "Align Right", icon: "/assets/align-right.svg" },
  { value: "top", label: "Align Top", icon: "/assets/align-top.svg" },
  {
    value: "verticalCenter",
    label: "Align Vertical Center",
    icon: "/assets/align-vertical-center.svg",
  },
  { value: "bottom", label: "Align Bottom", icon: "/assets/align-bottom.svg" },
];

// Brush and drawing settings
export const brushSizeOptions = [
  { value: 2, label: "2px" },
  { value: 4, label: "4px" },
  { value: 6, label: "6px" },
  { value: 8, label: "8px" },
  { value: 12, label: "12px" },
  { value: 16, label: "16px" },
  { value: 20, label: "20px" },
  { value: 24, label: "24px" },
  { value: 32, label: "32px" },
  { value: 48, label: "48px" },
];

export const opacityOptions = [
  { value: 0.1, label: "10%" },
  { value: 0.2, label: "20%" },
  { value: 0.3, label: "30%" },
  { value: 0.4, label: "40%" },
  { value: 0.5, label: "50%" },
  { value: 0.6, label: "60%" },
  { value: 0.7, label: "70%" },
  { value: 0.8, label: "80%" },
  { value: 0.9, label: "90%" },
  { value: 1.0, label: "100%" },
];

// Text styling options
export const textStyleOptions = [
  { icon: "/assets/bold.svg", name: "Bold", value: "bold" },
  { icon: "/assets/italic.svg", name: "Italic", value: "italic" },
  { icon: "/assets/underline.svg", name: "Underline", value: "underline" },
  {
    icon: "/assets/strikethrough.svg",
    name: "Strikethrough",
    value: "strikethrough",
  },
];

// Transform options
export const transformOptions = [
  { icon: "/assets/rotate.svg", name: "Rotate", value: "rotate" },
  {
    icon: "/assets/flip-horizontal.svg",
    name: "Flip Horizontal",
    value: "flipH",
  },
  { icon: "/assets/flip-vertical.svg", name: "Flip Vertical", value: "flipV" },
  { icon: "/assets/scale.svg", name: "Scale", value: "scale" },
];

export const shortcuts = [
  {
    key: "1",
    name: "Chat",
    shortcut: "/",
  },
  {
    key: "2",
    name: "Undo",
    shortcut: "⌘ + Z",
  },
  {
    key: "3",
    name: "Redo",
    shortcut: "⌘ + Y",
  },
  {
    key: "4",
    name: "Reactions",
    shortcut: "E",
  },
  {
    key: "5",
    name: "Select All",
    shortcut: "⌘ + A",
  },
  {
    key: "6",
    name: "Copy",
    shortcut: "⌘ + C",
  },
  {
    key: "7",
    name: "Paste",
    shortcut: "⌘ + V",
  },
  {
    key: "8",
    name: "Duplicate",
    shortcut: "⌘ + D",
  },
];
