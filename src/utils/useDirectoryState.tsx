import { fs } from "@tauri-apps/api";
import { useEffect, useState } from "react";

// To be used inside a `map`
const openFileRecursive = async (
  currFolder: EnhancedFileEntry,
  folderPath: string,
  updater: (
    newFolder: EnhancedFileEntry
  ) => EnhancedFileEntry | Promise<EnhancedFileEntry>
) => {
  // If this is the file, update and return it
  if (currFolder.path === folderPath) {
    const newFolderState = await updater(currFolder);
    return newFolderState;
  }

  // If current folder doesn't have children just return it
  if (!currFolder.children || currFolder.children.length === 0)
    return currFolder;

  // map recursively through children if exist and update them
  const newChildren = await Promise.all(
    currFolder.children?.map(
      async (childFileEntry) =>
        await openFileRecursive(childFileEntry, folderPath, updater)
    )
  );
  const folder = {
    ...currFolder,
    children: newChildren,
  } as EnhancedFileEntry;
  return folder;
};

// To be used inside a `find`
// aaand doesn't work - also it should be converted and used inside reduce cause otherwise you cant return nested folder
const findFileRecursive = (
  currFolder: EnhancedFileEntry,
  folderPath: string
): boolean => {
  // If this is the file, return it
  if (currFolder.path === folderPath) {
    return true;
  }

  // If current folder doesn't have children return false, as it is imposible that this is the one
  if (!currFolder.children || currFolder.children.length === 0) return false;

  // is this even needed?? this should never file i think
  const file = currFolder.children?.find((childFileEntry) =>
    findFileRecursive(childFileEntry, folderPath)
  );
  if (file) return true;
  return false;
};

export interface EnhancedFileEntry extends fs.FileEntry {
  open?: boolean;
}

/**
 * Hook that enhances directory state
 * Folders are files with `children: Array<EnhancedFileEntry> || []`.
 */
const useDirectoryState = (initialState?: Array<EnhancedFileEntry>) => {
  const [dirState, setDirState] = useState(initialState || []);

  useEffect(() => {
    if (initialState) setDirState(initialState);
  }, [initialState]);

  const getFile = (filePath: string) => {
    const folder = dirState.find((elem) => findFileRecursive(elem, filePath));
    if (!folder) {
      console.error(`Didn't find a folder with path: ${filePath}`);
      return;
    }
    return folder;
  };

  const toggleFolderOpen = async (folderPath: string) => {
    // when you open a directory, fill it's children
    // should children be removed when closing? open ended question - currently yes cause i don't wanna think about it
    const newState = await Promise.all(
      dirState.map((currFile) =>
        openFileRecursive(currFile, folderPath, async (folderToUpdate) => {
          const newChildren = await fs.readDir(folderToUpdate.path);
          const updatedFile = {
            ...folderToUpdate,
            children: !folderToUpdate.open ? newChildren : [],
            open: !folderToUpdate.open,
          };
          return updatedFile;
        })
      )
    );
    setDirState(newState);
  };

  return [dirState, { getFile, toggleFolderOpen }] as const;
};

export const isFolder = (file?: fs.FileEntry) => !!file?.children;

export default useDirectoryState;
