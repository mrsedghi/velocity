import { useEffect, useRef, useState } from "react";
import { range } from "lodash";
import { Canvas, extend } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { Effects } from "@react-three/drei";
import {
	EffectComposer,
	Bloom,
	ToneMapping,
} from "@react-three/postprocessing";
import { UnrealBloomPass } from "three-stdlib";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
extend({ UnrealBloomPass, OutputPass });
///
//////////

// Define the number of LEDs
const NUM_LEDS = 20;
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
function hslToRGB(h, s, l) {
	l /= 100;
	const a = (s * Math.min(l, 1 - l)) / 100;
	const f = (n) => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return color;
		// return Math.round(255 * color)
		// 	.toString(16)
		// 	.padStart(2, "0"); // convert to Hex and prefix "0" if needed
	};
	//return [f(0), f(8), f(4)]; //0.2126, 0.7152, 0.0722 : 0.2r + 0.7g + 0.07b
	//const retVal = 1 + (f(0) * 20 + f(8) + f(4) * 25) / 10;
	//console.log("convert:\t", h, s, l, " : ", f(0), f(8), f(4), " : ", retVal);

	return 1 + (f(0) * 15 + f(8) + f(4) * 30) / 10; // : 5+1.5+15
}
// Helper function to generate a random color in hex format
const randomColor = () => [Math.floor(Math.random() * 360), 100, 50]; //`hsl(${Math.floor(Math.random() * 360).toString(10)},100,50)`;

// Define the initial state for colors
const initialColors = Array(NUM_LEDS).fill([120, 100, 50]);

const NewMethod = () => {
	// State for colors
	const [colors, setColors] = useState(initialColors);
	// State for hue
	const [hue, setHue] = useState(0);

	// Function to generate rainbow colors
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
	const periode = 15;
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

	const juggle0 = () => {
		const newColors = colors.map((color) => {
			const [thisHue, thisSat, thisLight] = color;
			return [thisHue, Math.max(thisSat, 100), Math.max(thisLight - 5, 0)]; // Ensure saturation remains visible
		});

		let dotHue = 0;
		setJugglePos((jugglePos + 1) % NUM_LEDS);

		// Combine Lights Using Weighted Average (Improved)
		for (let i = 0; i < 8; i++) {
			const pos = Math.floor(
				Math.abs(Math.sin((((jugglePos * Math.PI) / NUM_LEDS) * (i + 1)) / 3)) *
					(NUM_LEDS - 1)
			);

			const [prevHue, preSat, prevL] = newColors[pos];

			// Define weights for base and combined light (adjustable)
			const baseWeight = 0.7; // Adjust for desired base light influence
			const combinedWeight = 1 - baseWeight;

			// Calculate combined color using weighted average
			const combinedHue =
				(prevHue + dotHue) * combinedWeight + prevHue * baseWeight;
			const combinedSat = Math.min(preSat + 100, 255); // Clamp saturation to 255
			const combinedL = 50; // Adjust for desired combined light brightness

			newColors[pos] = [combinedHue, combinedSat, combinedL];
			dotHue += 32;
		}

		// Color Adjustment (Improved)
		for (let i = 0; i < NUM_LEDS; i++) {
			const [prevH, prevSat, prevL] = newColors[i];

			// Adjust color based on distance from combined light (optional)
			const distance = Math.abs(i - pos); // Calculate distance from combined light
			const adjustmentFactor = Math.max(1 - distance / (NUM_LEDS / 2), 0.5); // Adjust factor based on distance (0.5 - 1)

			const adjustedHue = prevH * adjustmentFactor;
			const adjustedSat = prevSat * adjustmentFactor;
			const adjustedL = prevL;

			newColors[i] = [adjustedHue, adjustedSat, adjustedL];
		}

		setColors(newColors);
	};

	// Use effect to call animation functions

	const functionList = [sinelon, bpm, juggle, confetti, rainbow];
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

	// JSX to render LEDs
	const LEDS = colors.map((color, index) => (
		<div
			key={index}
			style={{
				backgroundColor: `hsl(${color[0]}, ${color[1]}%, ${color[2]}%)`,
				width: "10px",
				height: "10px",
				display: "inline-block",
			}}
		></div>
	));

	/////////
	const TestCircle3 = () => {
		const meshRef = useRef();
		const myUniForms = {
			thresholdColor: { value: new THREE.Color("white") },
			threshold: { value: 0.5 },
		};
		return (
			<>
				{colors.map((color, index) => (
					<mesh
						position={[0, 0, 0]}
						ref={meshRef}
						key={"part3" + index}
					>
						<ringGeometry
							args={[
								1.8,
								2,
								3,
								2,
								(2.0 * Math.PI * index) / NUM_LEDS,
								(2.0 * Math.PI) / NUM_LEDS - 0.02,
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

	return (
		<>
			<div>{LEDS}</div>
			<Canvas
				flat
				orthographic
			>
				<color
					attach="background"
					args={["#000"]}
				/>
				<ambientLight />
				{false ? (
					<Effects disableGamma>
						<unrealBloomPass
							threshold={0}
							strength={0.7}
							radius={0.02}
						/>
						<outputPass args={[THREE.ACESFilmicToneMapping]} />
					</Effects>
				) : (
					<EffectComposer disableNormalPass>
						<Bloom
							mipmapBlur
							luminanceThreshold={0.0}
							luminanceSmoothing={0.2}
							levels={6}
							intensity={2}
						/>
						{/* <ToneMapping mode={ToneMappingMode.LinearToneMapping} /> */}
						<ToneMapping
							mode={5} //ReinhardToneMapping THREE.CustomToneMapping
							exposue={0.2}
						/>
					</EffectComposer>
				)}

				<group position={[-15, 0, 0]}>
					<TestCircle3 />
				</group>
				<group position={[-10, 0, 0]}>
					<TestCircle3 />
				</group>
				<group position={[10, 0, 0]}>
					<TestCircle3 />
				</group>
				<group position={[15, 0, 0]}>
					<TestCircle3 />
				</group>

				<OrbitControls />
			</Canvas>
		</>
	);
};

export default NewMethod;
