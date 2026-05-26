'use client';

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { countryThreats, getThreatColor, type CountryThreat } from '@/lib/globe-data';

function CountryMarker({ country, onHover, onClick }: { 
  country: CountryThreat; 
  onHover: (country: CountryThreat | null) => void;
  onClick: (country: CountryThreat) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const position = useMemo(() => {
    const phi = (90 - country.lat) * (Math.PI / 180);
    const theta = (country.lng + 180) * (Math.PI / 180);
    const radius = 2.05;
    
    return new THREE.Vector3(
      -(radius * Math.sin(phi) * Math.cos(theta)),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }, [country.lat, country.lng]);

  useFrame((state) => {
    if (meshRef.current && (country.threatScore >= 85 || hovered)) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      meshRef.current.scale.setScalar(scale);
    }
  });

  const color = getThreatColor(country.threatScore);

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => {
        setHovered(true);
        onHover(country);
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(null);
      }}
      onClick={() => onClick(country)}
    >
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={hovered || country.threatScore >= 85 ? 0.8 : 0.3}
      />
      {(hovered || country.threatScore >= 85) && (
        <pointLight color={color} intensity={2} distance={0.5} />
      )}
    </mesh>
  );
}

function Globe() {
  const globeRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;
    }
  });

  return (
    <Sphere ref={globeRef} args={[2, 64, 64]}>
      <meshStandardMaterial
        color="#0A1929"
        roughness={0.7}
        metalness={0.3}
        wireframe={false}
      />
    </Sphere>
  );
}

function GlobeWireframe() {
  const wireframeRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y += 0.001;
    }
  });

  return (
    <Sphere ref={wireframeRef} args={[2.01, 32, 32]}>
      <meshBasicMaterial
        color="#00BFFF"
        wireframe={true}
        transparent={true}
        opacity={0.1}
      />
    </Sphere>
  );
}

export function ThreatGlobe({ onCountryClick }: { onCountryClick: (country: CountryThreat) => void }) {
  const [hoveredCountry, setHoveredCountry] = useState<CountryThreat | null>(null);

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-b from-[#0A0E1A] to-[#0A1929] rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Globe />
        <GlobeWireframe />
        
        {countryThreats.map((country) => (
          <CountryMarker
            key={country.code}
            country={country}
            onHover={setHoveredCountry}
            onClick={onCountryClick}
          />
        ))}
        
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          autoRotate={false}
        />
      </Canvas>
      
      {hoveredCountry && (
        <div className="absolute top-4 left-4 bg-[#0A1929]/95 backdrop-blur-sm border border-primary/30 rounded-lg p-4 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-2">{hoveredCountry.name}</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Threat Score:</span>
              <span className="font-bold" style={{ color: getThreatColor(hoveredCountry.threatScore) }}>
                {hoveredCountry.threatScore}%
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Category:</span>
              <span className={`font-bold ${
                hoveredCountry.category === 'Critical' ? 'text-red-500' :
                hoveredCountry.category === 'High' ? 'text-orange-500' :
                hoveredCountry.category === 'Medium' ? 'text-yellow-500' :
                'text-green-500'
              }`}>
                {hoveredCountry.category}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Click for detailed analysis</p>
        </div>
      )}
      
      <div className="absolute bottom-4 right-4 bg-[#0A1929]/95 backdrop-blur-sm border border-primary/30 rounded-lg p-3">
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFB6C1' }}></div>
            <span className="text-gray-400">Low (0-49%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF6347' }}></div>
            <span className="text-gray-400">Medium (50-69%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#DC143C' }}></div>
            <span className="text-gray-400">High (70-84%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#8B0000' }}></div>
            <span className="text-gray-400">Critical (85-100%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
