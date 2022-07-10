import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { css } from "@emotion/css";
import PageWithSidenav from "./generic/PageWithSidenav";
import NotesPage from "./pages/NotesPage";

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
