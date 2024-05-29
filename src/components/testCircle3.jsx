import { useEffect, useRef, useState } from "react";
import { range } from "lodash";
import * as THREE from "three";
// import { OrbitControls } from "@react-three/drei";
// import { Effects } from "@react-three/drei";

import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from "@react-three/postprocessing";

const TestCircle3 = () => {
  const NUM_LEDS = 12;
  const initialColors = Array(NUM_LEDS).fill([120, 100, 50]);
  const [linePos, setLinePos] = useState([
    { x: 0, y: 0, z: -0.2, rot: (Math.PI / 360) * 5 },
    { x: -1, y: 0, z: -0.4, rot: (Math.PI / 360) * 9 },
    { x: -2, y: 0, z: -0.8, rot: (Math.PI / 360) * 11 },
    { x: -3, y: 0, z: -1.3, rot: (Math.PI / 360) * 13 },
    { x: -4, y: 0, z: -1.9, rot: (Math.PI / 360) * 14 },
    { x: -5, y: 0, z: -2.6, rot: (Math.PI / 360) * 17 },
    { x: -6, y: 0, z: -3.4, rot: (Math.PI / 360) * 18 },
    { x: -7, y: 0, z: -4.5, rot: (Math.PI / 360) * 22 },
    { x: -8, y: 0, z: -5.7, rot: (Math.PI / 360) * 25 },
    { x: -9, y: 0, z: -7.1, rot: (Math.PI / 360) * 25 },
    { x: -10, y: 0, z: -8.6, rot: (Math.PI / 360) * 25 },
    { x: -11, y: 0, z: -10.1, rot: (Math.PI / 360) * 25 },
  ]);
  const [lineColor, setLineColor] = useState([
    "#ff00ff",
    "#fff",
    "#ff0",
    "#0ff",
    "#f88",
    "#0fff00",
    "#8c8c41",
    "#a8f",
    "#ffaa22",
    "#aa22ff",
    "#22aaff",
  ]);
  // State for colors
  const [colors, setColors] = useState(initialColors);
  // State for hue
  const [hue, setHue] = useState(0);
  //effects/
  const rainbow = () => {
    const newColors = range(NUM_LEDS).map((color, index) => [
      (hue + index * 17) % 360,
      100,
      50,
    ]);
    setColors(newColors);
    //console.log(newColors[0]);
  };

  // Function to add glitter effect
  const addGlitter = () => {
    const chanceOfGlitter = 0.01; // Adjust glitter chance as needed

    const newColors = range(NUM_LEDS).map((color, index) => {
      if (Math.random() < chanceOfGlitter) {
        return [hue, 100, 100];
      } else {
        return [(hue + index * 6) % 360, 100, 50];
      }
    });
    setColors(newColors);
  };

  // Function to generate confetti effect
  const confetti = () => {
    const newColors = colors.map((color, index) => {
      // const regex = /hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/;
      // const match = color.match(regex);
      // if (match && match[1]) {
      // 	const originalHueString = match[1];

      // 	// Extracted saturation value as a string
      // 	const originalSaturationString = match[2];

      // 	// Extracted lightness value as a string
      // 	const originalLightnessString = match[3];

      // 	// Convert the hue, saturation, and lightness values to numbers
      // 	const originalHue = parseInt(originalHueString, 10);
      // 	const originalSaturation = parseInt(originalSaturationString, 10);
      // 	const originalLightness = parseInt(originalLightnessString, 10);

      // 	// Modify the saturation value by subtracting 5
      // 	const newLightness = Math.max(0, originalLightness - 2);

      // 	// Reconstruct the modified string
      // 	const modifiedString = `hsl(${originalHue}, ${originalSaturation}%, ${newLightness}%)`;

      // if (Math.random() < 0.01) {
      // 	// Adjust speckle density as needed
      // 	return randomColor();
      // } else {
      const [thisHue, thisSat, thisLight] = color;
      return [thisHue, thisSat, Math.max(thisLight - 5, 0)];
      // }
      // }
      // return color;
    });
    const pos = Math.floor(Math.random() * NUM_LEDS);
    newColors[pos] = randomColor();
    setColors(newColors);
  };

  // Function to generate sinelon effect
  const [sinPos, setSinPos] = useState(0);
  const sinelon = () => {
    const newColors = colors.map((color) => {
      const [thisHue, thisSat, thisLight] = color;
      return [thisHue, thisSat, Math.max(thisLight - 5, 0)];
    });
    const pos = Math.floor(
      Math.abs(Math.sin((sinPos * Math.PI) / NUM_LEDS)) * NUM_LEDS
    ); // Adjust speed as needed
    const pos_1 = Math.floor(
      Math.abs(Math.sin(((sinPos - 1) * Math.PI) / NUM_LEDS)) * NUM_LEDS
    ); // Adjust speed as needed
    newColors[pos] = [hue, 100, 50];
    if (pos > pos_1)
      for (let i = pos_1; i < pos; i++) newColors[i] = [hue, 100, 50];
    else for (let i = pos; i < pos_1; i++) newColors[i] = [hue, 100, 50];
    setSinPos((prevVal) => (prevVal + 1) % NUM_LEDS);
    //sinPos = sinPos % NUM_LEDS;
    //console.log("sin pos", sinPos);
    setColors(newColors);
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
  const [bitPos, setBitPos] = useState(0);
  const bpm = () => {
    const beat = Math.abs(Math.sin((bitPos * Math.PI) / NUM_LEDS)) * 35 + 15; // Adjust speed as needed
    setBitPos((bitPos + 1) % NUM_LEDS);
    const newColors = colors.map((color, index) => {
      const [thisHue, thisSat, thisLight] =
        partyColor[Math.floor(index + hue / 22.5) % 16];
      return [
        thisHue,
        thisSat,
        Math.max(
          Math.min(
            Math.floor(((beat - hue / 7.5 + index) * thisLight) / 50),
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
    setColors(newColors);
  };

  const [jugglePos, setJugglePos] = useState(0);
  const juggle = () => {
    const newColors = colors.map((color) => {
      const [thisHue, thisSat, thisLight] = color;
      return [thisHue, thisSat, Math.max(thisLight - 5, 0)];
    });
    let dotHue = 0;
    setJugglePos((jugglePos + 1) % NUM_LEDS);
    for (let i = 0; i < 8; i++) {
      const pos = Math.floor(
        Math.abs(Math.sin((((jugglePos * Math.PI) / NUM_LEDS) * (i + 1)) / 3)) *
          (NUM_LEDS - 1)
      );

      const [prevHue, preSat, prevL] = newColors[pos];
      newColors[pos] = [prevHue + dotHue, preSat + 100, 50];
      dotHue += 32;
    }
    for (let i = 0; i < NUM_LEDS; i++) {
      const [prevH, prevSat, prevL] = newColors[i];
      const factor = prevSat / 50;
      newColors[i] = [prevH / factor, prevSat / factor, prevL];
    }
    setColors(newColors);
  };

  const randomColor = () => [Math.floor(Math.random() * 360), 100, 50]; //`hsl(${Math.floor(Math.random() * 360).toString(10)},100,50)`;

  // </effects>

  const functionList = [rainbow, addGlitter, confetti, sinelon, bpm, juggle];
  const [funcIndex, setFuncIndex] = useState(0);

  const [cnt, setCnt] = useState(0);
  useEffect(() => {
    setCnt((cnt + 1) % 200);
    if (cnt == 0) setFuncIndex((funcIndex + 1) % functionList.length);
    functionList[funcIndex]();
  }, [hue]);
  useEffect(() => {
    const interval = setInterval(() => {
      setHue((prevHue) => (prevHue + 4) % 360); // Increment hue for rainbow effect
      // Call animation functions here
      //rainbow();
      // addGlitter();
      // confetti();
      // sinelon();
    }, 50); // Adjust interval as needed
    return () => clearInterval(interval);
  }, []);
  ////
  const Circle3 = () => {
    const meshRef = useRef();

    return (
      <>
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[0.1, 1.6, 10, 2, 0, 2.0 * Math.PI]} />

          <meshBasicMaterial color={`hsl(0, 0%, 0%)`} />
        </mesh>

        {colors.map((color, index) => (
          <mesh position={[0, 0, 0]} ref={meshRef} key={"part3" + index}>
            <ringGeometry
              args={[
                1.6,
                2.2,
                3,
                2,
                (2.0 * Math.PI * index) / NUM_LEDS,
                (2.0 * Math.PI) / NUM_LEDS - 0.1,
              ]}
            />

            <meshLambertMaterial
              color={`hsl(${color[0]}, ${color[1]}%, ${color[2]}%)`}
              // emissive={`hsl(${color[0]}, 100%, ${
              // 	40 + (Math.abs(80 - color[0]) - Math.abs(180 - color[0])) / 6
              // }%)`}
              emissive={`hsl(${color[0]}, ${color[1]}%, ${color[2]}%)`}
              emissiveIntensity={hslToRGB(color[0], color[1], color[2])} //hslToRGB(color[0], color[1], color[2])
              toneMapped
              roughness={0.9}
              metalness={0.1}
              specular={`hsl(${color[0]}, ${color[1]}%, ${color[2]}%)`}
              shininess={100}
            />
          </mesh>
        ))}
      </>
    );
  };

  const Squar2 = () => {
    const meshRef = useRef();
    return (
      <>
        {linePos.map((item, index) => (
          <mesh
            position={[-item.x * 1.8, item.y, item.z]}
            scale={0.5}
            rotation={[0, 3 * item.rot, 0]}
            ref={meshRef}
            key={"part333" + index}
          >
            <planeGeometry args={[3, 1, 1, 1]} />
            {/* <boxGeometry args={[2, 1, 10, 50]} /> */}
            <meshStandardMaterial color={lineColor[index]} />
          </mesh>
        ))}
      </>
    );
  };
  const Squar = () => {
    const meshRef = useRef();
    return (
      <>
        <mesh
          position={[-7.5, 0, -2]}
          scale={0.5}
          rotation={[0, 0, 0]}
          key={"part333" + "-10t"}
        >
          <planeGeometry args={[33, 1, 1, 1]} />
          {/* <boxGeometry args={[2, 1, 10, 50]} /> */}
          <meshStandardMaterial color={"red"} />
        </mesh>
        {linePos.map((item, index) => (
          <mesh
            position={[item.x * 1.8, item.y, item.z]}
            scale={0.5}
            rotation={[0, -3 * item.rot, 0]}
            ref={meshRef}
            key={"part333" + index}
          >
            <planeGeometry args={[3, 1, 1, 1]} />
            {/* <boxGeometry args={[2, 1, 10, 50]} /> */}
            <meshStandardMaterial color={lineColor[index]} />
          </mesh>
        ))}
      </>
    );
  };
  ///
  return (
    <>
      <EffectComposer disableNormalPass>
        <Bloom
          mipmapBlur
          luminanceThreshold={1}
          luminanceSmoothing={0.2}
          levels={12}
          intensity={3.5}
        />
        {/* <ToneMapping mode={ToneMappingMode.LinearToneMapping} /> */}
        <ToneMapping
          mode={4} //ReinhardToneMapping THREE.CustomToneMapping
          exposue={1.2}
        />
      </EffectComposer>
      {/* <Effects disableGamma>
				<unrealBloomPass
					threshold={5}
					strength={2.0}
					radius={0.5}
				/>
				<outputPass args={[2]} />
			</Effects> */}

      <group
        position={[31.5, 60.5, 11]}
        scale={1.5}
        onClick={() => {
          alert("1");
        }}
      >
        <Circle3 />
      </group>
      <group
        position={[42, 60, 20]}
        scale={1.5}
        onClick={() => {
          alert("2");
        }}
      >
        <Circle3 />
      </group>
      <group
        position={[134.5, 60, 20]}
        scale={1.5}
        onClick={() => {
          alert("3");
        }}
      >
        <Circle3 />
      </group>
      <group
        position={[146, 60.5, 11]}
        scale={1.5}
        onClick={() => {
          alert("4");
        }}
      >
        <Circle3 />
      </group>

      <group
        position={[54, 56, 25]}
        scale={1.5}
        // onClick={() => {
        //   alert("5");
        // }}
      >
        <Squar />
      </group>
      <group position={[124, 56, 25]} scale={1.5}>
        <Squar2 />
      </group>
    </>
  );
};

function hslToRGB(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return color;
  };

  return 1 * (1 + (f(0) * 30 + f(8) * 5 + f(4) * 40) / 10); // : 5+1.5+15
}

export default TestCircle3;
