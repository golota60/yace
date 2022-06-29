import { lazy, useState } from "react";
import Layout from "./generic/Layout";
import Sidenav from "./components/Sidenav";
import NotesPage from "./pages/NotesPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageWithSidenav from "./generic/PageWithSidenav";
import { QueryClient, QueryClientProvider } from "react-query";
import { css } from "@emotion/css";

function App() {
  const queryClient = new QueryClient();

  return (
    <div
      className={css`
        width: 100vw;
        height: 100vh;
      `}
    >
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<PageWithSidenav />}>
              <Route path="/" element={<NotesPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
