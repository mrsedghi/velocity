import {
  useGLTF,
  PresentationControls,
  Environment,
  ContactShadows,
  useScroll,
  Effects,
} from "@react-three/drei";

import { Canvas, extend } from "@react-three/fiber";

import { UnrealBloomPass } from "three-stdlib";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import { useEffect, useState } from "react";
import MyEffects from "./MyEffects";
extend({ UnrealBloomPass, OutputPass });
export default function ParsModel() {
  ///

  ///pars mpdel
  const { scene } = useGLTF("/untitled1(1).glb");
  const [mainLight, setMainLight] = useState([]);
  useEffect(() => {
    // scene.children[0].children = scen22.children[0].children.filter(
    //   (items, index) => index !== 12
    // );
    const selected =
      scene.children[scene.children.length - 1].children[0].children[0]
        .children[0].children[16].children;
    console.log(selected);
    setMainLight(selected);
  }, []);

  function Pars405(props) {
    return <primitive object={scene} {...props} />;
  }
  ///
  return (
    <Canvas
      dpr={(1, 2)}
      shadows
      camera={{ fov: 45 }}
      style={{ width: "100%", touchAction: "none", background: "transparent" }}
    >
      <ambientLight />
      <spotLight
        position={[10, 10, 10]}
        angle={1}
        penumbra={1}
        decay={0}
        intensity={2}
      />

      <group position={[-45, -20, -100]} scale={0.5}>
        <PresentationControls
          global
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 7, tension: 2500 }}
          rotation={[0.2, 0, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 2]}
        >
          <Pars405 />

          <MyEffects mainLight={mainLight} />
        </PresentationControls>
        <ContactShadows
          position={[0, -0.1, 0]}
          opacity={0.5}
          scale={1}
          blur={3}
          far={4}
        />
        {/* <Environment preset="warehouse" /> */}
      </group>
    </Canvas>
  );
}
