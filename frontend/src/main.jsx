import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";
import "./styles/home.css";
import "./styles/auth.css";
import "./styles/employer.css";
import "./styles/admin.css";
import "./styles/jobseeker.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);