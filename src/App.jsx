import { useState } from "react";

function App() {
  const [mod, setMod] = useState("border-black");
  const [linemod, setLinemod] = useState("bg-black");

  return (
    <>
      <div className=" flex flex-col justify-center items-center m-10">
        <div className="flex flec-row m-10 gap-5 items-center ">
          <div className={`w-32 h-32 rounded-full border-8 ${mod}`}></div>

          <div className={`w-32 h-32 rounded-full border-8 ${mod}`}></div>
          <div className={`w-28 h-28 rounded-full border-8 ${mod}`}></div>
        </div>

        <div className={`w-96 h-3 ${linemod} rounded`}></div>
      </div>
      <div className=" flex flex-row justify-center gap-5">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          onClick={() => {
            setLinemod("bg-red-500");
            setMod("border-red-500");
          }}
        >
          Mod 1
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          onClick={() => {
            setLinemod("bg-sky-500");
            setMod("border-sky-500");
          }}
        >
          Mod 2
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          onClick={() => {
            setLinemod("bg-green-500");
            setMod("border-green-500");
          }}
        >
          Mod 3
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          onClick={() => {
            setLinemod("bg-orange-500");
            setMod("border-orange-500");
          }}
        >
          Mod 4
        </button>
      </div>
    </>
  );
}

export default App;
