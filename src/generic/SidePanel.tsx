import { css } from "@emotion/css";
import clsx from "clsx";
import React from "react";
import { ReactComponent as ChevronRight } from "./icons/chevron-right.svg";

interface SidePanelElemProps extends React.HTMLAttributes<HTMLElement> {
  isDir?: boolean;
  isOpen?: boolean;
}

const SidePanelElem = ({
  className,
  children,
  isDir,
  isOpen,
  ...props
}: SidePanelElemProps) => {
  return (
    <li className={clsx("cursor-pointer", className)} {...props}>
      <a className="p-0 flex w-full text-xs">
        {isDir ? (
          <span className="ml-0 pl-0 w-4">
            <ChevronRight
              width={14}
              className={clsx(
                "flex content-center items-center transition-transform pl-1",
                isOpen &&
                  css`
                    transform: rotate(90deg) translate(-2px, -2px);
                  `
              )}
            />
          </span>
        ) : (
          <span className="ml-3"></span>
        )}
        {children}
      </a>
    </li>
  );
};

interface SidePanelList extends React.HTMLAttributes<HTMLUListElement> {}

const SidePanelList = ({ className, children, ...props }: SidePanelList) => {
  return (
    <ul className={clsx("", className)} {...props}>
      {children}
    </ul>
  );
};

interface SidePanelProps extends React.HTMLAttributes<HTMLUListElement> {
  title?: string;
}

function SidePanel({ className, children, title, ...props }: SidePanelProps) {
  return (
    <ul
      className={clsx("h-screen overflow-y-scroll bg-base-200 menu", className)}
      {...props}
    >
      {title && <li className="menu-title text-sm">{title}</li>}
      {children}
    </ul>
  );
}

SidePanel.Item = SidePanelElem;
SidePanel.List = SidePanelList;

export default SidePanel;
