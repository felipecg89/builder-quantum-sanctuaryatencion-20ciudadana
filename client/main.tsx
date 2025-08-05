import "./global.css";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root")!;

// Store root instance to prevent multiple createRoot calls
let root: ReturnType<typeof createRoot> | null = null;

function renderApp() {
  if (!root) {
    root = createRoot(container);
  }
  root.render(<App />);
}

// Handle hot module replacement properly
if (import.meta.hot) {
  // Clear existing content on hot reload
  import.meta.hot.dispose(() => {
    if (root) {
      // Don't unmount, just let it be replaced
    }
  });
}

renderApp();
