import { fs } from "@tauri-apps/api";
import { QueryKey, useQuery, UseQueryOptions } from "react-query";

type Setter<T> =
  | Omit<UseQueryOptions<T, unknown, T, QueryKey>, "queryKey">
  | undefined;

export enum QueryKeys {
  CurrentDirectory = "CurrentDirectory",
  CurrentDirectoryFiles = "CurrentDirectoryFiles",
  OpenFile = "OpenFile",
}

export interface OpenedFile {
  contents: string;
  path: string;
}

const queryHooks = {
  useCurrentDirectory: (setter?: Setter<string>) =>
    useQuery<string>(QueryKeys.CurrentDirectory, setter),
  useCurrentDirectoryFiles: (setter?: Setter<Array<fs.FileEntry>>) =>
    useQuery<Array<fs.FileEntry>>(QueryKeys.CurrentDirectoryFiles, setter),
  useOpenedFile: (setter?: Setter<OpenedFile>) =>
    useQuery<OpenedFile>(QueryKeys.OpenFile, setter),
};

export const { useCurrentDirectory, useCurrentDirectoryFiles, useOpenedFile } =
  queryHooks;
