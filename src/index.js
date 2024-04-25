import React from "react";
import ReactGA from "react-ga4";
import ReactDOM from "react-dom/client";

import "./index.css";

import App from "./App";

ReactGA.initialize("G-NCEGMJ9KLP");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
