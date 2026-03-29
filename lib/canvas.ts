import { fabric } from "fabric";
import { v4 as uuid4 } from "uuid";

import {
  CanvasMouseDown,
  CanvasMouseMove,
  CanvasMouseUp,
  CanvasObjectModified,
  CanvasObjectScaling,
  CanvasPathCreated,
  CanvasSelectionCreated,
  RenderCanvas,
} from "@/types/type";
import { defaultNavElement } from "@/constants";
import { createSpecificShape } from "./shapes";

// initialize fabric canvas
export const initializeFabric = ({
  fabricRef,
  canvasRef,
}: {
  fabricRef: React.MutableRefObject<fabric.Canvas | null>;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
}) => {
  // get canvas element
  const canvasElement = document.getElementById("canvas");

  // create fabric canvas
  const canvas = new fabric.Canvas(canvasRef.current, {
    width: canvasElement?.clientWidth,
    height: canvasElement?.clientHeight,
    allowTouchScrolling: false,
  });

  // set canvas reference to fabricRef so we can use it later anywhere outside canvas listener
  fabricRef.current = canvas;

  return canvas;
};

// instantiate creation of custom fabric object/shape and add it to canvas
export const handleCanvasMouseDown = ({
  options,
  canvas,
  selectedShapeRef,
  isDrawing,
  shapeRef,
}: CanvasMouseDown) => {
  // get pointer coordinates
  const pointer = canvas.getPointer(options.e);

  /**
   * get target object i.e., the object that is clicked
   * findtarget() returns the object that is clicked
   *
   * findTarget: http://fabricjs.com/docs/fabric.Canvas.html#findTarget
   */
  const target = canvas.findTarget(options.e, false);

  // set canvas drawing mode to false
  canvas.isDrawingMode = false;

  // if selected shape is a drawing tool, set drawing mode to true and configure brush
  const drawingTools = ["freeform", "pen", "brush", "highlighter", "eraser"];
  if (drawingTools.includes(selectedShapeRef.current || "")) {
    isDrawing.current = true;
    canvas.isDrawingMode = true;

    switch (selectedShapeRef.current) {
      case "pen":
        canvas.freeDrawingBrush.width = 2;
        canvas.freeDrawingBrush.color = "#aabbcc";
        break;
      case "brush":
        canvas.freeDrawingBrush.width = 10;
        canvas.freeDrawingBrush.color = "#aabbcc";
        break;
      case "highlighter":
        canvas.freeDrawingBrush.width = 20;
        canvas.freeDrawingBrush.color = "rgba(170,187,204,0.3)";
        break;
      case "eraser":
        canvas.freeDrawingBrush.width = 20;
        canvas.freeDrawingBrush.color = "#ffffff";
        break;
      case "freeform":
      default:
        canvas.freeDrawingBrush.width = 5;
        canvas.freeDrawingBrush.color = "#aabbcc";
        break;
    }
    return;
  }

  canvas.isDrawingMode = false;

  // if target is the selected shape or active selection, set isDrawing to false
  if (
    target &&
    (target.type === selectedShapeRef.current ||
      target.type === "activeSelection")
  ) {
    isDrawing.current = false;

    // set active object to target
    canvas.setActiveObject(target);

    /**
     * setCoords() is used to update the controls of the object
     * setCoords: http://fabricjs.com/docs/fabric.Object.html#setCoords
     */
    target.setCoords();
  } else {
    isDrawing.current = true;

    // create custom fabric object/shape and set it to shapeRef
    shapeRef.current = createSpecificShape(
      selectedShapeRef.current,
      pointer as any
    );

    // if shapeRef is not null, add it to canvas
    if (shapeRef.current) {
      // add: http://fabricjs.com/docs/fabric.Canvas.html#add
      canvas.add(shapeRef.current);
    }
  }
};

