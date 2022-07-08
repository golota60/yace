import React, { useState } from "react";
import SidePanel from "../generic/SidePanel";
import { useCurrentDirectory, useCurrentDirectoryFiles } from "../queryHooks";
import useDirectoryState, {
  EnhancedFileEntry,
} from "../utils/useDirectoryState";

const renderPanelElem = (
  dirElem: EnhancedFileEntry,
  toggleOpen: (folderPath: string) => Promise<void>
) => {
  const isDir = !!dirElem.children;

  return (
    <SidePanel.Item
      isDir={isDir}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleOpen(dirElem.path);
      }}
      isOpen={dirElem.open}
    >
      {isDir && dirElem.open ? (
        <SidePanel.List>
          <SidePanel.Item>{dirElem.name}</SidePanel.Item>
          {dirElem.children?.length !== 0 &&
            dirElem.children?.map((nestedDirElem) =>
              renderPanelElem(nestedDirElem, toggleOpen)
            )}
        </SidePanel.List>
      ) : (
        <SidePanel.Item>{dirElem.name}</SidePanel.Item>
      )}
    </SidePanel.Item>
  );
};

const Sidenav = () => {
  const { data: currentDirFiles } = useCurrentDirectoryFiles();
  const { data: currentDir } = useCurrentDirectory();
  const [dirState, { toggleFolderOpen }] = useDirectoryState(currentDirFiles);

  const dirSplit = currentDir?.split("/");
  const dirTitle = dirSplit?.[dirSplit.length - 1];

  return (
    <SidePanel title={dirTitle}>
      <SidePanel.List>
        {dirState.length !== 0
          ? dirState.map((dirElem) =>
              renderPanelElem(dirElem, toggleFolderOpen)
            )
          : "No directory currently open"}
      </SidePanel.List>
    </SidePanel>
  );
};

export default Sidenav;
