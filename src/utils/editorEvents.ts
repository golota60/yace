import { fs } from "@tauri-apps/api";
import React from "react";

// some event are handled by codemirror already e.g. copying, pasting
export const handleEditorKeyDown = (
  e: React.KeyboardEvent<HTMLDivElement>,
  filePath: string,
  contents = ""
) => {
  const isSave = e.metaKey && e.key === "s";

  // filePath is a sanity check so that i don't write to root
  if (isSave && filePath !== "/" && filePath !== "") {
    console.log("saving", { filePath, contents });
    fs.writeFile(filePath, contents);
  }
};
