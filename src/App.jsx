import { useEffect } from "react";
import MainLayout from "./components/mainLayout";
import axios from "axios";

function App() {
  return (
    <div className="absolute top-0 lef-0 h-screen w-screen flex flex-row justify-center items-center bg-red-300">
      <MainLayout />
    </div>
  );
}

export default App;