// handle mouse move event on canvas to draw shapes with different dimensions
export const handleCanvaseMouseMove = ({
  options,
  canvas,
  isDrawing,
  selectedShapeRef,
  shapeRef,
  syncShapeInStorage,
}: CanvasMouseMove) => {
  // if selected shape is freeform, return
  if (!isDrawing.current) return;
  const drawingTools = ["freeform", "pen", "brush", "highlighter", "eraser"];
  if (drawingTools.includes(selectedShapeRef.current || "")) return;

  canvas.isDrawingMode = false;

  // get pointer coordinates
  const pointer = canvas.getPointer(options.e);

  // depending on the selected shape, set the dimensions of the shape stored in shapeRef in previous step of handelCanvasMouseDown
  // calculate shape dimensions based on pointer coordinates
  switch (selectedShapeRef?.current) {
    case "rectangle":
      shapeRef.current?.set({
        width: pointer.x - (shapeRef.current?.left || 0),
        height: pointer.y - (shapeRef.current?.top || 0),
      });
      break;

    case "circle":
      shapeRef.current.set({
        radius: Math.abs(pointer.x - (shapeRef.current?.left || 0)) / 2,
      });
      break;

    case "triangle":
      shapeRef.current?.set({
        width: pointer.x - (shapeRef.current?.left || 0),
        height: pointer.y - (shapeRef.current?.top || 0),
      });
      break;

    case "line":
      shapeRef.current?.set({
        x2: pointer.x,
        y2: pointer.y,
      });
      break;

    case "image":
      shapeRef.current?.set({
        width: pointer.x - (shapeRef.current?.left || 0),
        height: pointer.y - (shapeRef.current?.top || 0),
      });
      break;

    case "star":
    case "pentagon":
    case "hexagon":
    case "arrow":
    case "diamond":
    case "heart":
    case "cloud":
    case "bubble": {
      const scaleX =
        (pointer.x - (shapeRef.current?.left || 0)) /
        (shapeRef.current?.width || 1);
      const scaleY =
        (pointer.y - (shapeRef.current?.top || 0)) /
        (shapeRef.current?.height || 1);
      shapeRef.current?.set({
        scaleX: Math.abs(scaleX),
        scaleY: Math.abs(scaleY),
      });
      break;
    }

    default:
      break;
  }

  // render objects on canvas
  // renderAll: http://fabricjs.com/docs/fabric.Canvas.html#renderAll
  canvas.renderAll();

  // sync shape in storage
  if (shapeRef.current?.objectId) {
    syncShapeInStorage(shapeRef.current);
  }
};

// handle mouse up event on canvas to stop drawing shapes
export const handleCanvasMouseUp = ({
  canvas,
  isDrawing,
  shapeRef,
  activeObjectRef,
  selectedShapeRef,
  syncShapeInStorage,
  setActiveElement,
}: CanvasMouseUp) => {
  isDrawing.current = false;
  const drawingTools = ["freeform", "pen", "brush", "highlighter", "eraser"];
  if (drawingTools.includes(selectedShapeRef.current || "")) return;

  // sync shape in storage as drawing is stopped
  syncShapeInStorage(shapeRef.current);

  // set everything to null
  shapeRef.current = null;
  activeObjectRef.current = null;
  selectedShapeRef.current = null;

  // if canvas is not in drawing mode, set active element to default nav element after 700ms
  if (!canvas.isDrawingMode) {
    setTimeout(() => {
      setActiveElement(defaultNavElement);
    }, 700);
  }
};

// update shape in storage when object is modified
export const handleCanvasObjectModified = ({
  options,
  syncShapeInStorage,
}: CanvasObjectModified) => {
  const target = options.target;
  if (!target) return;

  if (target?.type == "activeSelection") {
    // fix this
  } else {
    syncShapeInStorage(target);
  }
};

// update shape in storage when path is created when in freeform mode
export const handlePathCreated = ({
  options,
  syncShapeInStorage,
}: CanvasPathCreated) => {
  // get path object
  const path = options.path;
  if (!path) return;

  // set unique id to path object
  path.set({
    objectId: uuid4(),
  });

  // sync shape in storage
  syncShapeInStorage(path);
};

// check how object is moving on canvas and restrict it to canvas boundaries
export const handleCanvasObjectMoving = ({
  options,
}: {
  options: fabric.IEvent;
}) => {
  // get target object which is moving
  const target = options.target as fabric.Object;

  // target.canvas is the canvas on which the object is moving
  const canvas = target.canvas as fabric.Canvas;

  // set coordinates of target object
  target.setCoords();

  // restrict object to canvas boundaries (horizontal)
  if (target && target.left) {
    target.left = Math.max(
      0,
      Math.min(
        target.left,
        (canvas.width || 0) - (target.getScaledWidth() || target.width || 0)
      )
    );
  }

  // restrict object to canvas boundaries (vertical)
  if (target && target.top) {
    target.top = Math.max(
      0,
      Math.min(
        target.top,
        (canvas.height || 0) - (target.getScaledHeight() || target.height || 0)
      )
    );
  }
};

