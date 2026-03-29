"use client";

import { useMemo } from "react";
import Image from "next/image";

import { getShapeInfo } from "@/lib/utils";

const LeftSidebar = ({ allShapes, visible }: { allShapes: Array<any>; visible?: boolean }) => {
  // memoize the result of this function so that it doesn't change on every render but only when there are new shapes
  const memoizedShapes = useMemo(
    () => (
      <section className={`sticky left-0 flex h-full min-w-[227px] select-none flex-col border-t border-gray-200 bg-white text-gray-600 dark:border-primary-grey-200 dark:bg-primary-black dark:text-primary-grey-300 ${visible ? 'block' : 'hidden md:flex'}`}>
        <h3 className='flex-shrink-0 border border-gray-200 px-5 py-4 text-xs uppercase dark:border-primary-grey-200'>
          Layers
        </h3>
        <div className='custom-scrollbar flex flex-1 flex-col overflow-y-auto pb-4'>
          {allShapes?.map((shape: any) => {
            const info = getShapeInfo(shape[1]?.type);

            return (
              <div
                key={shape[1]?.objectId}
                className='group my-1 flex flex-shrink-0 items-center gap-2 px-5 py-2.5 hover:cursor-pointer hover:bg-primary-green hover:text-primary-black'
              >
                <Image
                  src={info?.icon}
                  alt='Layer'
                  width={16}
                  height={16}
                  className='group-hover:invert'
                />
                <h3 className='text-sm font-semibold capitalize'>
                  {info.name}
                </h3>
              </div>
            );
          })}
        </div>
      </section>
    ),
    [allShapes?.length, visible]
  );

  return memoizedShapes;
};

export default LeftSidebar;
