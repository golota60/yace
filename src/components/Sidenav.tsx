import { css } from "@emotion/css";
import { fs } from "@tauri-apps/api";
import React, { SyntheticEvent } from "react";
import SidePanel from "../generic/SidePanel";
import { useStore } from "../store";
import useDirectoryState, {
  EnhancedFileEntry,
  isFolder,
} from "../utils/useDirectoryState";

const renderPanelElem = (
  dirElem: EnhancedFileEntry,
  toggleOpen: (folderPath: string) => Promise<void>,
  indentLevel = 0
): React.ReactElement => {
  const isDir = isFolder(dirElem);

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
  const workingDirFiles = useStore((store) => store.workingDirFiles);
  const workingDirPath = useStore((store) => store.workingDirPath);

  const openFile = useStore((store) => store.openFile);
  const [dirState, { toggleFolderOpen }] = useDirectoryState(workingDirFiles);

  const handleOpenFileEditor = async (filePath: string) => {
    toggleFolderOpen(filePath);

    // logic to open file

    const readFile = await fs.readTextFile(filePath);
    if (readFile) {
      openFile({ contents: readFile, path: filePath });
    }
  };

  const dirSplit = workingDirPath?.split("/");
  const dirTitle = dirSplit?.[dirSplit.length - 1];

  return (
    <SidePanel title={dirTitle}>
      {dirState.length !== 0
        ? dirState.map((dirElem) =>
            renderPanelElem(dirElem, handleOpenFileEditor)
          )
        : "No directory currently open"}
    </SidePanel>
  );
};

export default Sidenav;
