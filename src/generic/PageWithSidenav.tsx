import { css } from "@emotion/css";
import clsx from "clsx";
import React from "react";
import { Outlet } from "react-router-dom";
import Sidenav from "../components/Sidenav";
import Layout from "./Layout";

const PageWithSidenav = () => {
  return (
    <Layout.Grid
      className={clsx(
        "h-screen",
        css`
          grid-template-columns: 15rem auto;
        `
      )}
    >
      <Sidenav />
      <Outlet />
    </Layout.Grid>
  );
};

export default PageWithSidenav;
