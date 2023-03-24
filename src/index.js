import React, { StrictMode } from "react";
import ReactDOM from "react-dom"

import { createRoot } from "react-dom/client";
import {
  createHashRouter,
  RouterProvider
} from "react-router-dom";

import Root from "./routes/root";

//import "./SwapMode.css";

import "./index.css";

import SwapMode from "./Swap Mode";
import MoveMode from "./Move Mode";
import MoveModeHex from "./Move Mode Hex";

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
 children:[
  {
    path: "SwapMode",
    element: <SwapMode/>,
  },
  {
    path: "MoveMode",
    element: <MoveMode/>,
  },
  {
    path: "MoveModeHex",
    element: <MoveModeHex/>,
  },]
},
]);

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);