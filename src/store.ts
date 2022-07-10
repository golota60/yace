import create from "zustand";
import { EnhancedFileEntry } from "./utils/useDirectoryState";

export interface OpenedFile {
  contents: string;
  path: string;
}

interface Store {
  openedFile?: OpenedFile | undefined;
  openFile: (openedFile: OpenedFile) => void;
  workingDirPath?: string | undefined;
  setWorkingDirPath: (workingDirPath: string) => void;
  workingDirFiles?: EnhancedFileEntry[] | undefined;
  setWorkingDirFiles: (workingDirFiles: EnhancedFileEntry[]) => void;
}

export const useStore = create<Store>()((set) => ({
  openedFile: undefined,
  openFile: (openedFile: OpenedFile) => set(() => ({ openedFile })),
  workingDirPath: undefined,
  setWorkingDirPath: (workingDirPath: string) =>
    set(() => ({ workingDirPath })),
  workingDirFiles: undefined,
  setWorkingDirFiles: (workingDirFiles: EnhancedFileEntry[]) =>
    set(() => ({ workingDirFiles })),
}));
