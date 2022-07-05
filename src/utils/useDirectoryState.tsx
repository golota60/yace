import { fs } from "@tauri-apps/api";
import { useEffect, useState } from "react";

const findFileRecursive = (
  currFolder: EnhancedFileEntry,
  folderPath: string
): boolean => {
  // If this is the file, return it
  if (currFolder.path === folderPath) {
    console.log("findFileRecursive", currFolder.path, folderPath);
    return true;
  }

  // If current folder doesn't have children return false, as it is imposible that this is the one
  if (!currFolder.children || currFolder.children.length === 0) return false;

  // is this even needed?? this should never file i think
  const folder = currFolder.children?.find((childFileEntry) =>
    findFileRecursive(childFileEntry, folderPath)
  );
  if (folder) return true;
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

  const getFile = (folderPath: string) => {
    const folder = dirState.find((elem) => findFileRecursive(elem, folderPath));
    console.log({ foundFolder: folder });
    if (!folder) {
      console.error(`Didn't find a folder with path: ${folderPath}`);
      return;
    }
    return folder;
  };

  const setFolderState = (
    folderPath: string,
    newFolderState: EnhancedFileEntry
  ) => {
    const replaced = dirState.map((dir) => {
      if (dir.path === folderPath) {
        return newFolderState;
      }
      return dir;
    });
    setDirState(replaced);
  };

  const toggleFolderOpen = async (folderPath: string) => {
    const folder = getFile(folderPath);
    if (!folder) {
      console.error(
        `Cannot open a folder; Didn't find a folder with path: ${folderPath}`
      );
      return;
    }
    const nextOpenState = !folder.open;
    console.log("toggling folder", { folderPath, folder, nextOpenState });
    // when you open a directory, fill it's children
    // should children be removed when closing? open ended question - currently yes cause i don't wanna think about it
    const filesInDirRaw = nextOpenState ? await fs.readDir(folder.path) : [];
    setFolderState(folderPath, {
      ...folder,
      children: filesInDirRaw,
      open: nextOpenState,
    });
  };

  return [dirState, { getFile, toggleFolderOpen, setFolderState }] as const;
};

export default useDirectoryState;
