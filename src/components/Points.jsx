import { useState, useRef, useEffect, useMemo } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshWobbleMaterial, OrbitControls } from "@react-three/drei";
import { Effects } from "@react-three/drei";
import {
	EffectComposer,
	Bloom,
	ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { UnrealBloomPass } from "three-stdlib";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import { useControls } from "leva";
extend({ UnrealBloomPass, OutputPass });
///////////////////////
const jsm = true;
const intensity = 2;
const radius = 0.2;
/////////
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

const Points = () => {
	const [progress, setProgress] = useState(0);

	const [colors, setColors] = useState(["red", "blue"]);
	const numVertices = 24; // Assuming 12 segments (default) for the ringGeometry

	useEffect(() => {
		const intervalId = setInterval(() => {
			setProgress((prevProgress) => (prevProgress + 0.01) % 1);
		}, 100);

		return () => clearInterval(intervalId);
	}, []);

	//test circle

	const TestCircle = () => {
		const meshRef = useRef();
		useFrame((state, delta) => {
			const newColors = []; // Array to hold updated colors
			const hueStep = 360.0 / numVertices; // Hue increment for smooth rainbow transition

			for (let i = 0; i < numVertices; i++) {
				const hue = (i * hueStep + state.clock.elapsedTime * hueStep) % 360; // Adjusted hue calculation
				const color = hslToHex(hue, 80, 50); // Generate color based on adjusted hue
				newColors.push(color);
			}

			setColors(newColors);
		});
		return (
			<>
				{colors.map((color, index) => (
					<mesh
						position={[0, 0, 0]}
						ref={meshRef}
						key={"part" + index}
					>
						<ringGeometry
							args={[
								1.5,
								2,
								10,
								3,
								(2.0 * Math.PI * index) / 12,
								(2.0 * Math.PI) / 12,
							]}
						/>
						<meshBasicMaterial
							color={color}
							wireframe={false}
						/>
						{/* <MyMaterial /> */}
					</mesh>
				))}
			</>
		);
	};

	const [colors2, setColors2] = useState(Array(12).fill("#995555"));
	const [hue, setHue] = useState(240); // Hue value for confetti colors
	//let isStart = false;
	useEffect(() => {
		const newColors = colors2;
		const step = 25;
		for (let i = 0; i < colors2.length; i++) {
			const currentColor = colors2[i];
			const red = parseInt(currentColor.slice(1, 3), 16);
			const green = parseInt(currentColor.slice(3, 5), 16);
			const blue = parseInt(currentColor.slice(5, 7), 16);

			const newRed = Math.max(0, red - step); // Adjust fade speed as needed
			const newGreen = Math.max(0, green - step);
			const newBlue = Math.max(0, blue - step);

			newColors[i] = `#${newRed.toString(16).padStart(2, "0")}${newGreen
				.toString(16)
				.padStart(2, "0")}${newBlue.toString(16).padStart(2, "0")}`;
		}

		// Randomly add a confetti speck
		const randomIndex = Math.floor(Math.random() * newColors.length);
		const confettiColor = hslToHex(hue, 80, 50);
		//console.log(hue);
		newColors[randomIndex] = confettiColor;

		setColors2(newColors);
	}, [hue]);
	useEffect(() => {
		const intervalId2 = setInterval(() => {
			setHue((prevHue) => (prevHue + 15) % 360);
		}, 100);
		// return () => clearInterval(intervalId2); // Cleanup on unmount
	}, []);
	const TestCircle2 = () => {
		const meshRef = useRef();

		return (
			<>
				{colors2.map((color, index) => (
					<mesh
						position={[0, 0, 0]}
						ref={meshRef}
						key={"part" + index}
					>
						<ringGeometry
							args={[
								1.5,
								2,
								10,
								3,
								(2.0 * Math.PI * index) / 12,
								(2.0 * Math.PI) / 12,
							]}
						/>
						<meshBasicMaterial
							color={color}
							wireframe={false}
							emissive={[0.5, 0.5, 0.5]}
						/>
						{/* <MyMaterial /> */}
					</mesh>
				))}
			</>
		);
	};

	const [colors3, setColors3] = useState(Array(numVertices).fill("#aaffcc")); // Array of 12 black colors initially
	const [hue3, setHue3] = useState(0); // Hue value for effects

	useEffect(() => {
		const intervalId4 = setInterval(() => {
			setFuncIndex((prevHue) => (prevHue + 1) % functionList.length); // Update hue every 15 milliseconds (assuming 1000 / 60fps)
		}, 10000);
		return () => clearInterval(intervalId4); // Cleanup on unmount
	}, []);

	const sinelon = () => {
		// Fade colors to black
		for (let i = 0; i < colors3.length; i++) {
			const currentColor = colors3[i];
			const red = parseInt(currentColor.slice(1, 3), 16);
			const green = parseInt(currentColor.slice(3, 5), 16);
			const blue = parseInt(currentColor.slice(5, 7), 16);

			const newRed = Math.max(0, red - 10); // Adjust fade speed as needed
			const newGreen = Math.max(0, green - 10);
			const newBlue = Math.max(0, blue - 10);

			colors3[i] = `#${newRed.toString(16).padStart(2, "0")}${newGreen
				.toString(16)
				.padStart(2, "0")}${newBlue.toString(16).padStart(2, "0")}`;
		}

		// Calculate sin position for sweeping dot
		const pos = Math.floor(
			Math.sin((hue3 * Math.PI) / 360) * (colors3.length - 1)
		);

		// Add confetti color at calculated position
		// console.log(
		// 	"hue",
		// 	hue3,
		// 	"pos",
		// 	pos,
		// 	"\tsin(",
		// 	(hue3 * Math.PI) / 360.0,
		// 	"): ",
		// 	Math.sin((hue3 * Math.PI) / 360)
		// );
		colors3[pos] = hslToHex(hue3, 100, 80);

		setColors([...colors3]); // Update state with modified colors
	};

	const bpm = () => {
		const BeatsPerMinute = 20;
		// Replace with your desired palette data (e.g., array of hex colors)
		const palette = [
			0, 120, 240, 300, 180, 320, 60, 150, 40, 210, 340, 270, 30, 200,
		];

		const beat = Math.floor(Math.sin((hue3 * Math.PI) / 360) * 60); // Adjust based on BPM 64 to 255
		// console.log("this beat:", beat);
		for (let i = 0; i < colors3.length; i++) {
			const paletteIndex = (hue3 + i * 2) % palette.length;
			const color1 = hslToHex(palette[paletteIndex], 80, beat);
			colors3[i] = color1;
		}

		setColors3([...colors3]); // Update state with modified colors
	};

	const juggle = () => {
		// Fade colors to black
		const colors2 = colors3;
		for (let i = 0; i < colors2.length; i++) {
			const currentColor = colors2[i];
			const red = parseInt(currentColor.slice(1, 3), 16);
			const green = parseInt(currentColor.slice(3, 5), 16);
			const blue = parseInt(currentColor.slice(5, 7), 16);

			const newRed = Math.max(0, red - 10); // Adjust fade speed as needed
			const newGreen = Math.max(0, green - 10);
			const newBlue = Math.max(0, blue - 10);

			colors2[i] = `#${newRed.toString(16).padStart(2, "0")}${newGreen
				.toString(16)
				.padStart(2, "0")}${newBlue.toString(16).padStart(2, "0")}`;
		}

		let dothue = 0;
		for (let i = 0; i < 8; i++) {
			const pos = Math.floor(
				((Math.sin(((hue3 + i * 7) * Math.PI) / 180) + 1) / 2) *
					(colors2.length - 1)
			);
			colors2[pos] = hslToHex(dothue, 80, 50);
			dothue += 32;
		}

		setColors3(colors2); // Update state with modified colors
	};

	const confetti = () => {
		const newColors = colors3;
		const step = 25;
		for (let i = 0; i < colors2.length; i++) {
			const currentColor = newColors[i];
			const red = parseInt(currentColor.slice(1, 3), 16);
			const green = parseInt(currentColor.slice(3, 5), 16);
			const blue = parseInt(currentColor.slice(5, 7), 16);

			const newRed = Math.max(0, red - step); // Adjust fade speed as needed
			const newGreen = Math.max(0, green - step);
			const newBlue = Math.max(0, blue - step);

			newColors[i] = `#${newRed.toString(16).padStart(2, "0")}${newGreen
				.toString(16)
				.padStart(2, "0")}${newBlue.toString(16).padStart(2, "0")}`;
		}

		// Randomly add a confetti speck
		const randomIndex = Math.floor(Math.random() * newColors.length);
		const confettiColor = hslToHex(hue, 80, 50);
		//console.log(hue);
		newColors[randomIndex] = confettiColor;

		setColors3(newColors);
	};

	const rainBow = () => {
		const newColors = []; // Array to hold updated colors
		const hueStep = 360.0 / numVertices; // Hue increment for smooth rainbow transition

		for (let i = 0; i < numVertices; i++) {
			const hue = (i * hueStep + hue3) % 360; // Adjusted hue calculation
			const color = hslToHex(hue, 80, 50); // Generate color based on adjusted hue
			newColors.push(color);
		}

		setColors3(newColors);
	};

	///
	const functionList = [sinelon, bpm, juggle, confetti, rainBow];
	const [funcIndex, setFuncIndex] = useState(0);
	useEffect(() => {
		// console.log(" hue : ", hue3);
		functionList[funcIndex]();
	}, [hue3]);

	useEffect(() => {
		const intervalId3 = setInterval(() => {
			setHue3((prevHue) => (prevHue + 9) % 360); // Update hue every 15 milliseconds (assuming 1000 / 60fps)
		}, 50);
		return () => clearInterval(intervalId3); // Cleanup on unmount
	}, []);
	///
	const TestCircle3 = () => {
		const meshRef = useRef();
		return (
			<>
				{colors3.map((color, index) => (
					<mesh
						position={[0, 0, 0]}
						ref={meshRef}
						key={"part" + index}
					>
						<ringGeometry
							args={[
								1.5,
								2,
								10,
								3,
								(2.0 * Math.PI * index) / numVertices,
								(2.0 * Math.PI) / numVertices,
							]}
						/>
						<meshStandardMaterial
							color={color}
							emissive={color}
							emissiveIntensity={3}
							toneMapped={false}
						/>
						{/* <MyMaterial /> */}
					</mesh>
				))}
			</>
		);
	};

	//
	const { jsm, intensity, radius } = useControls({
		jsm: true,
		intensity: { value: 0.4, min: 0, max: 1.5, step: 0.01 },
		radius: { value: 0, min: 0, max: 1, step: 0.01 },
	});
	//
	return (
		<Canvas
			flat
			orthographic
		>
			<color
				attach="background"
				args={["#111"]}
			/>
			<ambientLight />
			{jsm ? (
				<Effects disableGamma>
					<unrealBloomPass
						threshold={0}
						strength={intensity}
						radius={radius / 2}
					/>
					<outputPass args={[THREE.NeutralToneMapping]} />
				</Effects>
			) : (
				<EffectComposer disableNormalPass>
					<Bloom
						mipmapBlur
						luminanceThreshold={1}
						levels={8}
						intensity={intensity * 4}
					/>
					<ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
				</EffectComposer>
			)}
			{/* <group>
				<TestCircle />
			</group>
			<group position={[5, 0, 0]}>
				<TestCircle2 />
			</group> */}
			<group position={[-5, 0, 0]}>
				<TestCircle3 />
			</group>

			<OrbitControls />
		</Canvas>
	);
};

export default Points;
