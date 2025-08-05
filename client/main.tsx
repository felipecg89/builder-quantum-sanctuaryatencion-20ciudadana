import "./global.css";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root")!;

// Check if root already exists to prevent double mounting
if (!container._reactRoot) {
  const root = createRoot(container);
  container._reactRoot = root;
  root.render(<App />);
} else {
  // If root already exists, just render the App
  container._reactRoot.render(<App />);
}
