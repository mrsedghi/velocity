import ParsModel from "./ParsModel";

import { useContext, useState } from "react";
import { HuePicker } from "react-color";
import { FaPowerOff } from "react-icons/fa";
import { LuLightbulbOff } from "react-icons/lu";
import { FaRegLightbulb } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { LuSaveAll } from "react-icons/lu";

import { MdDelete } from "react-icons/md";
import { GlobalContext } from "../context/GlobalContext";

function App() {
  const { configs, setSelectedEffect, selectedEffect } =
    useContext(GlobalContext);
  const [select, setSelect] = useState(selectedEffect);
  const [check, setCheck] = useState(1);
  const [power, setPower] = useState(true);
  const [isset, setIsset] = useState(false);
  const [isCustomize, setIsCustomize] = useState(false);

  const [effect, setEffect] = useState([
    { title: "police 1", color: "red" },
    { title: "police 2", color: "blue" },
    { title: "p-change", color: "pink" },
    { title: "p-glitter", color: "purple" },
    { title: "p- loop", color: "skyblue" },
    { title: "rainbow", color: "red" },
    { title: "glitter", color: "blue" },
    { title: "welcome", color: "pink" },
    { title: "signal", color: "purple" },
    { title: "2 by 2", color: "skyblue" },
  ]);
  const [ggg, setGgg] = useState("#ff2277");
  const [fff, setFff] = useState("#aabbcc");
  function handleChange(color, event) {
    // color = {
    //   hex: '#333',
    //   rgb: {
    //     r: 51,
    //     g: 51,
    //     b: 51,
    //     a: 1,
    //   },
    //   hsl: {
    //     h: 0,
    //     s: 0,
    //     l: .20,
    //     a: 1,
    //   },

    // }
    setGgg(color);
    console.log(color);
  }
  function changeHandle(color, event) {
    // color = {
    //   hex: '#333',
    //   rgb: {
    //     r: 51,
    //     g: 51,
    //     b: 51,
    //     a: 1,
    //   },
    //   hsl: {
    //     h: 0,
    //     s: 0,
    //     l: .20,
    //     a: 1,
    //   },
    // }
    setFff(color);
    console.log(color);
  }
  return (
    <div className="main w-[98%] h-[95%] absolute  rounded-3xl mt-1 flex flex-col ">
      <div className="TOP_BAR w-[90%]  flex   h-[8%] justify-between mx-auto   ">
        <p
          className="text-yellow-200 text-2xl cursor-pointer"
          onClick={() => {
            setIsset(!isset);
            setIsCustomize(false);
          }}
        >
          <IoSettingsOutline className="flex justify-center text-center items-center h-full text-[30px]" />
        </p>
        <h1 className="text-gray-400 justify-center items-center text-[30px] text-center h-full">
          velocity
        </h1>
        <div className="flex justify-center text-center items-center">
          <img
            src="../../public/logo.png"
            alt=""
            className="w-[40px] h-[40px]  "
          />
        </div>
      </div>

      {!isset && (
        <div className="EFFECT_BAR     carousel carousel-center h-[15%]  w-[90%] mx-auto space-x-4 ">
          {effect.map((item, index) => (
            <div
              key={"effectBar" + index}
              className="flex flex-col justify-start items-center w-[80%]   "
              onClick={() => {
                setCheck(index);
                setSelectedEffect(index);
              }}
            >
              <div
                className={`w-[50px] h-[50px] rounded-full  border-4 ${
                  check === index ? "shadow-gray-300 shadow-md" : ""
                }`}
                style={{
                  border: `3px solid ${item.color} `,
                }}
              >
                <div className="flex text-center justify-center pt-4 text-3xl text-gray-200">
                  {check == index ? "" : " "}
                </div>
              </div>

              <p className=" font-serif  text-center text-sm mt-1 text-slate-400">
                {item.title}
                {index}
              </p>
            </div>
          ))}
        </div>
      )}

      {isset && (
        <div className="EFFECT_BAR     carousel carousel-center h-[15%]  w-[90%] mx-auto space-x-4 ">
          {isCustomize &&
            effect.map((item, index) => (
              <div
                key={"customize" + index}
                className="flex flex-col justify-start items-center max-w-52 w-full   "
                onClick={() => {
                  setCheck(index);
                }}
              >
                <div
                  className={`w-[60px] h-[60px] rounded-full  border-4 ${
                    check === index ? "shadow-gray-300 shadow-md" : ""
                  }`}
                  style={{
                    border: `3px solid ${item.color} `,
                  }}
                >
                  <div className="flex text-center justify-center pt-4 text-3xl text-gray-200">
                    {check == index ? "" : " "}
                  </div>
                </div>

                <p className=" font-serif  text-center text-sm mt-1 text-slate-400  text-clip">
                  {item.title.length < 7
                    ? item.title
                    : item.title.substring(0, 7) + "..."}
                </p>
              </div>
            ))}
        </div>
      )}

      <div className={`PARS_BAR h-[60%]  flex`}>
        <ParsModel />
      </div>

      {isset ? (
        <div className=" COLOR_PICKER flex-col flex gap-2 bg-red-400/0  w-[90%] mx-auto h-[10%]  justify-between ">
          <>
            <div className="flex absolute bottom-[150px] gap-3 justify-between text-center items-center text-[20px]   mx-auto w-[80%]">
              <div className="flex gap-3">
                <p className="flex justify-center text-center items-center text-white gap-2 cursor-pointer">
                  save{" "}
                  <LuSaveAll
                    className=""
                    onClick={() =>
                      document.getElementById("ostadostad").showModal()
                    }
                  />
                </p>
                <p className="flex justify-center text-center items-center text-white gap-2  cursor-pointer">
                  delete <MdDelete />
                </p>
              </div>

              <p className="">
                <MdOutlineEdit
                  className={`text-2xl flex justify-center items-center text-center text-[30px]  ${
                    isset ? "cursor-pointer" : "cursor-not-allowed"
                  } h-full`}
                  onClick={() => {
                    setIsCustomize(!isCustomize);
                  }}
                />
              </p>
            </div>
            <HuePicker
              height="25px"
              width="95%"
              onChange={handleChange}
              color={ggg}
            />
            <HuePicker
              height="25px"
              width="95%"
              onChange={changeHandle}
              color={fff}
            />
          </>
        </div>
      ) : (
        ""
      )}

      <div
        className={`flex gap-2  h-[10%] items-center justify-center transition-all duration-1000 ${
          isset ? "" : "mt-10 transition-all duration-1000"
        }`}
      >
        <div
          className={`BRIGHTNESS_BAR diff aspect-[16/9] h-10 rounded-xl w-[90%] ${
            isset ? "" : "hidden "
          }`}
        >
          <div className="diff-item-1 ">
            <div className="bg-[rgba(255,255,255,0.2)] text-primary-content text-sm font-black grid place-content-center">
              <div className="flex  absolute  right-1 items-center text-center justify-center  ">
                <LuLightbulbOff className=" h-7 w-7  mx-2 text-yellow-200 " />
              </div>
            </div>
          </div>
          <div className="diff-item-2">
            <div className="bg-white/50 text-sm font-black grid place-content-center">
              <div className="flex  absolute  items-center text-center justify-center  ">
                <FaRegLightbulb className=" h-7 w-7 mx-2  text-yellow-200" />
              </div>
            </div>
          </div>
          <div className="diff-resizer"></div>
        </div>

        <FaPowerOff
          className={`${
            power ? "text-yellow-400" : "text-[silver]"
          } cursor-pointer w-[10%] h-full  transition-all duration-1000 ${
            isset ? "hidden " : ""
          }`}
          onClick={() => {
            setPower(!power);
          }}
        />
      </div>

      <dialog
        id="ostadostad"
        className="modal-box backdrop-blur-sm bg-transparent"
      >
        <div className="flex justify-center flex-col gap-3   ">
          <input
            type="text"
            placeholder="نام افکت"
            className="w-1/2
           flex text-center p-2 mx-auto h-10 rounded-3xl   "
          />

          <form method="dialog">
            <button className="btn flex justify-center mx-auto w-1/2 rounded-3xl">
              ذخیره
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default App;
