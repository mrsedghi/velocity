import {
  useGLTF,
  PresentationControls,
  Environment,
  ContactShadows,
} from "@react-three/drei";

import { Canvas, extend } from "@react-three/fiber";

import { UnrealBloomPass } from "three-stdlib";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import TestCircle3 from "./components/testCircle3";
import { useEffect } from "react";
extend({ UnrealBloomPass, OutputPass });
export default function ParsModel() {
  ///

  ///pars mpdel
  const { scene, nodes, materials } = useGLTF("/untitled1.glb");
  //console.log(" models: ", scene.children, "\n");

  const scen22 = scene;
  //   useEffect(() => {
  //     scen22.children[0].children = scen22.children[0].children.filter(
  //       (items, index) => index !== 12
  //     );
  //     console.log(" models2: ", scene.children[0], "\n");
  //   }, []);

  function Pars405(props) {
    return <primitive object={scen22} {...props} />;
  }
  ///
  return (
    <Canvas
      dpr={(1, 2)}
      shadows
      camera={{ fov: 45 }}
      style={{ height: "400px" }}
    >
      <group position={[-50, -40, -100]} scale={0.7}>
        <PresentationControls
          global
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 1500 }}
          rotation={[0.3, 0, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 2]}
        >
          <Pars405 />

          {/* <TestCircle3 /> */}
        </PresentationControls>
        <ContactShadows
          position={[0, -0.1, 0]}
          opacity={0.5}
          scale={1}
          blur={3}
          far={4}
        />
        <Environment preset="warehouse" />
      </group>
    </Canvas>
  );
}
