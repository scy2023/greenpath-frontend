import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="1052118998338-v6elk8tkl4cqpkqnc071gj8veseceq0e.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);