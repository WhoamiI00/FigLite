import { fabric } from "fabric";
import { v4 as uuidv4 } from "uuid";

import {
  CustomFabricObject,
  ElementDirection,
  ImageUpload,
  ModifyShape,
} from "@/types/type";

export const createRectangle = (pointer: PointerEvent) => {
  const rect = new fabric.Rect({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as CustomFabricObject<fabric.Rect>);

  return rect;
};

export const createTriangle = (pointer: PointerEvent) => {
  return new fabric.Triangle({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as CustomFabricObject<fabric.Triangle>);
};

export const createCircle = (pointer: PointerEvent) => {
  return new fabric.Circle({
    left: pointer.x,
    top: pointer.y,
    radius: 100,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as any);
};

export const createLine = (pointer: PointerEvent) => {
  return new fabric.Line(
    [pointer.x, pointer.y, pointer.x + 100, pointer.y + 100],
    {
      stroke: "#aabbcc",
      strokeWidth: 2,
      objectId: uuidv4(),
    } as CustomFabricObject<fabric.Line>
  );
};

export const createStar = (pointer: PointerEvent) => {
  // 5-pointed star, ~100x100
  const path =
    "M 50 0 L 61 35 L 98 35 L 68 57 L 79 91 L 50 70 L 21 91 L 32 57 L 2 35 L 39 35 Z";
  return new fabric.Path(path, {
    left: pointer.x,
    top: pointer.y,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as any);
};

export const createPentagon = (pointer: PointerEvent) => {
  const path =
    "M 50 0 L 97 35 L 79 91 L 21 91 L 3 35 Z";
  return new fabric.Path(path, {
    left: pointer.x,
    top: pointer.y,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as any);
};

export const createHexagon = (pointer: PointerEvent) => {
  const path =
    "M 50 0 L 93 25 L 93 75 L 50 100 L 7 75 L 7 25 Z";
  return new fabric.Path(path, {
    left: pointer.x,
    top: pointer.y,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as any);
};

export const createArrow = (pointer: PointerEvent) => {
  // Right-pointing arrow, ~100x100
  const path =
    "M 0 35 L 65 35 L 65 10 L 100 50 L 65 90 L 65 65 L 0 65 Z";
  return new fabric.Path(path, {
    left: pointer.x,
    top: pointer.y,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as any);
};

export const createDiamond = (pointer: PointerEvent) => {
  const path = "M 50 0 L 100 50 L 50 100 L 0 50 Z";
  return new fabric.Path(path, {
    left: pointer.x,
    top: pointer.y,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as any);
};

export const createHeart = (pointer: PointerEvent) => {
  const path =
    "M 50 90 C 25 70, 0 50, 0 30 C 0 10, 20 0, 50 20 C 80 0, 100 10, 100 30 C 100 50, 75 70, 50 90 Z";
  return new fabric.Path(path, {
    left: pointer.x,
    top: pointer.y,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as any);
};

export const createCloud = (pointer: PointerEvent) => {
  const path =
    "M 25 60 C 5 60, 0 45, 10 35 C 5 25, 15 10, 30 15 C 35 5, 55 0, 65 10 C 75 5, 95 10, 90 25 C 100 30, 100 50, 85 55 C 90 65, 75 70, 65 65 C 55 75, 35 75, 25 60 Z";
  return new fabric.Path(path, {
    left: pointer.x,
    top: pointer.y,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as any);
};

export const createBubble = (pointer: PointerEvent) => {
  // Speech bubble with tail
  const path =
    "M 10 10 Q 10 0, 50 0 Q 90 0, 90 10 L 90 55 Q 90 65, 50 65 L 30 65 L 15 85 L 20 65 L 10 65 Q 0 65, 0 55 L 0 10 Q 0 0, 10 0 Z";
  return new fabric.Path(path, {
    left: pointer.x,
    top: pointer.y,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as any);
};

export const createStickyNote = (pointer: PointerEvent, color: string = "#FEF3C7") => {
  const rect = new fabric.Rect({
    width: 200,
    height: 150,
    fill: color,
    rx: 8,
    ry: 8,
    shadow: new fabric.Shadow({
      color: "rgba(0,0,0,0.15)",
      blur: 8,
      offsetX: 2,
      offsetY: 2,
    }),
  });

  const itext = new fabric.IText("Double-click to edit", {
    fontSize: 14,
    fontFamily: "Helvetica",
    fill: "#1F2937",
    textAlign: "center",
    originX: "center",
    originY: "center",
    left: 100,
    top: 75,
    width: 180,
  });

  const group = new fabric.Group([rect, itext], {
    left: pointer.x,
    top: pointer.y,
    objectId: uuidv4(),
  } as CustomFabricObject<fabric.Group>);

  // @ts-ignore
  group.type = "sticky-note";

  return group;
};

export const createText = (pointer: PointerEvent, text: string) => {
  return new fabric.IText(text, {
    left: pointer.x,
    top: pointer.y,
    fill: "#aabbcc",
    fontFamily: "Helvetica",
    fontSize: 36,
    fontWeight: "400",
    objectId: uuidv4()
  } as fabric.ITextOptions);
};

export const createSpecificShape = (
  shapeType: string,
  pointer: PointerEvent
) => {
  switch (shapeType) {
    case "rectangle":
      return createRectangle(pointer);

    case "triangle":
      return createTriangle(pointer);

    case "circle":
      return createCircle(pointer);

    case "line":
      return createLine(pointer);

    case "text":
      return createText(pointer, "Tap to Type");

    case "star":
      return createStar(pointer);

    case "pentagon":
      return createPentagon(pointer);

    case "hexagon":
      return createHexagon(pointer);

    case "arrow":
      return createArrow(pointer);

    case "diamond":
      return createDiamond(pointer);

    case "heart":
      return createHeart(pointer);

    case "cloud":
      return createCloud(pointer);

    case "bubble":
      return createBubble(pointer);

    case "sticky-note":
      return createStickyNote(pointer);

    default:
      return null;
  }
};

export const handleImageUpload = ({
  file,
  canvas,
  shapeRef,
  syncShapeInStorage,
}: ImageUpload) => {
  const reader = new FileReader();

  reader.onload = () => {
    fabric.Image.fromURL(reader.result as string, (img) => {
      img.scaleToWidth(200);
      img.scaleToHeight(200);

      canvas.current.add(img);

      // @ts-ignore
      img.objectId = uuidv4();

      shapeRef.current = img;

      syncShapeInStorage(img);
      canvas.current.requestRenderAll();
    });
  };

  reader.readAsDataURL(file);
};

export const createShape = (
  canvas: fabric.Canvas,
  pointer: PointerEvent,
  shapeType: string
) => {
  const drawingTools = ["freeform", "pen", "brush", "highlighter", "eraser"];
  if (drawingTools.includes(shapeType)) {
    canvas.isDrawingMode = true;
    return null;
  }

  return createSpecificShape(shapeType, pointer);
};

export const modifyShape = ({
  canvas,
  property,
  value,
  activeObjectRef,
  syncShapeInStorage,
}: ModifyShape) => {
  const selectedElement = canvas.getActiveObject();

  if (!selectedElement || selectedElement?.type === "activeSelection") return;

  // if  property is width or height, set the scale of the selected element
  if (property === "width") {
    selectedElement.set("scaleX", 1);
    selectedElement.set("width", value);  
  } else if (property === "height") {
    selectedElement.set("scaleY", 1);
    selectedElement.set("height", value);
  } else {
    if (selectedElement[property as keyof object] === value) return;
    selectedElement.set(property as keyof object, value);
  }

  // set selectedElement to activeObjectRef
  activeObjectRef.current = selectedElement;

  syncShapeInStorage(selectedElement);
};

export const bringElement = ({
  canvas,
  direction,
  syncShapeInStorage,
}: ElementDirection) => {
  if (!canvas) return;

  // get the selected element. If there is no selected element or there are more than one selected element, return
  const selectedElement = canvas.getActiveObject();

  if (!selectedElement || selectedElement?.type === "activeSelection") return;

  // bring the selected element to the front
  if (direction === "front") {
    canvas.bringToFront(selectedElement);
  } else if (direction === "back") {
    canvas.sendToBack(selectedElement);
  }

  // canvas.renderAll();
  syncShapeInStorage(selectedElement);

  // re-render all objects on the canvas
};