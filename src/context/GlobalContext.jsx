import axios from "axios";
import { hex } from "chroma-js";
import { createContext, useEffect, useState } from "react";
import { string } from "three/examples/jsm/nodes/Nodes.js";

const GlobalContext = createContext();

const GlobalContextProvider = ({ children }) => {
  const [selectedEffect, setSelectedEffect] = useState(0);
  const configs = [
    ///todo : save theme in localstorage!

    {
      title: "arkin1",
      gCurrentPatternNumber: [12, 12, 12, 12, 12, 12, 12, 12],
      colors1: [0, 0, 0, 0, 180, 180, 180, 180],
      sats1: [255, 255, 255, 255, 255, 255, 255, 255],
      lights1: [255, 255, 255, 255, 255, 255, 255, 255],

      colors2: [0, 0, 0, 240, 240, 240, 0, 0],
      sats2: [255, 255, 255, 255, 255, 255, 255, 255],
      lights2: [255, 255, 255, 255, 255, 255, 255, 255],

      colors3: [0, 0, 0, 0, 0, 0, 0, 0],
      useGhue: [false, false, false, false, false, false, false, false],
    },
    {
      title: "police1",
      gCurrentPatternNumber: [3, 3, 3, 3, 3, 3, 3, 3],
      colors1: [0, 0, 0, 0, 180, 180, 180, 180],
      sats1: [255, 255, 255, 255, 255, 255, 255, 255],
      lights1: [255, 255, 255, 255, 255, 255, 255, 255],

      colors2: [0, 0, 0, 240, 240, 240, 0, 0],
      sats2: [255, 255, 255, 255, 255, 255, 255, 255],
      lights2: [255, 255, 255, 255, 255, 255, 255, 255],

      colors3: [0, 0, 0, 0, 0, 0, 0, 0],
      useGhue: [false, false, false, false, false, false, false, false],
    },
    {
      title: "Police2",
      gCurrentPatternNumber: [3, 3, 3, 3, 3, 3, 3, 3],
      colors1: [0, 0, 160, 0, 160, 160, 0, 160],
      sats1: [255, 255, 255, 255, 255, 255, 255, 255],
      lights1: [255, 255, 255, 255, 255, 255, 255, 255],

      colors2: [240, 240, 240, 240, 240, 240, 240, 240],
      sats2: [255, 255, 255, 255, 255, 255, 255, 255],
      lights2: [255, 255, 255, 255, 255, 255, 255, 255],

      colors3: [0, 0, 0, 0, 0, 0, 0, 0],
      useGhue: [false, false, false, false, false, false, false, false],
    },
    {
      title: "Police3",
      gCurrentPatternNumber: [12, 12, 12, 12, 12, 12, 12, 12],
      colors1: [0, 0, 0, 0, 160, 160, 160, 160],
      sats1: [255, 255, 255, 255, 255, 255, 255, 255],
      lights1: [255, 255, 255, 255, 255, 255, 255, 255],

      colors2: [160, 160, 160, 160, 0, 0, 0, 0],
      sats2: [255, 255, 255, 255, 255, 255, 255, 255],
      lights2: [255, 255, 255, 255, 255, 255, 255, 255],

      colors3: [160, 160, 160, 160, 1, 1, 1, 1],
      useGhue: [false, false, false, false, false, false, false, false],
    },
    {
      title: "police loop",
      gCurrentPatternNumber: [13, 13, 13, 13, 13, 13, 13, 13],
      colors1: [0, 0, 0, 240, 240, 240, 0, 240],
      sats1: [255, 255, 255, 255, 255, 255, 255, 255],
      lights1: [255, 255, 255, 255, 255, 255, 255, 255],

      colors2: [0, 0, 0, 240, 240, 240, 0, 0],
      sats2: [255, 255, 255, 255, 255, 255, 255, 255],
      lights2: [255, 255, 255, 255, 255, 255, 255, 255],

      colors3: [0, 0, 0, 0, 0, 0, 0, 0],
      useGhue: [false, false, false, false, false, false, false, false],
    },
    {
      title: "police loop2",
      gCurrentPatternNumber: [13, 13, 13, 13, 13, 13, 13, 13],
      colors1: [0, 0, 0, 180, 180, 180, 0, 180],
      sats1: [255, 255, 255, 255, 255, 255, 255, 255],
      lights1: [255, 255, 255, 255, 255, 255, 255, 255],

      colors2: [0, 0, 0, 240, 240, 240, 0, 0],
      sats2: [255, 255, 255, 255, 255, 255, 255, 255],
      lights2: [255, 255, 255, 255, 255, 255, 255, 255],

      colors3: [0, 0, 0, 0, 0, 0, 0, 0],
      useGhue: [false, false, false, false, false, false, false, false],
    },
    {
      title: "fix color loop3",
      gCurrentPatternNumber: [15, 15, 15, 15, 15, 15, 15, 15],
      colors1: [0, 0, 0, 240, 240, 240, 0, 240],
      sats1: [255, 255, 255, 255, 255, 255, 255, 255],
      lights1: [255, 255, 255, 255, 255, 255, 255, 255],

      colors2: [0, 0, 0, 240, 240, 240, 0, 0],
      sats2: [255, 255, 255, 255, 255, 255, 255, 255],
      lights2: [255, 255, 255, 255, 255, 255, 255, 255],

      colors3: [0, 0, 0, 0, 0, 0, 0, 0],
      useGhue: [false, false, false, false, false, false, false, false],
    },
    {
      title: "firstdownload",
      gCurrentPatternNumber: [15, 16, 17, 16, 15, 16, 17, 16],
      colors1: [0, 0, 0, 240, 240, 240, 0, 240],
      sats1: [255, 255, 255, 255, 255, 255, 255, 255],
      lights1: [255, 255, 255, 255, 255, 255, 255, 255],

      colors2: [0, 0, 0, 240, 240, 240, 0, 0],
      sats2: [255, 255, 255, 255, 255, 255, 255, 255],
      lights2: [255, 255, 255, 255, 255, 255, 255, 255],

      colors3: [0, 0, 0, 0, 0, 0, 0, 0],
      useGhue: [false, false, false, false, false, false, false, false],
    },
    {
      title: "firstdownload gliter",
      gCurrentPatternNumber: [1, 1, 1, 1, 1, 1, 1, 1],
      colors1: [0, 0, 0, 240, 240, 240, 0, 240],
      sats1: [255, 255, 255, 255, 255, 255, 255, 255],
      lights1: [255, 255, 255, 255, 255, 255, 255, 255],

      colors2: [0, 0, 0, 240, 240, 240, 0, 0],
      sats2: [255, 255, 255, 255, 255, 255, 255, 255],
      lights2: [255, 255, 255, 255, 255, 255, 255, 255],

      colors3: [160, 160, 160, 160, 160, 160, 160, 160],
      useGhue: [true, true, true, true, true, true, true, true],
    },
    {
      title: "fix continus ",
      gCurrentPatternNumber: [1, 1, 1, 1, 1, 1, 1, 1],
      colors1: [0, 0, 0, 240, 240, 240, 0, 240],
      sats1: [255, 255, 255, 255, 255, 255, 255, 255],
      lights1: [255, 255, 255, 255, 255, 255, 255, 255],

      colors2: [0, 0, 0, 240, 240, 240, 0, 0],
      sats2: [255, 255, 255, 255, 255, 255, 255, 255],
      lights2: [255, 255, 255, 255, 255, 255, 255, 255],

      colors3: [160, 160, 160, 160, 160, 160, 160, 160],
      useGhue: [true, true, true, true, true, true, true, true],
    },
    {
      title: "loop rain",
      gCurrentPatternNumber: [18, 18, 18, 18, 18, 18, 18, 18],
      colors1: [0, 0, 0, 240, 240, 240, 0, 240],
      sats1: [255, 255, 255, 255, 255, 255, 255, 255],
      lights1: [255, 255, 255, 255, 255, 255, 255, 255],

      colors2: [0, 0, 0, 240, 240, 240, 0, 0],
      sats2: [255, 255, 255, 255, 255, 255, 255, 255],
      lights2: [255, 255, 255, 255, 255, 255, 255, 255],

      colors3: [160, 160, 160, 160, 160, 160, 160, 160],
      useGhue: [true, true, true, true, true, true, true, true],
    },
    {
      title: "zeus",
      gCurrentPatternNumber: [13, 13, 13, 13, 13, 13, 13, 13],
      colors1: [240, 240, 240, 240, 240, 240, 240, 240],
      sats1: [255, 255, 255, 255, 255, 255, 255, 255],
      lights1: [150, 150, 150, 150, 150, 150, 150, 150],

      colors2: [0, 0, 0, 240, 240, 240, 0, 0],
      sats2: [0, 0, 0, 0, 0, 0, 0, 0],
      lights2: [0, 0, 0, 0, 0, 0, 0, 0],

      colors3: [0, 0, 0, 0, 0, 0, 0, 0],
      useGhue: [false, false, false, false, false, false, false, false],
    },
    {
      title: "2by3",
      gCurrentPatternNumber: [12, 12, 12, 12, 12, 14, 14, 14],
      colors1: [0, 70, 160, 240, 140, 140, 140, 140],
      sats1: [255, 255, 255, 255, 255, 255, 255, 255],
      lights1: [255, 255, 255, 255, 255, 255, 255, 255],

      colors2: [0, 0, 0, 240, 240, 240, 0, 0],
      sats2: [255, 255, 255, 255, 255, 255, 255, 255],
      lights2: [255, 255, 255, 255, 255, 255, 255, 255],

      colors3: [0, 0, 0, 0, 0, 0, 0, 0],
      useGhue: [true, true, true, true, true, true, true, true],
    },
    {
      title: "2by2",
      gCurrentPatternNumber: [14, 14, 14, 14, 14, 14, 14, 14],
      colors1: [140, 140, 140, 140, 140, 140, 140, 140],
      sats1: [255, 255, 255, 255, 255, 255, 255, 255],
      lights1: [255, 255, 255, 255, 255, 255, 255, 255],

      colors2: [0, 0, 0, 240, 240, 240, 0, 0],
      sats2: [255, 255, 255, 255, 255, 255, 255, 255],
      lights2: [255, 255, 255, 255, 255, 255, 255, 255],

      colors3: [0, 0, 0, 0, 0, 0, 0, 0],
      useGhue: [true, true, true, true, true, true, true, true],
    },
  ];

  console.log(String.fromCharCode());
  const [sending, setSending] = useState(false);
  const getCharVal = (index) => {
    return String.fromCharCode(
      configs[selectedEffect].gCurrentPatternNumber[index] == 10
        ? 60
        : configs[selectedEffect].gCurrentPatternNumber[index] +
          configs[selectedEffect].useGhue[index]
        ? 128
        : 0,
      configs[selectedEffect].colors1[index] == 10
        ? 11
        : configs[selectedEffect].colors1[index] == 10,
      configs[selectedEffect].sats1[index] == 10
        ? 11
        : configs[selectedEffect].sats1[index],
      configs[selectedEffect].lights1[index] == 10
        ? 11
        : configs[selectedEffect].lights1[index],
      configs[selectedEffect].colors2[index] == 10
        ? 11
        : configs[selectedEffect].colors2[index],
      configs[selectedEffect].sats2[index] == 10
        ? 11
        : configs[selectedEffect].sats2[index],
      configs[selectedEffect].lights2[index] == 10
        ? 11
        : configs[selectedEffect].lights2[index],
      configs[selectedEffect].colors3[index] == 10
        ? 11
        : configs[selectedEffect].colors3[index]
    );
  };
  const getCharVal2 = (index) => {
    return String.fromCharCode(
      (configs[selectedEffect].gCurrentPatternNumber[index] == 10
        ? 60
        : configs[selectedEffect].gCurrentPatternNumber[index]) +
        (configs[selectedEffect].useGhue[index] ? 128 : 0),
      configs[selectedEffect].colors1[index] == 10
        ? 11
        : configs[selectedEffect].colors1[index],
      configs[selectedEffect].sats1[index] == 10
        ? 11
        : configs[selectedEffect].sats1[index],
      configs[selectedEffect].lights1[index] == 10
        ? 11
        : configs[selectedEffect].lights1[index],
      configs[selectedEffect].colors2[index] == 10
        ? 11
        : configs[selectedEffect].colors2[index],
      configs[selectedEffect].sats2[index] == 10
        ? 11
        : configs[selectedEffect].sats2[index],
      configs[selectedEffect].lights2[index] == 10
        ? 11
        : configs[selectedEffect].lights2[index],
      configs[selectedEffect].colors3[index] == 10
        ? 11
        : configs[selectedEffect].colors3[index]
    );
  };
  function formatNumbers(numbers) {
    return numbers.map((num) => num.toString().padStart(3, "0")).join("");
  }
  const getCharVal3 = (index) => {
    return (
      (configs[selectedEffect].useGhue[index] ? "1" : "0") +
      formatNumbers([
        configs[selectedEffect].gCurrentPatternNumber[index],
        configs[selectedEffect].colors1[index],
        configs[selectedEffect].sats1[index],
        configs[selectedEffect].lights1[index],
        configs[selectedEffect].colors2[index],
        configs[selectedEffect].sats2[index],
        configs[selectedEffect].lights2[index],
        configs[selectedEffect].colors3[index],
      ])
    );
  };

  const sendToEsp = async () => {
    setSending(true);
    console.log("sending......", selectedEffect);
    //ptrn:2 col1:3 sat1:3 light1:3 col2:3 sat2:3 light:3 col3:3 gh:1 :24 or : 8byte! (pat + 128)
    let newConfig = "";
    for (let i = 0; i < 8; i++) {
      newConfig += getCharVal3(i);
    }
    console.log(newConfig.length, newConfig);
    axios({
      method: "post",
      url: "http://192.168.4.1/data",
      data: {
        check: newConfig.length,
        data: newConfig,
        // data: `l${index}p${
        //   configs[selectedEffect].gCurrentPatternNumber[index]
        // }c${configs[selectedEffect].colors1[index]}g${
        //   configs[selectedEffect].useGhue[index] ? 1 : 2
        // }`,
      },
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setSending(false);
      });
    // fetch("http://192.168.4.1/data", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    //   body: "data=helloo", // Your form data as a URL-encoded string
    // })
    //   .then((response) => response.json())
    //   .then((data) => console.log(data))
    //   .catch((error) => console.error("Error:", error));
  };
  useEffect(() => {
    sendToEsp();
  }, [selectedEffect]);

  const saveConfigs = (thisConfig) => {};
  const loadConfigs = () => {};
  useEffect(() => {
    loadConfigs();
  }, []);
  return (
    <GlobalContext.Provider
      value={{
        selectedEffect,
        setSelectedEffect,
        configs,
        saveConfigs,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalContextProvider };
