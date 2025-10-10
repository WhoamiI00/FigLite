"use client";

import { useState } from "react";
import { COLORS, GRADIENTS, opacityOptions } from "@/constants";
import { Button } from "./ui/button";

interface ColorPanelProps {
  activeColor: string;
  onColorChange: (color: string) => void;
  activeOpacity?: number;
  onOpacityChange?: (opacity: number) => void;
}

export default function ColorPanel({
  activeColor,
  onColorChange,
  activeOpacity = 1,
  onOpacityChange,
}: ColorPanelProps) {
  const [activeTab, setActiveTab] = useState<"solid" | "gradient">("solid");
  const [customColor, setCustomColor] = useState("#000000");

  return (
    <div className='absolute left-0 top-12 z-50 flex max-h-96 w-72 flex-col rounded-lg bg-primary-black shadow-lg'>
      {/* Tabs */}
      <div className='m-4 mb-2 flex flex-shrink-0 rounded-lg bg-primary-grey-200 p-1'>
        <Button
          onClick={() => setActiveTab("solid")}
          className={`flex-1 rounded-md px-3 py-1 text-sm ${
            activeTab === "solid"
              ? "bg-primary-green text-primary-black"
              : "text-primary-grey-300 hover:bg-primary-grey-300"
          }`}
        >
          Solid Colors
        </Button>
        <Button
          onClick={() => setActiveTab("gradient")}
          className={`flex-1 rounded-md px-3 py-1 text-sm ${
            activeTab === "gradient"
              ? "bg-primary-green text-primary-black"
              : "text-primary-grey-300 hover:bg-primary-grey-300"
          }`}
        >
          Gradients
        </Button>
      </div>

      <div className='custom-scrollbar flex-1 overflow-y-auto px-4 pb-4'>
        {activeTab === "solid" ? (
          <>
            {/* Custom Color Picker */}
            <div className='mb-4'>
              <label className='mb-2 block text-sm text-primary-grey-300'>
                Custom Color
              </label>
              <div className='flex gap-2'>
                <input
                  type='color'
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    onColorChange(e.target.value);
                  }}
                  className='h-8 w-12 rounded border-none bg-transparent'
                  aria-label='Custom color picker'
                />
                <input
                  type='text'
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    onColorChange(e.target.value);
                  }}
                  className='flex-1 rounded bg-primary-grey-200 px-2 py-1 text-sm text-white'
                  placeholder='#000000'
                />
              </div>
            </div>

            {/* Preset Colors */}
            <div className='mb-4'>
              <label className='mb-2 block text-sm text-primary-grey-300'>
                Preset Colors
              </label>
              <div className='grid grid-cols-5 gap-2'>
                {COLORS.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => onColorChange(color)}
                    className={`h-8 w-8 rounded border-2 ${
                      activeColor === color
                        ? "border-primary-green"
                        : "border-primary-grey-300"
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Gradients */
          <div className='mb-4'>
            <label className='mb-2 block text-sm text-primary-grey-300'>
              Gradient Presets
            </label>
            <div className='space-y-2'>
              {GRADIENTS.map((gradient, index) => (
                <button
                  key={index}
                  onClick={() => onColorChange(gradient.value)}
                  className={`h-8 w-full rounded border-2 ${
                    activeColor === gradient.value
                      ? "border-primary-green"
                      : "border-primary-grey-300"
                  }`}
                  style={{ background: gradient.value }}
                  title={gradient.name}
                >
                  <span className='sr-only'>{gradient.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Opacity Slider */}
        {onOpacityChange && (
          <div className='border-t border-primary-grey-300 pt-4'>
            <label className='mb-2 block text-sm text-primary-grey-300'>
              Opacity: {Math.round(activeOpacity * 100)}%
            </label>
            <input
              type='range'
              min='0.1'
              max='1'
              step='0.1'
              value={activeOpacity}
              onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
              className='w-full'
              aria-label='Opacity slider'
            />
            <div className='mt-2 flex gap-1'>
              {opacityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onOpacityChange(option.value)}
                  className={`rounded px-2 py-1 text-xs ${
                    activeOpacity === option.value
                      ? "bg-primary-green text-primary-black"
                      : "bg-primary-grey-200 text-primary-grey-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
