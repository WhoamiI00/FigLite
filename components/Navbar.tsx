"use client";

import Image from "next/image";
import { memo } from "react";
import { PanelLeft, PanelRight } from "lucide-react";

import { navElements } from "@/constants";
import { ActiveElement, NavbarProps } from "@/types/type";

import { Button } from "./ui/button";
import ShapesMenu from "./ShapesMenu";
import ActiveUsers from "./users/ActiveUsers";
import { NewThread } from "./comments/NewThread";
import ThemeToggle from "./ThemeToggle";

const Navbar = ({ activeElement, imageInputRef, handleImageUpload, handleActiveElement, onToggleLeftSidebar, onToggleRightSidebar }: NavbarProps) => {
  const isActive = (value: string | Array<ActiveElement>) =>
    (activeElement && activeElement.value === value) ||
    (Array.isArray(value) && value.some((val) => val?.value === activeElement?.value));

  return (
    <nav className="flex select-none flex-wrap items-center justify-between gap-2 bg-white px-3 text-gray-800 dark:bg-primary-black dark:text-white md:gap-4 md:px-5">
      <Image src="/assets/logo.svg" alt="FigPro Logo" width={58} height={20} className="dark:invert-0" />

      <ul className="flex flex-row flex-wrap">
        {navElements.map((item: ActiveElement | any) => (
          <li
            key={item.name}
            onClick={() => {
              if (Array.isArray(item.value)) return;
              handleActiveElement(item);
            }}
            className={`group flex items-center justify-center px-2 py-3 md:px-2.5 md:py-5
            ${isActive(item.value) ? "bg-primary-green" : "hover:bg-gray-200 dark:hover:bg-primary-grey-200"}
            `}
          >
            {/* If value is an array means it's a nav element with sub options i.e., dropdown */}
            {Array.isArray(item.value) ? (
              <ShapesMenu
                item={item}
                activeElement={activeElement}
                imageInputRef={imageInputRef}
                handleActiveElement={handleActiveElement}
                handleImageUpload={handleImageUpload}
              />
            ) : item?.value === "comments" ? (
              // If value is comments, trigger the NewThread component
              <NewThread>
                <Button className="relative h-5 w-5 object-contain">
                  <Image
                    src={item.icon}
                    alt={item.name}
                    fill
                    className={isActive(item.value) ? "invert" : "dark:invert-0"}
                  />
                </Button>
              </NewThread>
            ) : (
              <Button className="relative h-5 w-5 object-contain">
                <Image
                  src={item.icon}
                  alt={item.name}
                  fill
                  className={isActive(item.value) ? "invert" : "dark:invert-0"}
                />
              </Button>
            )}
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2">
        {onToggleLeftSidebar && (
          <Button
            onClick={onToggleLeftSidebar}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-transparent md:hidden hover:bg-gray-200 dark:hover:bg-primary-grey-200"
            title="Toggle layers panel"
          >
            <PanelLeft className="h-4 w-4 text-gray-700 dark:text-white" />
          </Button>
        )}
        {onToggleRightSidebar && (
          <Button
            onClick={onToggleRightSidebar}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-transparent md:hidden hover:bg-gray-200 dark:hover:bg-primary-grey-200"
            title="Toggle design panel"
          >
            <PanelRight className="h-4 w-4 text-gray-700 dark:text-white" />
          </Button>
        )}
        <ThemeToggle />
        <ActiveUsers />
      </div>
    </nav>
  );
};

export default memo(Navbar, (prevProps, nextProps) => prevProps.activeElement === nextProps.activeElement);
