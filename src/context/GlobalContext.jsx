import axios from "axios";
import { createContext, useEffect, useState } from "react";

const GlobalContext = createContext();

const GlobalContextProvider = ({ children }) => {
  const [selectedEffect, setSelectedEffect] = useState(0);
  const configs = [
    ///todo : save theme in localstorage!
    {
      title: "arkin1",
      gCurrentPatternNumber: [3, 3, 3, 3, 12, 12, 12, 12],
      colors1: [0, 0, 0, 240, 240, 240, 0, 0],
      sats1: [100, 100, 100, 100, 100, 100, 100, 100],
      lights1: [50, 50, 50, 50, 50, 50, 50, 50],

      colors2: [0, 0, 0, 240, 240, 240, 0, 0],
      sats2: [100, 100, 100, 100, 100, 100, 100, 100],
      lights2: [50, 50, 50, 50, 50, 50, 50, 50],

      colors3: [-1, -1, -1, -1, -1, -1, -1, -1],
      useGhue: [false, false, false, false, false, false, false, false],
    },
    {
      title: "police1",
      gCurrentPatternNumber: [12, 12, 12, 12, 12, 12, 12, 12],
      colors1: [0, 0, 0, 240, 240, 240, 0, 240],
      sats1: [100, 100, 100, 100, 100, 100, 100, 100],
      lights1: [50, 50, 50, 50, 50, 50, 50, 50],

      colors2: [0, 0, 0, 240, 240, 240, 0, 0],
      sats2: [100, 100, 100, 100, 100, 100, 100, 100],
      lights2: [50, 50, 50, 50, 50, 50, 50, 50],

      colors3: [-1, -1, -1, -1, -1, -1, -1, -1],
      useGhue: [false, false, false, false, false, false, false, false],
    },
    {
      title: "Police2",
      gCurrentPatternNumber: [3, 3, 3, 3, 3, 3, 3, 3],
      colors1: [0, 0, 0, 240, 240, 240, 0, 240],
      sats1: [100, 100, 100, 100, 100, 100, 100, 100],
      lights1: [50, 50, 50, 50, 50, 50, 50, 50],

      colors2: [0, 0, 0, 240, 240, 240, 0, 0],
      sats2: [100, 100, 100, 100, 100, 100, 100, 100],
      lights2: [50, 50, 50, 50, 50, 50, 50, 50],

      colors3: [-1, -1, -1, -1, -1, -1, -1, -1],
      useGhue: [false, false, false, false, false, false, false, false],
    },
    {
      title: "police loop",
      gCurrentPatternNumber: [13, 13, 13, 13, 13, 13, 13, 13],
      colors1: [0, 0, 0, 240, 240, 240, 0, 240],
      sats1: [100, 100, 100, 100, 100, 100, 100, 100],
      lights1: [50, 50, 50, 50, 50, 50, 50, 50],

      colors2: [0, 0, 0, 240, 240, 240, 0, 0],
      sats2: [100, 100, 100, 100, 100, 100, 100, 100],
      lights2: [50, 50, 50, 50, 50, 50, 50, 50],

      colors3: [-1, -1, -1, -1, -1, -1, -1, -1],
      useGhue: [false, false, false, false, false, false, false, false],
    },
    {
      title: "fix color loop3",
      gCurrentPatternNumber: [15, 15, 15, 15, 15, 15, 15, 15],
      colors1: [0, 0, 0, 240, 240, 240, 0, 240],
      sats1: [100, 100, 100, 100, 100, 100, 100, 100],
      lights1: [50, 50, 50, 50, 50, 50, 50, 50],

      colors2: [0, 0, 0, 240, 240, 240, 0, 0],
      sats2: [100, 100, 100, 100, 100, 100, 100, 100],
      lights2: [50, 50, 50, 50, 50, 50, 50, 50],

      colors3: [-1, -1, -1, -1, -1, -1, -1, -1],
      useGhue: [false, false, false, false, false, false, false, false],
    },
  ];

  const [sending, setSending] = useState(false);
  const sendToEsp = async (index) => {
    setSending(true);
    console.log("sending......");
    axios({
      method: "get",
      url: "http://192.168.4.1/get?message=jkjk",
      // data: {
      //   message: "hshss",
      // },
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setSending(false);
        // if (index < 8) {
        //   sendToEsp(index + 1);
        // }
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
    console.log("skdaskldklas");
    sendToEsp(0);
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
