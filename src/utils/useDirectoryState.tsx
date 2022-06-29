import { fs } from "@tauri-apps/api";
import { useEffect, useState } from "react";

const findFolderRecursive = (
  currFolder: EnhancedFileEntry,
  folderPath: string
): EnhancedFileEntry | null => {
  // search in initial child layer
  // if found return;
  // if not found, search in parent folder(how?)
  console.log(currFolder.path, folderPath);
  if (currFolder.path === folderPath) {
    return currFolder;
  }
  if (!currFolder.children || currFolder.children.length === 0) return null;
  const folder: EnhancedFileEntry | undefined = currFolder.children?.find(
    (childFileEntry) => findFolderRecursive(childFileEntry, folderPath)
  );
  if (folder) return folder;
  return null;
};

export interface EnhancedFileEntry extends fs.FileEntry {
  open?: boolean;
}

/** Hook that enhances directory state */
const useDirectoryState = (initialState?: Array<EnhancedFileEntry>) => {
  const [dirState, setDirState] = useState(initialState || []);

  useEffect(() => {
    if (initialState) setDirState(initialState);
  }, [initialState]);

  const getFolder = (folderPath: string) => {
    const folder: EnhancedFileEntry | null = dirState.reduce(
      (acc, elem) => findFolderRecursive(elem, folderPath) as any,
      null
    );
    console.log({ foundFolder: folder });
    if (!folder) {
      console.log(dirState);
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

  const toggleFolderOpen = async (folderPath?: string) => {
    if (!folderPath) {
      console.error("Cannot open a folder without a path");
      return;
    }
    const folder = getFolder(folderPath);
    if (!folder) {
      console.error(
        `Cannot open a folder; Didn't find a folder with path: ${folderPath}`
      );
      return;
    }
    const nextOpenState = !folder.open;

    const filesInDirRaw = nextOpenState ? await fs.readDir(folder.path) : [];
    setFolderState(folderPath, {
      ...folder,
      children: filesInDirRaw,
      open: nextOpenState,
    });
  };

  return [dirState, { getFolder, toggleFolderOpen, setFolderState }] as const;
};

export default useDirectoryState;
