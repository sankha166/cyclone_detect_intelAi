import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import cycloneSprite from "@/assets/cyclone-sprite.png";
import earthMap from "@/assets/earth-night.jpg";
import earthBump from "@/assets/earth-topology.png";
import earthSpecular from "@/assets/earth-water.png";


const atmosphereVertexShader = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    float rim = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 5.5);
    float edge = smoothstep(0.55, 0.95, rim);
    gl_FragColor = vec4(0.35, 0.75, 1.0, edge * 0.35);
  }
`;

function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function Atmosphere() {
  return (
    <mesh scale={[1.045, 1.045, 1.045]}>
      <sphereGeometry args={[2, 64, 64]} />
      <shaderMaterial
        vertexShader={atmosphereVertexShader}
        fragmentShader={atmosphereFragmentShader}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        transparent
      />
    </mesh>
  );
}

function Cyclone({ parent }: { parent: React.RefObject<THREE.Group | null> }) {
  const texture = useLoader(THREE.TextureLoader, cycloneSprite);
  const markerRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const position = useMemo(() => latLonToVector3(17, 88, 2.025), []);
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize());
    return q;
  }, [position]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    if (markerRef.current) markerRef.current.rotation.z -= dt * 0.35;
    if (pulseRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * (Math.PI / 2)) * 0.1;
      pulseRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={parent as React.RefObject<THREE.Group>}>
      <group ref={markerRef} position={position} quaternion={quaternion}>
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[0.42, 0.42]} />
          <meshBasicMaterial
            map={texture}
            color="#7eeaff"
            transparent
            opacity={0.92}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh ref={pulseRef} position={[0, 0, 0.019]}>
          <torusGeometry args={[0.245, 0.012, 8, 48]} />
          <meshBasicMaterial color="#53ddff" transparent opacity={0.8} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, 0.022]}>
          <sphereGeometry args={[0.038, 16, 16]} />
          <meshBasicMaterial color="#d9fbff" toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function EarthSystem() {
  const textures = useLoader(THREE.TextureLoader, [
    earthMap,
    earthBump,
    earthSpecular,
  ]) as THREE.Texture[];
  const [earthTexture, bumpMap, specularMap] = textures as [
    THREE.Texture,
    THREE.Texture,
    THREE.Texture,
  ];

  const { gl } = useThree();
  const earthRef = useRef<THREE.Mesh>(null);
  const cycloneGroup = useRef<THREE.Group>(null);

  useEffect(() => {
    const anisotropy = gl.capabilities.getMaxAnisotropy();
    earthTexture.colorSpace = THREE.SRGBColorSpace;
    earthTexture.anisotropy = anisotropy;
    earthTexture.minFilter = THREE.LinearMipmapLinearFilter;
    earthTexture.magFilter = THREE.LinearFilter;
    bumpMap.anisotropy = anisotropy;
    specularMap.anisotropy = anisotropy;
    earthTexture.needsUpdate = true;
    bumpMap.needsUpdate = true;
    specularMap.needsUpdate = true;
  }, [bumpMap, earthTexture, gl, specularMap]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (earthRef.current) earthRef.current.rotation.y += dt * 0.035;
    if (cycloneGroup.current) cycloneGroup.current.rotation.y += dt * 0.035;
  });

  return (
    <>
      <Atmosphere />

      <mesh ref={earthRef} rotation={[0, 2.7, 0.15]}>
        <sphereGeometry args={[2, 96, 96]} />
        <meshPhongMaterial
          map={earthTexture}
          emissiveMap={earthTexture}
          emissive={new THREE.Color("#ffffff")}
          emissiveIntensity={0.85}
          bumpMap={bumpMap}
          bumpScale={0.02}
          specularMap={specularMap}
          specular={new THREE.Color("#3a5a7a")}
          shininess={14}
        />
      </mesh>

      <group rotation={[0, 2.7, 0.15]}>
        <Cyclone parent={cycloneGroup} />
      </group>
    </>
  );
}

export default function GlobeScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.35;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
      style={{ background: "transparent" }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 5.4]} fov={45} />

      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 3, 5]} intensity={0.7} color="#fff8e7" />
      <pointLight position={[-5, -3, -5]} intensity={0.3} color="#1e3a8a" />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <Suspense fallback={null}>
        <EarthSystem />
      </Suspense>

      <OrbitControls
        enableZoom
        enablePan={false}
        minDistance={3.4}
        maxDistance={9}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.45}
        zoomSpeed={0.5}
      />
    </Canvas>
  );
}