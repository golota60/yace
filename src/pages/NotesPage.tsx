import { javascript } from "@codemirror/lang-javascript";
import { fs } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/dialog";
import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import clsx from "clsx";
import Button from "../generic/Button";
import { useStore } from "../store";
import { handleEditorKeyDown } from "../utils/editorEvents";

const NotesPage = () => {
  const workingDirPath = useStore((store) => store.workingDirPath);
  // const workingDirFiles = useStore((store) => store.workingDirFiles);
  const setWorkingDirPath = useStore((store) => store.setWorkingDirPath);
  const setWorkingDirFiles = useStore((store) => store.setWorkingDirFiles);

  const openedFile = useStore((store) => store.openedFile);
  const [currChanges, setCurrChanges] = useState(openedFile?.contents);

  const handleOpenDir = async () => {
    const filePath = (await open({ directory: true })) as string;
    const filesInDirRaw = await fs.readDir(filePath);
    setWorkingDirPath(filePath);
    setWorkingDirFiles(filesInDirRaw);
  };

  useEffect(() => {
    setCurrChanges(openedFile?.contents);
  }, [openedFile?.contents]);

  return (
    <div className="flex flex-col justify-center items-center">
      {workingDirPath ? (
        openedFile ? (
          <CodeMirror
            className={clsx("w-full h-screen overflow-y-auto")}
            value={openedFile?.contents}
            onChange={(newVal) => setCurrChanges(newVal)}
            extensions={[
              javascript({ jsx: true, typescript: true }),
              EditorView.lineWrapping,
            ]}
            onKeyDown={(e) =>
              handleEditorKeyDown(e, openedFile.path, currChanges)
            }
            theme="dark"
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
