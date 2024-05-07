import { useEffect, useState } from "react";
import ColorPicker from "@radial-color-picker/react-color-picker";
import "@radial-color-picker/react-color-picker/dist/style.css";
import axios from "axios";
function OldVersion() {
  const [mod, setMod] = useState(["#882288", "#228888", "#882222", "#828282"]);
  const [index, setIndex] = useState(3);
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

  const sendToEsp = async () => {
    try {
      const mainUrl = "192.168.4.1";
      const response = await axios.get(
        mainUrl + "/loop=" + index,
        "&effect=1&color1=",
        color.hue,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error reading customer :", error);
    }
  };
  useEffect(() => {
    console.log(color);
    if (!color) return;
    const tl = hslToHex(color.hue, 100, 50); // colorToTailwindClass(hslToHex(hue, 100, 50));

    var thisMode = mod;
    console.log("index:", index, "mode:", thisMode, "hue:", color.hue);
    // Code to execute after index state update is complete
    const newMod = [...mod];
    newMod[index] = tl;
    setMod(newMod);

    console.log("index:", index, "mode:", thisMode);
    sendToEsp();
  }, [color.hue]);
  const onInput = (hue) => {
    setColor((prev) => ({ ...prev, hue }));
  };

  return (
    <>
      <div className="m-0 p-10 bg-black w-full h-full">
        <div className=" flex flex-col justify-center items-center m-10">
          <div className="flex flec-row m-10 gap-5 items-center ">
            <button
              className={`w-32 h-32 rounded-full border-[12px]  ${
                index == 0 && "shadow-lg shadow-blue-500 bg-blue-700/30"
              }`}
              style={{ borderColor: mod[0] }}
              onClick={() => {
                setIndex(0);
                console.log("index:", index, mod);
              }}
            ></button>

            <button
              className={`w-32 h-32 rounded-full border-[12px] ${
                index == 1 && "shadow-lg shadow-blue-500 bg-blue-700/30"
              }`}
              style={{ borderColor: mod[1] }}
              onClick={() => {
                setIndex(1);
                console.log("index:", index, mod);
              }}
            ></button>
            <button
              className={`w-28 h-28 rounded-full border-[10px] ${
                index == 2 && " shadow-lg shadow-blue-500 bg-blue-700/30"
              }`}
              style={{ borderColor: mod[2] }}
              onClick={() => {
                setIndex(2);
                console.log("index:", index, mod);
              }}
            ></button>
          </div>

          <button
            className={`w-96 h-3  rounded ${
              index == 3 &&
              " shadow-lg shadow-blue-500 border-[1px] border-blue-600"
            }`}
            style={{ backgroundColor: mod[3] }}
            onClick={() => {
              setIndex(3);
              console.log("index:", index, mod);
            }}
          ></button>
        </div>
        <div className=" flex flex-row justify-center gap-5">
          <ColorPicker {...color} onChange={onInput} />
        </div>
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

export default OldVersion;