// set element attributes when element is selected
export const handleCanvasSelectionCreated = ({
  options,
  isEditingRef,
  setElementAttributes,
}: CanvasSelectionCreated) => {
  // if user is editing manually, return
  if (isEditingRef.current) return;

  // if no element is selected, return
  if (!options?.selected) return;

  // get the selected element
  const selectedElement = options?.selected[0] as fabric.Object;

  // if only one element is selected, set element attributes
  if (selectedElement && options.selected.length === 1) {
    // calculate scaled dimensions of the object
    const scaledWidth = selectedElement?.scaleX
      ? selectedElement?.width! * selectedElement?.scaleX
      : selectedElement?.width;

    const scaledHeight = selectedElement?.scaleY
      ? selectedElement?.height! * selectedElement?.scaleY
      : selectedElement?.height;

    setElementAttributes({
      width: scaledWidth?.toFixed(0).toString() || "",
      height: scaledHeight?.toFixed(0).toString() || "",
      fill: selectedElement?.fill?.toString() || "",
      stroke: selectedElement?.stroke || "",
      // @ts-ignore
      fontSize: selectedElement?.fontSize || "",
      // @ts-ignore
      fontFamily: selectedElement?.fontFamily || "",
      // @ts-ignore
      fontWeight: selectedElement?.fontWeight || "",
    });
  }
};

// update element attributes when element is scaled
export const handleCanvasObjectScaling = ({
  options,
  setElementAttributes,
}: CanvasObjectScaling) => {
  const selectedElement = options.target;

  // calculate scaled dimensions of the object
  const scaledWidth = selectedElement?.scaleX
    ? selectedElement?.width! * selectedElement?.scaleX
    : selectedElement?.width;

  const scaledHeight = selectedElement?.scaleY
    ? selectedElement?.height! * selectedElement?.scaleY
    : selectedElement?.height;

  setElementAttributes((prev) => ({
    ...prev,
    width: scaledWidth?.toFixed(0).toString() || "",
    height: scaledHeight?.toFixed(0).toString() || "",
  }));
};

// render canvas objects coming from storage on canvas
export const renderCanvas = ({
  fabricRef,
  canvasObjects,
  activeObjectRef,
}: RenderCanvas) => {
  // clear canvas
  fabricRef.current?.clear();

  // render all objects on canvas
  Array.from(canvasObjects, ([objectId, objectData]) => {
    /**
     * enlivenObjects() is used to render objects on canvas.
     * It takes two arguments:
     * 1. objectData: object data to render on canvas
     * 2. callback: callback function to execute after rendering objects
     * on canvas
     *
     * enlivenObjects: http://fabricjs.com/docs/fabric.util.html#.enlivenObjectEnlivables
     */
    fabric.util.enlivenObjects(
      [objectData],
      (enlivenedObjects: fabric.Object[]) => {
        enlivenedObjects.forEach((enlivenedObj) => {
          // if element is active, keep it in active state so that it can be edited further
          if (activeObjectRef.current?.objectId === objectId) {
            fabricRef.current?.setActiveObject(enlivenedObj);
          }

          // add object to canvas
          fabricRef.current?.add(enlivenedObj);
        });
      },
      /**
       * specify namespace of the object for fabric to render it on canvas
       * A namespace is a string that is used to identify the type of
       * object.
       *
       * Fabric Namespace: http://fabricjs.com/docs/fabric.html
       */
      "fabric"
    );
  });

  fabricRef.current?.renderAll();
};

// resize canvas dimensions on window resize
export const handleResize = ({ canvas }: { canvas: fabric.Canvas | null }) => {
  const canvasElement = document.getElementById("canvas");
  if (!canvasElement) return;

  if (!canvas) return;

  canvas.setDimensions({
    width: canvasElement.clientWidth,
    height: canvasElement.clientHeight,
  });
};

