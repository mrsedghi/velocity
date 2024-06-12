import { createRoot } from "react-dom/client";
import { Suspense } from "react";
import App from "./App.jsx";
import "./index.css";
import { Loader } from "@react-three/drei";
import { GlobalContextProvider } from "./context/GlobalContext.jsx";

createRoot(document.getElementById("root")).render(
  <>
    <GlobalContextProvider>
      <Suspense fallback={null}>
        <App />
      </Suspense>
      <Loader />
    </GlobalContextProvider>
  </>
);
