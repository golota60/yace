import { css } from "@emotion/css";
import React, { SyntheticEvent, useState } from "react";
import SidePanel from "../generic/SidePanel";
import { useCurrentDirectory, useCurrentDirectoryFiles } from "../queryHooks";
import useDirectoryState, {
  EnhancedFileEntry,
} from "../utils/useDirectoryState";

const renderPanelElem = (
  dirElem: EnhancedFileEntry,
  toggleOpen: (folderPath: string) => Promise<void>,
  indentLevel = 0
): React.ReactElement => {
  const isDir = !!dirElem.children;

  const clickHandler = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleOpen(dirElem.path);
  };

  return (
    <>
      <SidePanel.Item
        isDir={isDir}
        onClick={clickHandler}
        isOpen={dirElem.open}
        linkClassName={css`
          padding-left: ${indentLevel}rem;
        `}
      >
        {dirElem.name}
      </SidePanel.Item>
      {dirElem.children?.length !== 0 &&
        dirElem.children?.map((nestedDirElem) =>
          renderPanelElem(nestedDirElem, toggleOpen, indentLevel + 1)
        )}
    </>
  );
};

const Sidenav = () => {
  const { data: currentDirFiles } = useCurrentDirectoryFiles();
  const { data: currentDir } = useCurrentDirectory();
  const [dirState, { toggleFolderOpen }] = useDirectoryState(currentDirFiles);

  const dirSplit = currentDir?.split("/");
  const dirTitle = dirSplit?.[dirSplit.length - 1];

  console.log({ dirState });
  return (
    <SidePanel title={dirTitle}>
      {dirState.length !== 0
        ? dirState.map((dirElem) => renderPanelElem(dirElem, toggleFolderOpen))
        : "No directory currently open"}
    </SidePanel>
  );
};

export default Sidenav;
