import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { color } from "three/examples/jsm/nodes/Nodes.js";
import { MeshWobbleMaterial, OrbitControls } from "@react-three/drei";

function Box({ type, position, size, color, speed, wireframe }) {
	// This reference will give us direct access to the mesh
	const meshRef = useRef();
	// Set up state for the hovered and active state
	const [hovered, setHover] = useState(false);
	const [active, setActive] = useState(false);
	// Subscribe this component to the render-loop, rotate the mesh every frame
	useFrame((state, delta) => {
		meshRef.current.rotation.y += speed * delta;
		meshRef.current.position.z = Math.sin(state.clock.elapsedTime * speed) - 5;
	});
	// Return view, these are regular three.js elements expressed in JSX
	return (
		<mesh
			position={position}
			ref={meshRef}
			scale={active ? 1.5 : 1}
			onClick={(event) => setActive(!active)}
			onPointerOver={(event) => setHover(true)}
			onPointerOut={(event) => setHover(false)}
		>
			{type == "box" && <boxGeometry args={size} />}
			{type == "spher" && <sphereGeometry args={size} />}
			{type == "torus" && <torusGeometry args={size} />}
			<meshStandardMaterial
				color={hovered ? "hotpink" : color}
				wireframe={wireframe}
			/>
			{/* <MeshWobbleMaterial
				speed={0.5}
				color={hovered ? "hotpink" : color}
				wireframe={wireframe}
			/> */}
		</mesh>
	);
}

export const Cube = () => {
	return (
		<Canvas>
			<ambientLight intensity={Math.PI / 2} />
			<spotLight
				position={[10, 10, 10]}
				angle={0.15}
				penumbra={1}
				decay={0}
				intensity={Math.PI}
			/>
			<pointLight
				position={[-10, -10, -10]}
				decay={0}
				intensity={Math.PI}
			/>
			<Box
				type="box"
				position={[-6, 0, 0]}
				size={[2, 2, 1]}
				color="tomato"
				speed={1}
				wireframe={true}
			/>
			<Box
				type="spher"
				position={[0, 0, 0]}
				size={[2, 15, 15]}
				color="lime"
				speed={-0.5}
				wireframe={true}
			/>
			<Box
				type="torus"
				position={[6, 0, 0]}
				size={[2, 1, 10, 50]}
				color="cyan"
				speed={0.2}
				wireframe={true}
			/>
			<OrbitControls />
		</Canvas>
	);
};
