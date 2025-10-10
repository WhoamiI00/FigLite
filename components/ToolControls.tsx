"use client";

import { useState } from "react";
import Image from "next/image";
import {
  brushSizeOptions,
  textStyleOptions,
  transformOptions,
} from "@/constants";
import { Button } from "./ui/button";

interface BrushControlsProps {
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
  activeTool: string;
}

export default function BrushControls({
  brushSize,
  onBrushSizeChange,
  opacity,
  onOpacityChange,
  activeTool,
}: BrushControlsProps) {
  const [showSizePanel, setShowSizePanel] = useState(false);

  if (
    !["freeform", "brush", "pen", "highlighter", "eraser"].includes(activeTool)
  ) {
    return null;
  }

  return (
    <div className='absolute left-1/2 top-16 z-40 -translate-x-1/2 transform'>
      <div className='flex items-center gap-2 rounded-lg bg-primary-black px-4 py-2 shadow-lg'>
        {/* Brush Size */}
        <div className='relative'>
          <Button
            onClick={() => setShowSizePanel(!showSizePanel)}
            className='flex items-center gap-2 rounded bg-primary-grey-200 px-3 py-2 text-white hover:bg-primary-grey-300'
          >
            <span className='text-sm'>Size: {brushSize}px</span>
            <div
              className='rounded-full bg-white'
              style={{
                width: Math.min(brushSize, 16),
                height: Math.min(brushSize, 16),
              }}
            />
          </Button>

          {showSizePanel && (
            <div className='absolute left-0 top-12 z-50 rounded-lg bg-primary-black p-3 shadow-lg'>
              <div className='grid grid-cols-2 gap-2'>
                {brushSizeOptions.map((option) => (
                  <Button
                    key={option.value}
                    onClick={() => {
                      onBrushSizeChange(option.value);
                      setShowSizePanel(false);
                    }}
                    className={`flex items-center gap-2 rounded px-3 py-2 text-sm ${
                      brushSize === option.value
                        ? "bg-primary-green text-primary-black"
                        : "bg-primary-grey-200 text-white hover:bg-primary-grey-300"
                    }`}
                  >
                    <div
                      className='rounded-full bg-white'
                      style={{
                        width: Math.min(option.value, 12),
                        height: Math.min(option.value, 12),
                      }}
                    />
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Opacity Slider */}
        <div className='flex items-center gap-2'>
          <span className='text-sm text-white'>Opacity:</span>
          <input
            type='range'
            min='0.1'
            max='1'
            step='0.1'
            value={opacity}
            onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
            className='w-20'
            aria-label='Brush opacity'
          />
          <span className='w-8 text-sm text-white'>
            {Math.round(opacity * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}

// Text Controls Component
interface TextControlsProps {
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  fontFamily: string;
  onFontFamilyChange: (family: string) => void;
  textStyles: string[];
  onTextStyleToggle: (style: string) => void;
  activeTool: string;
}

export function TextControls({
  fontSize,
  onFontSizeChange,
  fontFamily,
  onFontFamilyChange,
  textStyles,
  onTextStyleToggle,
  activeTool,
}: TextControlsProps) {
  if (activeTool !== "text") {
    return null;
  }

  return (
    <div className='absolute left-1/2 top-16 z-40 -translate-x-1/2 transform'>
      <div className='flex items-center gap-4 rounded-lg bg-primary-black px-4 py-2 shadow-lg'>
        {/* Font Family */}
        <select
          value={fontFamily}
          onChange={(e) => onFontFamilyChange(e.target.value)}
          className='rounded bg-primary-grey-200 px-3 py-1 text-white'
          aria-label='Font family'
        >
          <option value='Inter'>Inter</option>
          <option value='Roboto'>Roboto</option>
          <option value='Open Sans'>Open Sans</option>
          <option value='Lato'>Lato</option>
          <option value='Montserrat'>Montserrat</option>
          <option value='Poppins'>Poppins</option>
          <option value='Playfair Display'>Playfair Display</option>
          <option value='Merriweather'>Merriweather</option>
          <option value='Fira Code'>Fira Code</option>
          <option value='Dancing Script'>Dancing Script</option>
        </select>

        {/* Font Size */}
        <div className='flex items-center gap-2'>
          <button
            onClick={() => onFontSizeChange(Math.max(8, fontSize - 2))}
            className='rounded bg-primary-grey-200 px-2 py-1 text-white hover:bg-primary-grey-300'
            aria-label='Decrease font size'
          >
            A-
          </button>
          <span className='w-12 text-center text-sm text-white'>
            {fontSize}px
          </span>
          <button
            onClick={() => onFontSizeChange(Math.min(96, fontSize + 2))}
            className='rounded bg-primary-grey-200 px-2 py-1 text-white hover:bg-primary-grey-300'
            aria-label='Increase font size'
          >
            A+
          </button>
        </div>

        {/* Text Styles */}
        <div className='flex gap-1'>
          {textStyleOptions.map((style) => (
            <Button
              key={style.value}
              onClick={() => onTextStyleToggle(style.value)}
              className={`h-8 w-8 rounded p-1 ${
                textStyles.includes(style.value)
                  ? "bg-primary-green text-primary-black"
                  : "bg-primary-grey-200 text-white hover:bg-primary-grey-300"
              }`}
              title={style.name}
            >
              <Image
                src={style.icon}
                alt={style.name}
                width={16}
                height={16}
                className={
                  textStyles.includes(style.value) ? "invert-0" : "invert"
                }
              />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Transform Controls Component
interface TransformControlsProps {
  onTransform: (type: string) => void;
  selectedObjects: any[];
}

export function TransformControls({
  onTransform,
  selectedObjects,
}: TransformControlsProps) {
  if (selectedObjects.length === 0) {
    return null;
  }

  return (
    <div className='absolute bottom-4 left-1/2 z-40 -translate-x-1/2 transform'>
      <div className='flex items-center gap-2 rounded-lg bg-primary-black px-4 py-2 shadow-lg'>
        <span className='mr-2 text-sm text-white'>Transform:</span>
        {transformOptions.map((option) => (
          <Button
            key={option.value}
            onClick={() => onTransform(option.value)}
            className='h-8 w-8 rounded bg-primary-grey-200 p-1 text-white hover:bg-primary-grey-300'
            title={option.name}
          >
            <Image
              src={option.icon}
              alt={option.name}
              width={16}
              height={16}
              className='invert'
            />
          </Button>
        ))}
      </div>
    </div>
  );
}
