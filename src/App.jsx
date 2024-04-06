import { useState } from "react";
import ColorPicker from "@radial-color-picker/react-color-picker";
import "@radial-color-picker/react-color-picker/dist/style.css";
function App() {
  const [mod, setMod] = useState("");
  const [linemod, setLinemod] = useState("bg-black");
  const [light, setLight] = useState(1);
  const [color, setColor] = useState({
    hue: 90,
    saturation: 100,
    luminosity: 50,
    alpha: 1,
  });

  function hslToHex(h, s, l) {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0"); // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  const onInput = (hue) => {
    setColor((prev) => ({ ...prev, hue }));

    setMod("border-[" + hslToHex(hue, 50, 50) + "]");

    console.log("border-[" + hslToHex(hue, 50, 50) + "]");
  };

  return (
    <>
      <div className=" flex flex-col justify-center items-center m-10">
        <div className="flex flec-row m-10 gap-5 items-center ">
          <button
            className={`w-32 h-32 rounded-full border-8  ${light == 1 && mod}`}
            onClick={() => {
              setLight(1);
              console.log(mod);
            }}
          ></button>

          <button
            className={`w-32 h-32 rounded-full border-8 ${light == 2 && mod}`}
            onClick={() => {
              setLight(2);
              console.log(mod);
            }}
          ></button>
          <button
            className={`w-28 h-28 rounded-full border-8  ${light == 3 && mod}`}
            onClick={() => {
              setLight(3);
              console.log(
                "w-28 h-28 rounded-full border-8" + light == 3 && mod
              );
            }}
          ></button>
        </div>

        <div className={`w-96 h-3 ${linemod} rounded`}></div>
      </div>
      <div className=" flex flex-row justify-center gap-5">
        <ColorPicker {...color} onChange={onInput} />
      </div>
      {/* <div className=" flex flex-row justify-center gap-5">
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
      </div> */}
    </>
  );
}

export default App;
