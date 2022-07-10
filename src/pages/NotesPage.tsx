import { fs } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/dialog";
import { BaseDirectory, readDir } from "@tauri-apps/api/fs";
import clsx from "clsx";
import React from "react";
import MonacoEditor from "react-monaco-editor";
import { useQuery, useQueryClient } from "react-query";
import Button from "../generic/Button";
import Layout from "../generic/Layout";
import { OpenedFile, QueryKeys, useOpenedFile } from "../queryHooks";

const NotesPage = () => {
  const queryClient = useQueryClient();

  const openDirPath = queryClient.getQueryData(QueryKeys.CurrentDirectory);
  const openDirFiles = queryClient.getQueryData(
    QueryKeys.CurrentDirectoryFiles
  );
  const openedFile = useOpenedFile();

  const handleOpenDir = async () => {
    const filePath = (await open({ directory: true })) as string;
    const filesInDirRaw = await fs.readDir(filePath);
    queryClient.setQueryData(QueryKeys.CurrentDirectory, () => filePath);
    queryClient.setQueryData(
      QueryKeys.CurrentDirectoryFiles,
      () => filesInDirRaw
    );
  };
  console.log({ openDirPath, openDirFiles, openedFile }, "asdfasdfadsf");
  return (
    <div className="flex flex-col justify-center items-center">
      {openDirPath ? (
        openedFile ? (
          <MonacoEditor
            value={openedFile.data?.contents}
            language="typescript"
            theme="vs-dark"
            className={clsx("w-full h-full")}
          />
        ) : (
          "Open a file!"
        )
      ) : (
        <>
          <span className="test-lg mb-2">No directory currently open</span>
          <Button onClick={handleOpenDir}>Open directory</Button>
        </>
      )}
    </div>
  );
};

export default NotesPage;
