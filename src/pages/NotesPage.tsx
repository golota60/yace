import { fs } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/dialog";
import clsx from "clsx";
import React from "react";
import MonacoEditor from "react-monaco-editor";
import Button from "../generic/Button";
import { useStore } from "../store";

const NotesPage = () => {
  const workingDirPath = useStore((store) => store.workingDirPath);
  // const workingDirFiles = useStore((store) => store.workingDirFiles);
  const setWorkingDirPath = useStore((store) => store.setWorkingDirPath);
  const setWorkingDirFiles = useStore((store) => store.setWorkingDirFiles);

  const openedFile = useStore((store) => store.openedFile);

  const handleOpenDir = async () => {
    const filePath = (await open({ directory: true })) as string;
    const filesInDirRaw = await fs.readDir(filePath);
    setWorkingDirPath(filePath);
    setWorkingDirFiles(filesInDirRaw);
  };
  return (
    <div className="flex flex-col justify-center items-center">
      {workingDirPath ? (
        openedFile ? (
          <MonacoEditor
            value={openedFile?.contents}
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
