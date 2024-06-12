import { useContext, useEffect, useRef, useState } from "react";
import { fill, max, range } from "lodash";
import * as THREE from "three";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from "@react-three/postprocessing";
import { GlobalContext } from "../context/GlobalContext";

const MyEffects = (props) => {
  const { selectedEffect, configs } = useContext(GlobalContext);
  const { mainLight } = props;

  const [gCurrentPatternNumber, setGcurrentPatternNumber] = useState(
    Array(8).fill(19)
  ); //[0, 2, 3, 9, 10, 6, 7, 8]; // Index number of which pattern is current
  const [gHue, setGhue] = useState(0); // rotating "base color" used by many of the patterns
  const [colors1, setcolors1] = useState(Array(8).fill(280));
  const [sats1, setsats1] = useState(Array(8).fill(100));
  const [lights1, setlights1] = useState(Array(8).fill(50));
  const [colors2, setcolors2] = useState(Array(8).fill(0));
  const [sats2, setsats2] = useState(Array(8).fill(100));
  const [lights2, setlights2] = useState(Array(8).fill(50));
  const [colors3, setcolors3] = useState(Array(8).fill(0));
  const [startPoints, setstartPoints] = useState([
    0, 11, 24, 37, 49, 60, 73, 86,
  ]);
  const [lineLength, setlineLength] = useState([1, 13, 13, 12, 11, 13, 13, 12]);
  const [useGhue, setuseGhue] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [phase, setphase] = useState(false); //
  const [loop1, setLoop1] = useState(Array(12).fill(Array(3), fill(0)));
  const [loop2, setLoop2] = useState(Array(12).fill(Array(3), fill(0)));
  const [loop3, setLoop3] = useState(Array(12).fill(Array(3), fill(0)));
  const [loop4, setLoop4] = useState(Array(12).fill(Array(3), fill(0)));
  const [loop5, setLoop5] = useState(Array(12).fill(Array(3), fill(0)));
  const [loop6, setLoop6] = useState(Array(12).fill(Array(3), fill(0)));
  const [line1, setLine1] = useState(Array(12).fill(Array(3), fill(0)));
  const [line2, setLine2] = useState(Array(12).fill(Array(3), fill(0)));

  //
  const [linePos, setLinePos] = useState([
    { x: 0, y: 0, z: -0.2, rot: (Math.PI / 360) * 1 },
    { x: -1, y: 0, z: -0.5, rot: (Math.PI / 360) * 4 },
    { x: -2, y: 0, z: -1, rot: (Math.PI / 360) * 8 },
    { x: -3, y: 0, z: -1.5, rot: (Math.PI / 360) * 12 },
    { x: -4, y: 0, z: -2.0, rot: (Math.PI / 360) * 16 },
    { x: -5, y: 0, z: -3, rot: (Math.PI / 360) * 18 },
    { x: -6, y: 0, z: -4, rot: (Math.PI / 360) * 22 },
    { x: -7, y: 0, z: -5, rot: (Math.PI / 360) * 26 },
    { x: -8, y: 0, z: -6, rot: (Math.PI / 360) * 30 },
    { x: -9, y: 0, z: -7.5, rot: (Math.PI / 360) * 34 },
    { x: -10, y: 0, z: -9, rot: (Math.PI / 360) * 38 },
    { x: -11, y: 0, z: -10.5, rot: (Math.PI / 360) * 42 },
  ]);
  //
  // const NUM_LEDS = 98;
  const [beat8, setBeat8] = useState(0);
  //
  //effects/
  useEffect(() => {
    const interval = setInterval(() => {
      setGhue((prevHue) => (prevHue + 4) % 360);
      setBeat8((prevValue) => (prevValue + 1) % 1000);
    }, 50); // Adjust interval as needed
    return () => clearInterval(interval);
  }, []);
  //
  const rainbow = (index, list, setList) => {
    const newColors = list.map((color, index) => [
      (gHue + index * 17) % 360,
      100,
      50,
    ]);
    setList(newColors);
    addGlitter(index, list, setList);
  };

  //

  // Function to add glitter effect
  const addGlitter = (index, list, setList) => {
    const chanceOfGlitter = 0.01; // Adjust glitter chance as needed
    let thisGhue3;
    if (colors3[index] >= 0) {
      thisGhue3 = colors3[index];

      const newColors = list.map((color) => {
        if (Math.random() < chanceOfGlitter) {
          return [thisGhue3, 100, 50];
        } else {
          return color;
        }
      });
      //console.log(newColors);
      // setList(newColors);
    }

    //addGlitter(index, list, setList);
  };

  // Function to generate confetti effect
  const confetti = (index, list, setList) => {
    const newColors = list.map((color, index) => {
      const [thisHue, thisSat, thisLight] = color;
      return [thisHue, thisSat, Math.max(thisLight - 5, 0)];
    });
    const pos = Math.floor(Math.random() * 12);
    newColors[pos] = randomColor();
    setList(newColors);
    addGlitter(index, list, setList);
  };

  // Function to generate sinelon effect
  const [sinPos, setSinPos] = useState(0);
  const sinelon = (index, list, setList) => {
    let thisGhue, thisGhue2, sat1, sat2;
    if (useGhue[index]) {
      thisGhue = gHue;
      thisGhue2 = (gHue + 240) % 360;
      sat1 = 100;
      sat2 = 100;
    } else {
      thisGhue = colors1[index];
      thisGhue2 = colors2[index];
      sat1 = sats1[index];
      sat2 = sats2[index];
    }

    let newList = list.map((item) => {
      return [item[0], item[1], item[2] > 4 ? item[2] - 2 : 0];
    });

    let pos = Math.round(
      Math.abs(Math.sin(((beat8 % 100) * Math.PI) / 50) * 6 + 6)
    );

    // console.log(pos);
    if (pos < 12) newList[pos] = [thisGhue, 100, 50];

    setList(newList);

    addGlitter(index, list, setList);
  };

  const partyColor = [
    [270, 100, 33],
    [303, 100, 26],
    [335, 100, 35],
    [353, 100, 45],
    [6, 100, 45],
    [23, 100, 36],
    [41, 100, 33],
    [60, 100, 33],
    [30, 100, 33],
    [9, 43, 100],
    [357, 100, 48],
    [341, 100, 38],
    [313, 100, 28],
    [275, 100, 32],
    [254, 100, 41],
    [238, 100, 49],
  ];

  const [index, bitPos, setBitPos] = useState(0);
  const bpm = (index, list, setList) => {
    const beat = Math.abs(Math.sin((bitPos * Math.PI) / 12)) * 35 + 15; // Adjust speed as needed
    setBitPos((bitPos + 1) % 12);
    const newColors = list.map((color, index) => {
      const [thisHue, thisSat, thisLight] =
        partyColor[Math.floor(index + gHue / 22.5) % 16];
      return [
        thisHue,
        thisSat,
        Math.max(
          Math.min(
            Math.floor(((beat - gHue / 7.5 + index) * thisLight) / 50),
            50
          ),
          0
        ),
        // Math.max(
        // 	Math.min(
        // 		Math.floor(((beat - hue / 22.5 + index * 0.5) * thisLight) / 10000),
        // 		50
        // 	),
        // 	0
        // ),
      ];
    });
    setList(newColors);

    addGlitter(index, list, setList);
  };

  //const [index, jugglePos, setJugglePos] = useState(0);
  const juggle = (index, list, setList) => {
    const newColors = list.map((color) => {
      const [thisHue, thisSat, thisLight] = color;
      return [thisHue, thisSat, Math.max(thisLight - 5, 0)];
    });
    let dotHue = 0;
    setJugglePos((jugglePos + 1) % 12);
    for (let i = 0; i < 8; i++) {
      const pos = Math.floor(
        Math.abs(Math.sin((((jugglePos * Math.PI) / 12) * (i + 1)) / 3)) *
          (12 - 1)
      );

      const [prevHue, preSat, prevL] = newColors[pos];
      newColors[pos] = [prevHue + dotHue, preSat + 100, 50];
      dotHue += 32;
    }
    for (let i = 0; i < 12; i++) {
      const [prevH, prevSat, prevL] = newColors[i];
      const factor = prevSat / 50;
      newColors[i] = [prevH / factor, prevSat / factor, prevL];
    }
    setList(newColors);

    addGlitter(index, list, setList);
  };

  const randomColor = () => [Math.floor(Math.random() * 360), 100, 50]; //`hsl(${Math.floor(Math.random() * 360).toString(10)},100,50)`;

  /////
  const gradient2color2 = (index, list, setList) => {
    let thisGhue;
    let thisGhue2;
    if (useGhue[index]) {
      thisGhue = gHue;
      thisGhue2 = (gHue + 240) % 360;
    } else {
      thisGhue = colors1[index];
      thisGhue2 = colors2[index];
    }
    // Calculate the step size for hue (adjust for smoother transitions if needed)
    const sat_step = 18;
    const newList = Array(12).fill([0, 0, 0]);
    for (let i = 0; i < 6; i++) {
      const sat = 100 - i * sat_step;
      newList[i] = [thisGhue, sat, 50 - (2 * i * sat_step) / 5];
      newList[11 - i] = [thisGhue2, sat, 50 - (2 * i * sat_step) / 5];
    }
    setList(newList);

    addGlitter(index, list, setList);
  };

  const rotate3point = (index, list, setList) => {
    let thisGhue, thisGhue2, thisGhue3;
    if (useGhue[index]) {
      thisGhue = gHue;
      thisGhue2 = (gHue + 240) % 360;
    } else {
      thisGhue = colors1[index];
      thisGhue2 = colors2[index];
    }
    const pos = Math.floor((beat8 % 48) / 4);
    let newList = [];
    for (let i = 0; i < 12; i++) {
      const index = (i + pos) % 4;
      newList.push([index < 2 ? thisGhue : thisGhue2, 100, 50]);
    }
    setList(newList);

    addGlitter(index, list, setList);
  };

  const rainbow3point = (index, list, setList) => {
    let thisGhue, thisGhue2, thisGhue3;
    if (useGhue[index]) {
      thisGhue = gHue;
      thisGhue2 = (gHue + 240) % 360;
    } else {
      thisGhue = colors1[index];
      thisGhue2 = colors2[index];
    }
    //fadeToBlackBy( leds + startPoint, cnt, 85);
    let newList = Array(12).fill([0, 0, 0]);

    let pos = Math.floor(beat8 / 3);
    for (let i = 0; i < 16; i = i + 4) {
      let col = (((pos + i) / 4) * 45) % 360;
      let index = i + 3 - (pos % 4);
      if (index < 12) newList[index] = [col, 100, 50];
      if (index > 0 && index < 13) newList[index - 1] = [col, 100, 50];
    }
    setList(newList);

    addGlitter(index, list, setList);
  };

  const solid = (index, list, setList) => {
    let thisGhue, thisGhue2, thisGhue3;
    if (useGhue[index]) {
      thisGhue = gHue;
      thisGhue2 = (gHue + 240) % 360;
    } else {
      thisGhue = colors1[index];
      thisGhue2 = colors2[index];
    }
    const newList = Array(12).fill([thisGhue, 100, 50]);
    setList(newList);

    addGlitter(index, list, setList);
  };

  const beatcoin = (index, list, setList) => {
    let thisGhue, thisGhue2, thisGhue3;
    if (useGhue[index]) {
      thisGhue = gHue;
      thisGhue2 = (gHue + 240) % 360;
    } else {
      thisGhue = colors1[index];
      thisGhue2 = colors2[index];
    }
    // a colored dot sweeping back and forth, with fading trails
    let newList = list.map((item) => {
      //return [item[0], item[1], item[2] > 5 ? item[2] - 4 : 0];
      return [item[0], item[1], item[2] > 3 ? item[2] - 2 : 0];
    });

    let pos = Math.floor(((beat8 % 50) * 12) / 50); //map(pos,0,255,0,cnt-1);
    newList[pos] = [thisGhue, 100, 60]; /// newList[pos][0]+thisGhue
    setList(newList);

    addGlitter(index, list, setList);
  };

  const loop2Point = (index, list, setList) => {
    let thisGhue, thisGhue2, sat1, sat2;
    if (useGhue[index]) {
      thisGhue = gHue;
      thisGhue2 = (gHue + 240) % 360;
      sat1 = 100;
      sat2 = 100;
    } else {
      thisGhue = colors1[index];
      thisGhue2 = colors2[index];
      sat1 = sats1[index];
      sat2 = sats2[index];
    }

    const newList = Array(12).fill([thisGhue2, sat2, 50]);

    let pos = Math.floor(beat8 / 3);
    for (let i = 0; i < 16; i = i + 4) {
      const index = i + 3 - (pos % 4);
      if (index < 12) newList[index] = [thisGhue, sat1, 50];
      if (index > 0 && index < 13) newList[index - 1] = [thisGhue, sat1, 50];
    }
    setList(newList);

    addGlitter(index, list, setList);
  };

  const loop2Point22 = (index, list, setList) => {
    let thisGhue, thisGhue2, sat1, sat2;
    if (useGhue[index]) {
      thisGhue = gHue;
      thisGhue2 = (gHue + 240) % 360;
      sat1 = 50;
      sat2 = 50;
    } else {
      thisGhue = colors1[index];
      thisGhue2 = colors2[index];
      sat1 = sats1[index];
      sat2 = sats2[index];
    }
    let newList = Array(12).fill([thisGhue2, sat2, 50]);

    const pos = Math.floor(beat8 / 3);
    for (let i = 0; i < 16; i = i + 4) {
      const index = i + 3 - (pos % 4);
      if (index < 12) newList[index] = [thisGhue, sat1, 50];
      if (index > 0 && index < 13) newList[index - 1] = [thisGhue, sat1, 50];
    }
    setList(newList);
    addGlitter(index, list, setList);
  };
  const loop1Point = (index, list, setList) => {
    let thisGhue, thisGhue2, sat1, sat2, light1, light2;
    if (useGhue[index]) {
      thisGhue = gHue;
      thisGhue2 = (gHue + 240) % 360;
      sat1 = 100;
      sat2 = 100;
      light1 = 50;
      light2 = 50;
    } else {
      thisGhue = colors1[index];
      thisGhue2 = colors2[index];
      sat1 = sats1[index];
      sat2 = sats2[index];
      light1 = lights1[index];
      light2 = lights2[index];
    }

    let newList = Array(12).fill([thisGhue2, sat2, light2]);

    const pos = Math.floor(beat8 / 3);
    for (let i = 0; i < 16; i = i + 4) {
      const index = i + (pos % 4);
      if (index < 12) newList[index] = [thisGhue, sat1, light1];
    }
    setList(newList);
    addGlitter(index, list, setList);
  };

  const loop1Point3 = (index, list, setList) => {
    let thisGhue, thisGhue2, sat1, sat2;
    if (useGhue[index]) {
      thisGhue = gHue;
      thisGhue2 = (gHue + 240) % 360;
      sat1 = 100;
      sat2 = 100;
    } else {
      thisGhue = colors1[index];
      thisGhue2 = colors2[index];
      sat1 = sats1[index];
      sat2 = sats2[index];
    }

    let newList = Array(12).fill([thisGhue2, 0, 0]);

    let pos = Math.floor(beat8 / 3);
    for (let i = 0; i < 15; i = i + 3) {
      const col = ((pos + i) * 60) % 360;
      const index = i + (pos % 3);
      if (index < 12) newList[index] = [col, sat1, 50];
    }
    setList(newList);
    addGlitter(index, list, setList);
  };

  const loop1Point2 = (index, list, setList) => {
    let thisGhue, thisGhue2, sat1, sat2;
    if (useGhue[index]) {
      thisGhue = gHue;
      thisGhue2 = (gHue + 160) % 360;
      sat1 = 100;
      sat2 = 100;
    } else {
      thisGhue = colors1[index];
      thisGhue2 = colors2[index];
      sat1 = sats1[index];
      sat2 = sats2[index];
    }

    let pos = Math.floor(beat8 / 3);
    let newList = [];
    if (pos % 4 == 0) newList = Array(12).fill([thisGhue, sat1, 50]);
    else newList = Array(12).fill([thisGhue2, sat2, 0]);

    setList(newList);
    addGlitter(index, list, setList);
  };

  const loop1Point2del = (index, list, setList) => {
    let thisGhue, thisGhue2, sat1, sat2;
    if (useGhue[index]) {
      thisGhue = gHue;
      thisGhue2 = (gHue + 240) % 360;
      sat1 = 100;
      sat2 = 50;
    } else {
      thisGhue = colors1[index];
      thisGhue2 = colors2[index];
      sat1 = sats1[index];
      sat2 = sats2[index];
    }

    let pos = Math.floor(beat8 / 3);
    let newList = [];
    if (pos % 4 == 1) newList = Array(12).fill([thisGhue, sat1, 50]);
    else newList = Array(12).fill([0, 0, 0]);

    setList(newList);
    addGlitter(index, list, setList);
  };

  const fillSmoth = (index, list, setList) => {
    let thisGhue, thisGhue2, sat1, sat2;
    if (useGhue[index]) {
      thisGhue = gHue;
      thisGhue2 = (gHue + 240) % 360;
      sat1 = 50;
      sat2 = 50;
    } else {
      thisGhue = colors1[index];
      thisGhue2 = colors2[index];
      sat1 = sats1[index];
      sat2 = sats2[index];
    }
    let newList = Array(12).fill([thisGhue2, sat2, 50]);
    let pos = beat8 % 50;
    pos = (pos * 13) / 50;

    for (let i = 0; i < pos; i++) newList[i] = [thisGhue, sat1, 50];
    setList(newList);
    addGlitter(index, list, setList);
  };

  const zeus = (index, list, setList) => {
    let thisGhue, thisGhue2, sat1, sat2;
    if (useGhue[index]) {
      thisGhue = gHue;
      thisGhue2 = (gHue + 240) % 360;
      sat1 = 50;
      sat2 = 50;
    } else {
      thisGhue = colors1[index];
      thisGhue2 = colors2[index];
      sat1 = sats1[index];
      sat2 = sats2[index];
    }

    let newList = Array(12).fill([0, 0, 0]);
    let pos = beat8 % 30;
    if (pos < 2 || (pos > 4 && pos <= 6) || (pos > 7 && pos <= 9))
      newList = Array(12).fill([thisGhue, 100, 50]);

    setList(newList);
    addGlitter(index, list, setList);
    //(pos<=5) ? fill_solid(leds + startPoint, cnt, CRGB::White) : fill_solid(leds + startPoint, cnt, CRGB::Black);
  };

  const rainbowWithGlitter = (index, list, setList) => {};
  const rahnema = (index, list, setList) => {};
  const gradient2color = (index, list, setList) => {};
  const moving3 = (index, list, setList) => {};

  const gPatterns = [
    rainbow,
    rainbowWithGlitter,
    confetti,
    sinelon,
    juggle,
    bpm,
    gradient2color2,
    rahnema,
    gradient2color,
    moving3,
    rotate3point,
    rainbow3point,
    solid,
    beatcoin,
    loop2Point,
    loop1Point,
    loop1Point2,
    loop1Point2del,
    loop1Point3,
    loop2Point22,
    fillSmoth,
    zeus,
  ];

  const gPatternName = [
    "0rainbow",
    "1rainbowWithGlitter",
    "2confetti",
    "3sinelon",
    "4juggle",
    "5bpm",
    "6gradient2color2",
    "rahnema",
    "8gradient2color",
    "9moving3",
    "10rotate3point",
    "11rainbow3point",
    "12solid",
    "13beatcoin",
    "14loop2Point",
    "15loop1Point",
    "16loop1Point2",
    "17loop1Point2del",
    "18loop1Point3",
    "19loop2Point22",
    "20fillSmoth",
    "21zeus",
  ];

  const Squar2 = (props) => {
    const { loopName } = props;
    const meshRef = useRef();
    return (
      <>
        {loopName.map(
          (item, index) =>
            index < 12 && (
              <mesh
                position={[
                  -linePos[index].x * 1.8,
                  linePos[index].y,
                  linePos[index].z,
                ]}
                scale={0.5}
                rotation={[0, 3 * linePos[index].rot, 0]}
                ref={meshRef}
                key={"part333" + index}
              >
                <planeGeometry args={[3, 1, 1, 1]} />
                {/* <boxGeometry args={[2, 1, 10, 50]} /> */}
                <meshBasicMaterial
                  color={hslToRGB(...item)}
                  emissiveIntensity={2}
                  toneMapped={false}
                />
              </mesh>
            )
        )}
      </>
    );
  };

  const Squar = ({ loopName }) => {
    const meshRef = useRef();
    return (
      <>
        {loopName.map(
          (item, index) =>
            index < 12 && (
              <mesh
                position={[
                  linePos[index].x * 1.8,
                  linePos[index].y,
                  linePos[index].z,
                ]}
                scale={0.5}
                rotation={[0, -3 * linePos[index].rot, 0]}
                ref={meshRef}
                key={"part333" + index}
              >
                <planeGeometry args={[3, 1, 1, 1]} />

                <meshLambertMaterial
                  color={hslToRGB(...item)}
                  emissiveIntensity={13}
                  toneMapped={false}
                />
              </mesh>
            )
        )}
      </>
    );
  };
  ///
  const looops = [loop1, loop2, loop3, loop4, loop5, loop6, line1, line2];
  const setLooops = [
    setLoop1,
    setLoop2,
    setLoop3,
    setLoop4,
    setLoop5,
    setLoop6,
    setLine1,
    setLine2,
  ];
  useEffect(() => {
    for (let i = 0; i < 8; i++)
      gPatterns[gCurrentPatternNumber[i]](i, looops[i], setLooops[i]);
    //console.log(beat8);
  }, [beat8]);

  //
  const Circle3 = ({ loopName }) => {
    const meshRef = useRef();
    const [isSet, setIsSet] = useState(false);
    return (
      <>
        <mesh
          position={[0, 0, 0]}
          ref={meshRef}
          key={"part3" + 34546}
          onClick={() => {
            setIsSet(!isSet);
            console.log(isSet);
          }}
        >
          <ringGeometry args={[0.1, 1.6, 12, 2, 0, 2.0 * Math.PI]} />
          <meshBasicMaterial
            color={isSet ? [0, 0, 0] : [0, 0, 0]}
            toneMapped={false}
          />
        </mesh>
        {loopName.map((color, index) => (
          <mesh position={[0, 0, 0]} ref={meshRef} key={"part3" + index}>
            <ringGeometry
              args={[
                1.6,
                2.2,
                3,
                2,
                (2.0 * Math.PI * index) / 12,
                (2.0 * Math.PI) / 12 - 0.1,
              ]}
            />

            <meshBasicMaterial
              //meshLambertMaterial
              color={hslToRGB(color[0], color[1], color[2])}
              //emissive={hslToRGB(color[0], color[1], color[2])}
              // emissive={`hsl(${color[0]}, 100%, ${
              // 	40 + (Math.abs(80 - color[0]) - Math.abs(180 - color[0])) / 6
              // }%)`}
              //emissive={`hsl(${color[0]}, ${color[1]}%, ${color[2]}%)`}
              emissiveIntensity={2} //hslToRGB(color[0], color[1], color[2])
              toneMapped={false}
              // roughness={0.9}
              // metalness={0.1}
              // specular={`hsl(${color[0]}, ${color[1]}%, ${color[2]}%)`}
              // shininess={100}
            />
          </mesh>
        ))}
      </>
    );
  };

  // </effects>

  //setTo material
  useEffect(() => {
    if (mainLight && loop1.length > 11) {
      for (let i = 0; i < 12; i++) {
        const newcol = hslToRGB(loop1[i][0], loop1[i][1], loop1[i][2]);
        mainLight[1].children[i].material = new THREE.MeshStandardMaterial({
          color: { b: newcol[2], g: newcol[1], isColor: true, r: newcol[0] },
          emissive: {
            b: newcol[2],
            g: newcol[1],
            isColor: true,
            r: newcol[0],
          },
          emissiveIntensity: 3,
          toneMapped: false,
        });
      }
    }
  }, [mainLight, loop1]);

  useEffect(() => {
    if (mainLight && loop2.length > 11) {
      for (let i = 0; i < 12; i++) {
        const newcol = hslToRGB(loop2[i][0], loop2[i][1], loop2[i][2]);
        mainLight[2].children[i].material = new THREE.MeshStandardMaterial({
          color: { b: newcol[2], g: newcol[1], isColor: true, r: newcol[0] },
          emissive: {
            b: newcol[2],
            g: newcol[1],
            isColor: true,
            r: newcol[0],
          },
          emissiveIntensity: 3,
          toneMapped: false,
        });
      }
    }
  }, [mainLight, loop2]);

  useEffect(() => {
    if (mainLight && loop3.length > 11) {
      for (let i = 0; i < 12; i++) {
        const newcol = hslToRGB(loop3[i][0], loop3[i][1], loop3[i][2]);
        mainLight[3].children[i].material = new THREE.MeshStandardMaterial({
          color: { b: newcol[2], g: newcol[1], isColor: true, r: newcol[0] },
          emissive: {
            b: newcol[2],
            g: newcol[1],
            isColor: true,
            r: newcol[0],
          },
          emissiveIntensity: 3,
          toneMapped: false,
        });
      }
    }
  }, [mainLight, loop3]);

  useEffect(() => {
    if (mainLight && loop4.length > 11) {
      for (let i = 0; i < 12; i++) {
        const newcol = hslToRGB(loop4[i][0], loop4[i][1], loop4[i][2]);
        mainLight[4].children[i].material = new THREE.MeshStandardMaterial({
          color: { b: newcol[2], g: newcol[1], isColor: true, r: newcol[0] },
          emissive: {
            b: newcol[2],
            g: newcol[1],
            isColor: true,
            r: newcol[0],
          },
          emissiveIntensity: 3,
          toneMapped: false,
        });
      }
    }
  }, [mainLight, loop4]);

  useEffect(() => {
    if (mainLight && loop5.length > 11) {
      for (let i = 0; i < 12; i++) {
        const newcol = hslToRGB(loop5[i][0], loop5[i][1], loop5[i][2]);
        mainLight[5].children[i].material = new THREE.MeshStandardMaterial({
          color: { b: newcol[2], g: newcol[1], isColor: true, r: newcol[0] },
          emissive: {
            b: newcol[2],
            g: newcol[1],
            isColor: true,
            r: newcol[0],
          },
          emissiveIntensity: 3,
          toneMapped: false,
        });
      }
    }
  }, [mainLight, loop5]);

  useEffect(() => {
    if (mainLight && loop6.length > 11) {
      for (let i = 0; i < 12; i++) {
        const newcol = hslToRGB(loop6[i][0], loop6[i][1], loop6[i][2]);
        mainLight[6].children[i].material = new THREE.MeshStandardMaterial({
          color: { b: newcol[2], g: newcol[1], isColor: true, r: newcol[0] },
          emissive: {
            b: newcol[2],
            g: newcol[1],
            isColor: true,
            r: newcol[0],
          },
          emissiveIntensity: 3,
          toneMapped: false,
        });
      }
    }
  }, [mainLight, loop6]);

  useEffect(() => {
    if (mainLight && line1.length > 11) {
      for (let i = 0; i < 12; i++) {
        const newcol = hslToRGB(line1[i][0], line1[i][1], line1[i][2]);
        mainLight[7].children[i].material = new THREE.MeshStandardMaterial({
          color: { b: newcol[2], g: newcol[1], isColor: true, r: newcol[0] },
          emissive: {
            b: newcol[2],
            g: newcol[1],
            isColor: true,
            r: newcol[0],
          },
          emissiveIntensity: 3,
          toneMapped: false,
        });
      }
    }
  }, [mainLight, line1]);

  useEffect(() => {
    if (mainLight && line2.length > 11) {
      for (let i = 0; i < 12; i++) {
        const newcol = hslToRGB(line1[i][0], line1[i][1], line1[i][2]);
        mainLight[0].children[i].material = new THREE.MeshStandardMaterial({
          color: { b: newcol[2], g: newcol[1], isColor: true, r: newcol[0] },
          emissive: {
            b: newcol[2],
            g: newcol[1],
            isColor: true,
            r: newcol[0],
          },
          emissiveIntensity: 3,
          toneMapped: false,
        });
      }
    }
  }, [mainLight, line2]);

  function hslToRGB(h, s, l) {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return color;
    };

    return [f(0) * 2, f(8) * 1, f(4) * 2]; // : 5+1.5+15
  }

  useEffect(() => {
    if (mainLight) {
      for (let i = 0; i < 8; i++)
        for (let j = 0; j < 12; j++) {
          mainLight[i].children[j].onClick = () => {
            console.log("item " + i + "clicked");
          };
        }
    }
  }, [mainLight]);

  useEffect(() => {
    setGcurrentPatternNumber(configs[selectedEffect].gCurrentPatternNumber);
    setcolors1(configs[selectedEffect].colors1);
    setsats1(configs[selectedEffect].sats1);
    setlights1(configs[selectedEffect].lights1);
    setcolors2(configs[selectedEffect].colors2);
    setsats2(configs[selectedEffect].sats1);
    setlights2(configs[selectedEffect].lights1);
    setcolors3(configs[selectedEffect].colors3);
    setuseGhue(configs[selectedEffect].useGhue);
    console.log(selectedEffect);
  }, [selectedEffect]);
  //
  return (
    <>
      <EffectComposer disableNormalPass multisampling={8}>
        <Bloom
          mipmapBlur
          luminanceThreshold={3}
          luminanceSmoothing={0.4}
          levels={8}
          intensity={0.6}
        />
        {/* <ToneMapping mode={ToneMappingMode.LinearToneMapping} /> */}
        {/* <ToneMapping
          mode={4} //ReinhardToneMapping THREE.CustomToneMapping
          exposue={1.2}
        /> */}
      </EffectComposer>
      {/* <Effects disableGamma>
				<unrealBloomPass
					threshold={5}
					strength={2.0}
					radius={0.5}
				/>
				<outputPass args={[2]} />
			</Effects> */}

      {/* <group position={[31.5, 60.5, 11]} scale={1.5}>
        <Circle3 loopName={loop2} />
      </group>
      <group position={[42, 60, 20]} scale={1.5}>
        <Circle3 loopName={loop3} />
      </group>
      <group position={[134.5, 60, 20]} scale={1.5}>
        <Circle3 loopName={loop5} />
      </group>
      <group position={[146, 60.5, 11]} scale={1.5}>
        <Circle3 loopName={loop6} />
      </group>

      <group position={[54, 56, 25]} scale={1.5}>
        <Squar loopName={loop1} />
      </group>
      <group position={[124, 56, 25]} scale={1.5}>
        <Squar2 loopName={loop4} />
      </group> */}
    </>
  );
};

export default MyEffects;
