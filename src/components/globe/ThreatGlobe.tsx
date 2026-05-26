'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { countryThreats, getThreatColor, type CountryThreat } from '@/lib/globe-data';

const ROTATION_SPEED = 0.04;

function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Build Earth texture procedurally using canvas
function buildEarthTexture(): THREE.CanvasTexture {
  const size = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size / 2;
  const ctx = canvas.getContext('2d')!;

  // Ocean gradient
  const ocean = ctx.createLinearGradient(0, 0, 0, canvas.height);
  ocean.addColorStop(0, '#0a2a6e');
  ocean.addColorStop(0.5, '#0d47a1');
  ocean.addColorStop(1, '#0a2a6e');
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Landmasses as simplified polygons (lon/lat → pixel)
  const toXY = (lon: number, lat: number) => ({
    x: ((lon + 180) / 360) * canvas.width,
    y: ((90 - lat) / 180) * canvas.height,
  });

  const drawLand = (points: [number, number][]) => {
    ctx.beginPath();
    points.forEach(([lon, lat], i) => {
      const { x, y } = toXY(lon, lat);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
  };

  const landGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  landGrad.addColorStop(0, '#2d6a4f');
  landGrad.addColorStop(0.4, '#40916c');
  landGrad.addColorStop(0.7, '#52b788');
  landGrad.addColorStop(1, '#2d6a4f');
  ctx.fillStyle = landGrad;

  // North America
  drawLand([[-168,72],[-140,72],[-120,60],[-100,50],[-80,45],[-70,47],[-60,47],[-55,50],[-55,60],[-70,65],[-80,72],[-100,75],[-130,72],[-168,72]]);
  drawLand([[-120,50],[-80,25],[-87,15],[-77,8],[-83,10],[-90,15],[-95,20],[-105,20],[-110,25],[-120,30],[-120,50]]);
  // South America
  drawLand([[-80,12],[-60,12],[-50,0],[-35,-10],[-35,-25],[-50,-35],[-65,-55],[-75,-50],[-80,-35],[-80,-10],[-80,12]]);
  // Europe
  drawLand([[-10,36],[30,36],[40,45],[30,60],[20,65],[10,60],[0,50],[-10,45],[-10,36]]);
  drawLand([[20,65],[30,70],[40,70],[50,65],[40,60],[30,60],[20,65]]);
  // Africa
  drawLand([[-18,15],[50,15],[50,0],[40,-10],[35,-35],[20,-35],[15,-30],[10,-5],[0,5],[-18,15]]);
  // Asia
  drawLand([[30,70],[180,70],[180,10],[140,0],[100,5],[80,10],[60,20],[50,30],[40,36],[30,45],[30,70]]);
  drawLand([[100,5],[110,-5],[120,-10],[130,0],[140,10],[130,20],[120,25],[110,20],[100,5]]);
  // Australia
  drawLand([[115,-22],[135,-12],[150,-22],[155,-28],[150,-38],[140,-38],[130,-32],[115,-32],[115,-22]]);
  // Greenland
  drawLand([[-55,60],[-20,60],[-15,70],[-30,83],[-55,83],[-65,75],[-55,60]]);

  // Ice caps
  ctx.fillStyle = '#e0f7fa';
  drawLand([[-180,75],[180,75],[180,90],[-180,90]]);
  drawLand([[-180,-75],[180,-75],[180,-90],[-180,-90]]);

  // Grid lines
  ctx.strokeStyle = 'rgba(100,180,255,0.12)';
  ctx.lineWidth = 1;
  for (let lon = -180; lon <= 180; lon += 30) {
    const x = ((lon + 180) / 360) * canvas.width;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let lat = -90; lat <= 90; lat += 30) {
    const y = ((90 - lat) / 180) * canvas.height;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  return new THREE.CanvasTexture(canvas);
}

function buildAtmosphereTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 128, 80, 128, 128, 128);
  grad.addColorStop(0, 'rgba(30,100,255,0)');
  grad.addColorStop(0.6, 'rgba(30,100,255,0.05)');
  grad.addColorStop(1, 'rgba(30,150,255,0.35)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

function Stars() {
  const points = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const verts: number[] = [];
    for (let i = 0; i < 2000; i++) {
      const r = 40 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      verts.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    return geo;
  }, []);
  return (
    <points geometry={points}>
      <pointsMaterial color="#ffffff" size={0.08} sizeAttenuation transparent opacity={0.8} />
    </points>
  );
}

function GlobeMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => buildEarthTexture(), []);
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * ROTATION_SPEED;
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 128, 128]} />
      <meshPhongMaterial map={texture} specular={new THREE.Color('#1a4a8a')} shininess={25} />
    </mesh>
  );
}

