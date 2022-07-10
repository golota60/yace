import { css } from "@emotion/css";
import { fs } from "@tauri-apps/api";
import React, { SyntheticEvent, useState } from "react";
import { useQueryClient } from "react-query";
import SidePanel from "../generic/SidePanel";
import {
  QueryKeys,
  useCurrentDirectory,
  useCurrentDirectoryFiles,
  useOpenedFile,
} from "../queryHooks";
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
  const queryClient = useQueryClient();

  const { data: currentDirFiles } = useCurrentDirectoryFiles();
  const { data: currentDir } = useCurrentDirectory();
  const { data: openedFile } = useOpenedFile();
  const [dirState, { toggleFolderOpen, getFile }] =
    useDirectoryState(currentDirFiles);

  const handleOpenFileEditor = async (filePath: string) => {
    const foundFile = getFile(filePath);
    const isDir = isFolder(foundFile);
    console.log({ foundFile, isDir });

    toggleFolderOpen(filePath);

    // logic to open file

    const readFile = await fs.readTextFile(filePath);
    console.log({ readFile });
    if (readFile) {
      queryClient.setQueryData(QueryKeys.OpenFile, () => {
        return { contents: readFile, path: filePath };
      });
    }
  };

  const dirSplit = currentDir?.split("/");
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
