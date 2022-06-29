import { fs } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/dialog";
import { BaseDirectory, readDir } from "@tauri-apps/api/fs";
import React from "react";
import { useQuery, useQueryClient } from "react-query";
import Button from "../generic/Button";
import Layout from "../generic/Layout";
import { QueryKeys } from "../queryHooks";

const NotesPage = () => {
  const queryClient = useQueryClient();

  const openDirPath = queryClient.getQueryData(QueryKeys.CurrentDirectory);
  const openDirFiles = queryClient.getQueryData(QueryKeys.CurrentDirectory);

  const handleOpenDir = async () => {
    const filePath = (await open({ directory: true })) as string;
    const filesInDirRaw = await fs.readDir(filePath);
    queryClient.setQueryData(QueryKeys.CurrentDirectory, () => filePath);
    queryClient.setQueryData(
      QueryKeys.CurrentDirectoryFiles,
      () => filesInDirRaw
    );
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <span className="test-lg mb-2">No directory currently open</span>
      <Button onClick={handleOpenDir}>Open directory</Button>
    </div>
  );
};

export default NotesPage;
