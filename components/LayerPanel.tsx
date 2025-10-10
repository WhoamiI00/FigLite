"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  type: "shape" | "text" | "image" | "drawing";
  zIndex: number;
}

interface LayerPanelProps {
  layers: Layer[];
  activeLayerId?: string;
  onLayerSelect: (layerId: string) => void;
  onLayerVisibilityToggle: (layerId: string) => void;
  onLayerLockToggle: (layerId: string) => void;
  onLayerReorder: (fromIndex: number, toIndex: number) => void;
  onLayerDelete: (layerId: string) => void;
  onLayerDuplicate: (layerId: string) => void;
}

export default function LayerPanel({
  layers,
  activeLayerId,
  onLayerSelect,
  onLayerVisibilityToggle,
  onLayerLockToggle,
  onLayerReorder,
  onLayerDelete,
  onLayerDuplicate,
}: LayerPanelProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onLayerReorder(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const getLayerIcon = (type: string) => {
    switch (type) {
      case "shape":
        return "/assets/rectangle.svg";
      case "text":
        return "/assets/text.svg";
      case "image":
        return "/assets/image.svg";
      case "drawing":
        return "/assets/freeform.svg";
      default:
        return "/assets/rectangle.svg";
    }
  };

  return (
    <div className='absolute right-0 top-12 z-50 flex max-h-96 w-64 flex-col rounded-lg bg-primary-black shadow-lg'>
      <div className='flex flex-shrink-0 items-center justify-between p-4'>
        <h3 className='text-lg font-semibold text-white'>Layers</h3>
        <Button
          onClick={() => {
            /* Add new layer logic */
          }}
          className='h-8 w-8 rounded bg-primary-green p-1 text-primary-black hover:bg-green-600'
          title='Add Layer'
        >
          +
        </Button>
      </div>

      <div className='custom-scrollbar flex-1 space-y-1 overflow-y-auto px-4 pb-4'>
        {layers.map((layer, index) => (
          <div
            key={layer.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onClick={() => onLayerSelect(layer.id)}
            className={`group flex cursor-pointer items-center gap-2 rounded p-2 transition-colors ${
              activeLayerId === layer.id
                ? "border border-primary-green bg-primary-green/20"
                : "bg-primary-grey-200 hover:bg-primary-grey-300"
            } ${draggedIndex === index ? "opacity-50" : ""}`}
          >
            {/* Drag Handle */}
            <div className='cursor-move opacity-50 hover:opacity-100'>
              <svg
                width='12'
                height='12'
                viewBox='0 0 12 12'
                fill='currentColor'
              >
                <circle cx='2' cy='2' r='1' />
                <circle cx='6' cy='2' r='1' />
                <circle cx='10' cy='2' r='1' />
                <circle cx='2' cy='6' r='1' />
                <circle cx='6' cy='6' r='1' />
                <circle cx='10' cy='6' r='1' />
                <circle cx='2' cy='10' r='1' />
                <circle cx='6' cy='10' r='1' />
                <circle cx='10' cy='10' r='1' />
              </svg>
            </div>

            {/* Layer Icon */}
            <div className='flex-shrink-0'>
              <Image
                src={getLayerIcon(layer.type)}
                alt={layer.type}
                width={16}
                height={16}
                className='text-primary-grey-300'
              />
            </div>

            {/* Layer Name */}
            <span className='flex-1 truncate text-sm text-white'>
              {layer.name}
            </span>

            {/* Layer Controls */}
            <div className='flex gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
              {/* Visibility Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLayerVisibilityToggle(layer.id);
                }}
                className='hover:bg-primary-grey-400 rounded p-1'
                title={layer.visible ? "Hide layer" : "Show layer"}
              >
                <svg
                  width='12'
                  height='12'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                >
                  {layer.visible ? (
                    <path d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z' />
                  ) : (
                    <path d='M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.15C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z' />
                  )}
                </svg>
              </button>

              {/* Lock Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLayerLockToggle(layer.id);
                }}
                className='hover:bg-primary-grey-400 rounded p-1'
                title={layer.locked ? "Unlock layer" : "Lock layer"}
              >
                <svg
                  width='12'
                  height='12'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                >
                  {layer.locked ? (
                    <path d='M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z' />
                  ) : (
                    <path d='M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z' />
                  )}
                </svg>
              </button>

              {/* Duplicate */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLayerDuplicate(layer.id);
                }}
                className='hover:bg-primary-grey-400 rounded p-1'
                title='Duplicate layer'
              >
                <svg
                  width='12'
                  height='12'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                >
                  <path d='M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z' />
                </svg>
              </button>

              {/* Delete */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLayerDelete(layer.id);
                }}
                className='rounded p-1 hover:bg-red-600'
                title='Delete layer'
              >
                <svg
                  width='12'
                  height='12'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                >
                  <path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {layers.length === 0 && (
          <div className='py-8 text-center text-primary-grey-300'>
            <p>No layers yet</p>
            <p className='text-sm'>Start drawing to create layers</p>
          </div>
        )}
      </div>
    </div>
  );
}
