import { Canvas } from "@react-three/fiber";
import {
  useGLTF,
  PresentationControls,
  Environment,
  ContactShadows,
} from "@react-three/drei";

export default function ParsModel() {
  return (
    <Canvas
      dpr={(1, 2)}
      shadows
      camera={{ fov: 45 }}
      style={{ height: "500px" }}
    >
      {/* <PresentationControls
        global
        config={{ mass: 2, tension: 500 }}
        snap={{ mass: 4, tension: 1500 }}
        rotation={[0, 0.3, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}
      > */}
      <PresentationControls
        speed={1.5}
        global
        zoom={0.5}
        polar={[-0.1, Math.PI / 4]}
      >
        <Pars405 />
      </PresentationControls>
      <ContactShadows
        position={[0, -0.1, 0]}
        opacity={0.5}
        scale={10}
        blur={3}
        far={4}
      />
      <Environment preset="warehouse" />
    </Canvas>
  );
}

function Pars405(props) {
  const { scene } = useGLTF("/untitled.gltf");
  return <primitive object={scene} {...props} />;
}