// zoom canvas on mouse scroll
export const handleCanvasZoom = ({
  options,
  canvas,
}: {
  options: fabric.IEvent & { e: WheelEvent };
  canvas: fabric.Canvas;
}) => {
  const delta = options.e?.deltaY;
  let zoom = canvas.getZoom();

  // allow zooming to min 20% and max 100%
  const minZoom = 0.2;
  const maxZoom = 1;
  const zoomStep = 0.001;

  // calculate zoom based on mouse scroll wheel with min and max zoom
  zoom = Math.min(Math.max(minZoom, zoom + delta * zoomStep), maxZoom);

  // set zoom to canvas
  // zoomToPoint: http://fabricjs.com/docs/fabric.Canvas.html#zoomToPoint
  canvas.zoomToPoint({ x: options.e.offsetX, y: options.e.offsetY }, zoom);

  options.e.preventDefault();
  options.e.stopPropagation();
};

// handle panning when space is held and mouse is dragged
export const handleCanvasPanMouseDown = ({
  options,
  canvas,
  isPanning,
  lastPanPos,
}: {
  options: fabric.IEvent;
  canvas: fabric.Canvas;
  isPanning: React.MutableRefObject<boolean>;
  lastPanPos: React.MutableRefObject<{ x: number; y: number } | null>;
}) => {
  if (!isPanning.current) return false;
  canvas.selection = false;
  canvas.discardActiveObject();
  const e = options.e as MouseEvent;
  lastPanPos.current = { x: e.clientX, y: e.clientY };
  canvas.setCursor("grab");
  return true;
};

export const handleCanvasPanMouseMove = ({
  options,
  canvas,
  isPanning,
  lastPanPos,
}: {
  options: fabric.IEvent;
  canvas: fabric.Canvas;
  isPanning: React.MutableRefObject<boolean>;
  lastPanPos: React.MutableRefObject<{ x: number; y: number } | null>;
}) => {
  if (!isPanning.current || !lastPanPos.current) return false;
  const e = options.e as MouseEvent;
  const deltaX = e.clientX - lastPanPos.current.x;
  const deltaY = e.clientY - lastPanPos.current.y;
  canvas.relativePan(new fabric.Point(deltaX, deltaY));
  lastPanPos.current = { x: e.clientX, y: e.clientY };
  canvas.setCursor("grab");
  return true;
};

export const handleCanvasPanMouseUp = ({
  canvas,
  isPanning,
  lastPanPos,
}: {
  canvas: fabric.Canvas;
  isPanning: React.MutableRefObject<boolean>;
  lastPanPos: React.MutableRefObject<{ x: number; y: number } | null>;
}) => {
  lastPanPos.current = null;
  if (isPanning.current) {
    canvas.selection = true;
    canvas.setCursor("default");
  }
};

// fit all objects on canvas to the viewport with 10% padding
export const handleFitToScreen = (canvas: fabric.Canvas) => {
  const objects = canvas.getObjects();
  if (objects.length === 0) return;

  // get bounding box of all objects
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  objects.forEach((obj) => {
    const bound = obj.getBoundingRect();
    minX = Math.min(minX, bound.left);
    minY = Math.min(minY, bound.top);
    maxX = Math.max(maxX, bound.left + bound.width);
    maxY = Math.max(maxY, bound.top + bound.height);
  });

  const objWidth = maxX - minX;
  const objHeight = maxY - minY;
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();

  // calculate zoom to fit with 10% padding
  const padding = 0.1;
  const zoomX = (canvasWidth * (1 - padding * 2)) / objWidth;
  const zoomY = (canvasHeight * (1 - padding * 2)) / objHeight;
  const zoom = Math.min(zoomX, zoomY, 1); // don't zoom in past 100%

  // reset viewport
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
  canvas.zoomToPoint(
    new fabric.Point(canvasWidth / 2, canvasHeight / 2),
    zoom
  );

  // center objects in viewport
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const vpCenterX = canvasWidth / 2;
  const vpCenterY = canvasHeight / 2;
  canvas.relativePan(
    new fabric.Point(
      vpCenterX - centerX * zoom,
      vpCenterY - centerY * zoom
    )
  );

  canvas.requestRenderAll();
};
