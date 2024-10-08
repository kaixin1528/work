import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import * as Sentry from "@sentry/browser";
import "reactflow/dist/style.css";
import { env } from 'src/env'

Sentry.init({
  dsn: env.REACT_APP_DSN,
});


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Router>
    <App />
  </Router>
);

reportWebVitals();