function Atmosphere() {
  const texture = useMemo(() => buildAtmosphereTexture(), []);
  return (
    <mesh>
      <sphereGeometry args={[1.06, 64, 64]} />
      <meshBasicMaterial map={texture} transparent side={THREE.FrontSide} depthWrite={false} />
    </mesh>
  );
}

function PulseRing({ position, color }: { position: THREE.Vector3; color: string }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const t = (clock.getElapsedTime() * 1.5 + phase) % (Math.PI * 2);
    const s = 1 + Math.sin(t) * 0.6;
    ringRef.current.scale.setScalar(s);
    (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0.6 - Math.sin(t) * 0.5;
  });
  const normal = position.clone().normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
  return (
    <mesh ref={ringRef} position={position} quaternion={quaternion}>
      <ringGeometry args={[0.025, 0.04, 32]} />
      <meshBasicMaterial color={color} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

function AttackArc({ from, to, color }: { from: THREE.Vector3; to: THREE.Vector3; color: string }) {
  const progressRef = useRef(0);
  const lineRef = useRef<THREE.Line>(null);
  const points = useMemo(() => {
    const mid = from.clone().add(to).normalize().multiplyScalar(1.5);
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    return curve.getPoints(60);
  }, [from, to]);

  const fullGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  useFrame((_, delta) => {
    progressRef.current = (progressRef.current + delta * 0.4) % 1;
    if (!lineRef.current) return;
    const count = Math.floor(progressRef.current * points.length);
    const visible = points.slice(0, Math.max(2, count));
    lineRef.current.geometry.setFromPoints(visible);
  });

  return (
    <primitive object={new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points.slice(0, 2)),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.7 })
    )} ref={lineRef} />
  );
}

function ThreatMarker({
  country, onSelect, isSelected,
}: {
  country: CountryThreat;
  onSelect: (c: CountryThreat) => void;
  isSelected: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pos = useMemo(() => latLngToVec3(country.lat, country.lng, 1.02), [country.lat, country.lng]);
  const color = getThreatColor(country.threatScore);
  const size = 0.018 + (country.threatScore / 100) * 0.03;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const pulse = isSelected ? 1 + Math.sin(clock.getElapsedTime() * 5) * 0.3 : 1;
    meshRef.current.scale.setScalar(pulse);
  });

  return (
    <group>
      <mesh ref={meshRef} position={pos} onClick={(e) => { e.stopPropagation(); onSelect(country); }}>
        <sphereGeometry args={[size, 12, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isSelected ? 3 : 1.2} roughness={0.2} />
      </mesh>
      <PulseRing position={pos} color={color} />
    </group>
  );
}

function AttackArcs() {
  const arcs = useMemo(() => {
    const top = [...countryThreats].sort((a, b) => b.threatScore - a.threatScore).slice(0, 6);
    const targets = countryThreats.filter(c => c.threatScore < 70).slice(0, 4);
    return top.flatMap((src, i) =>
      targets.slice(0, 2).map((tgt, j) => ({
        key: `${src.code}-${tgt.code}-${i}-${j}`,
        from: latLngToVec3(src.lat, src.lng, 1.02),
        to: latLngToVec3(tgt.lat, tgt.lng, 1.02),
        color: getThreatColor(src.threatScore),
      }))
    );
  }, []);

  return (
    <group>
      {arcs.map(a => <AttackArc key={a.key} from={a.from} to={a.to} color={a.color} />)}
    </group>
  );
}

function MarkersGroup({ selected, onSelect }: { selected: CountryThreat | null; onSelect: (c: CountryThreat) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * ROTATION_SPEED;
  });
  return (
    <group ref={groupRef}>
      {countryThreats.map((c) => (
        <ThreatMarker key={c.code} country={c} onSelect={onSelect} isSelected={selected?.code === c.code} />
      ))}
    </group>
  );
}

export function ThreatGlobe({
  onCountrySelect,
  selectedCountry,
}: {
  onCountrySelect: (c: CountryThreat | null) => void;
  selectedCountry: CountryThreat | null;
}) {
  return (
    <Canvas camera={{ position: [0, 0, 2.8], fov: 45 }} style={{ background: 'transparent' }}>
      <Stars />
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 3, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-4, -2, -4]} intensity={0.4} color="#1a6aff" />
      <GlobeMesh />
      <Atmosphere />
      <AttackArcs />
      <MarkersGroup selected={selectedCountry} onSelect={onCountrySelect} />
      <OrbitControls enableZoom autoRotate={false} enablePan={false} minDistance={1.8} maxDistance={5} />
    </Canvas>
  );
}
