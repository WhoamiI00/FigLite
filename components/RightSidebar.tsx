import React, { useMemo, useRef, useState } from "react";

import { RightSidebarProps } from "@/types/type";
import { bringElement, modifyShape } from "@/lib/shapes";

import Text from "./settings/Text";
import Color from "./settings/Color";
import Export from "./settings/Export";
import Dimensions from "./settings/Dimensions";
import RoomInfo from "./RoomInfo";
import Chat from "./Chat";
import { Button } from "./ui/button";
import Image from "next/image";

interface ExtendedRightSidebarProps extends RightSidebarProps {
  visible?: boolean;
}

const RightSidebar = ({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  activeObjectRef,
  isEditingRef,
  syncShapeInStorage,
  roomCode,
  visible,
}: ExtendedRightSidebarProps) => {
  const colorInputRef = useRef(null);
  const strokeInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState<"design" | "chat">("design");

  const handleInputChange = (property: string, value: string) => {
    if (!isEditingRef.current) isEditingRef.current = true;

    setElementAttributes((prev) => ({ ...prev, [property]: value }));

    modifyShape({
      canvas: fabricRef.current as fabric.Canvas,
      property,
      value,
      activeObjectRef,
      syncShapeInStorage,
    });
  };

  // memoize the content of the right sidebar to avoid re-rendering on every mouse actions
  const memoizedContent = useMemo(
    () => (
      <section className={`sticky right-0 flex h-full min-w-[227px] select-none flex-col border-t border-gray-200 bg-white text-gray-600 dark:border-primary-grey-200 dark:bg-primary-black dark:text-primary-grey-300 ${visible ? 'block' : 'hidden md:flex'}`}>
        {/* Tab Navigation */}
        <div className='flex-shrink-0 border-b border-gray-200 dark:border-primary-grey-200'>
          <div className='flex'>
            <Button
              onClick={() => setActiveTab("design")}
              className={`flex-1 rounded-none px-4 py-3 text-xs font-medium transition-colors ${
                activeTab === "design"
                  ? "border-b-2 border-primary-green bg-primary-green text-primary-black"
                  : "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-primary-grey-300 dark:hover:bg-primary-grey-200 dark:hover:text-white"
              }`}
            >
              <Image
                src='/assets/settings.svg'
                alt='Design'
                width={14}
                height={14}
                className='mr-2'
              />
              DESIGN
            </Button>
            <Button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 rounded-none px-4 py-3 text-xs font-medium transition-colors ${
                activeTab === "chat"
                  ? "border-b-2 border-primary-green bg-primary-green text-primary-black"
                  : "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-primary-grey-300 dark:hover:bg-primary-grey-200 dark:hover:text-white"
              }`}
            >
              <Image
                src='/assets/comments.svg'
                alt='Chat'
                width={14}
                height={14}
                className='mr-2'
              />
              CHAT
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "design" ? (
          <>
            <div className='flex-shrink-0 px-5 pt-4'>
              <span className='mt-3 pb-4 text-xs text-primary-grey-300'>
                Make changes to canvas as you like
              </span>
            </div>

            <div className='custom-scrollbar flex flex-1 flex-col overflow-y-auto pb-4'>
              <Dimensions
                isEditingRef={isEditingRef}
                width={elementAttributes.width}
                height={elementAttributes.height}
                handleInputChange={handleInputChange}
              />

              <Text
                fontFamily={elementAttributes.fontFamily}
                fontSize={elementAttributes.fontSize}
                fontWeight={elementAttributes.fontWeight}
                handleInputChange={handleInputChange}
              />

              <Color
                inputRef={colorInputRef}
                attribute={elementAttributes.fill}
                placeholder='color'
                attributeType='fill'
                handleInputChange={handleInputChange}
              />

              <Color
                inputRef={strokeInputRef}
                attribute={elementAttributes.stroke}
                placeholder='stroke'
                attributeType='stroke'
                handleInputChange={handleInputChange}
              />

              <Export />

              <RoomInfo roomCode={roomCode} />
            </div>
          </>
        ) : (
          <div className='flex min-h-0 flex-1 flex-col'>
            <Chat roomCode={roomCode} />
          </div>
        )}
      </section>
    ),
    [elementAttributes, roomCode, activeTab, visible]
  ); // only re-render when elementAttributes, roomCode, activeTab, or visible changes

  return memoizedContent;
};

export default RightSidebar;
