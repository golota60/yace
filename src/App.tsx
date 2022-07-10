import { BrowserRouter, Route, Routes } from "react-router-dom";
import { css } from "@emotion/css";
import PageWithSidenav from "./generic/PageWithSidenav";
import NotesPage from "./pages/NotesPage";

function App() {
  return (
    <div
      className={css`
        width: 100vw;
        height: 100vh;
      `}
    >
      <BrowserRouter>
        <Routes>
          <Route element={<PageWithSidenav />}>
            <Route path="/" element={<NotesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
