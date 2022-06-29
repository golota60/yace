import { fs } from "@tauri-apps/api";
import { Query, QueryKey, useQuery, UseQueryOptions } from "react-query";

type Setter<T> =
  | Omit<UseQueryOptions<T, unknown, T, QueryKey>, "queryKey">
  | undefined;

export enum QueryKeys {
  CurrentDirectory = "CurrentDirectory",
  CurrentDirectoryFiles = "CurrentDirectoryFiles",
}

const queryHooks = {
  useCurrentDirectory: (setter?: Setter<string>) =>
    useQuery<string>(QueryKeys.CurrentDirectory, setter),
  useCurrentDirectoryFiles: (setter?: Setter<Array<fs.FileEntry>>) =>
    useQuery<Array<fs.FileEntry>>(QueryKeys.CurrentDirectoryFiles, setter),
};

export const { useCurrentDirectory, useCurrentDirectoryFiles } = queryHooks;
