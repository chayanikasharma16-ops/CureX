import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  Heart,
  Dna,
  Activity,
  Eye,
  RotateCw,
  Volume2,
  VolumeX,
  Sliders,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Zap,
  Sparkles,
  Info,
} from 'lucide-react';

export default function ThreeHeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [bpm, setBpm] = useState<number>(72);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<'heart' | 'dna' | 'overview'>('heart');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const bpmRef = useRef(bpm);
  bpmRef.current = bpm;

  const wireframeRef = useRef(isWireframe);
  wireframeRef.current = isWireframe;

  const soundRef = useRef(soundEnabled);
  soundRef.current = soundEnabled;

  const presetRef = useRef(activePreset);
  presetRef.current = activePreset;

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play procedural heartbeat lub-dub sound
  const playHeartSound = () => {
    if (!soundRef.current) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      // Lub (first tone)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(65, now);
      osc1.frequency.exponentialRampToValueAtTime(35, now + 0.12);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.13);

      // Dub (second tone slightly higher and shorter)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(80, now + 0.14);
      osc2.frequency.exponentialRampToValueAtTime(45, now + 0.24);
      gain2.gain.setValueAtTime(0.25, now + 0.14);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.14);
      osc2.stop(now + 0.25);
    } catch {
      // Audio context restricted until user gesture
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL as instructed by threejs skill
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#071A2E');
    scene.fog = new THREE.FogExp2('#071A2E', 0.045);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0.8, 5.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // PMREM Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting: Warm key, cool hemisphere fill, sharp rim light
    const keyLight = new THREE.DirectionalLight('#D1FAE5', 2.8);
    keyLight.position.set(4, 6, 4);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight('#059669', '#071A2E', 1.4);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight('#10B981', 3.0);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    const accentPoint = new THREE.PointLight('#F59E0B', 1.8, 10);
    accentPoint.position.set(0, 1.2, 2);
    scene.add(accentPoint);

    // ROOT ORGAN GROUP
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. PROCEDURAL MULTI-PART ANATOMICAL HEART (Composite 3-12 parts)
    const heartGroup = new THREE.Group();
    mainGroup.add(heartGroup);

    // Materials
    const heartMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#991B1B'),
      emissive: new THREE.Color('#450A0A'),
      roughness: 0.35,
      metalness: 0.1,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      reflectivity: 0.8,
    });

    const vesselMatRed = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#DC2626'),
      roughness: 0.3,
      metalness: 0.15,
      clearcoat: 0.8,
    });

    const vesselMatBlue = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#2563EB'),
      roughness: 0.3,
      metalness: 0.15,
      clearcoat: 0.8,
    });

    const coronaryMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FCA5A5'),
      roughness: 0.4,
      metalness: 0.1,
    });

    // Part A: Left Ventricle (Cone/Ellipsoid combo)
    const leftVentricleGeo = new THREE.ConeGeometry(0.72, 1.35, 32);
    leftVentricleGeo.rotateZ(Math.PI);
    leftVentricleGeo.scale(1, 1, 0.82);
    const leftVentricle = new THREE.Mesh(leftVentricleGeo, heartMat);
    leftVentricle.position.set(-0.16, -0.3, 0);
    leftVentricle.rotation.z = 0.22;
    heartGroup.add(leftVentricle);

    // Part B: Right Ventricle / Anterior wall
    const rightVentricleGeo = new THREE.SphereGeometry(0.68, 32, 24);
    rightVentricleGeo.scale(0.85, 1.15, 0.75);
    const rightVentricle = new THREE.Mesh(rightVentricleGeo, heartMat);
    rightVentricle.position.set(0.3, -0.15, 0.1);
    heartGroup.add(rightVentricle);

    // Part C: Left Atrium
    const leftAtriumGeo = new THREE.SphereGeometry(0.48, 24, 20);
    const leftAtrium = new THREE.Mesh(leftAtriumGeo, heartMat);
    leftAtrium.position.set(-0.4, 0.52, -0.1);
    heartGroup.add(leftAtrium);

    // Part D: Right Atrium
    const rightAtriumGeo = new THREE.SphereGeometry(0.46, 24, 20);
    const rightAtrium = new THREE.Mesh(rightAtriumGeo, heartMat);
    rightAtrium.position.set(0.42, 0.46, 0.05);
    heartGroup.add(rightAtrium);

    // Part E: Aortic Arch (Curved Tube)
    const aortaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.3, 0),
      new THREE.Vector3(0.05, 0.85, 0.1),
      new THREE.Vector3(-0.25, 1.25, 0),
      new THREE.Vector3(-0.6, 1.1, -0.2),
      new THREE.Vector3(-0.65, 0.4, -0.3),
    ]);
    const aortaGeo = new THREE.TubeGeometry(aortaCurve, 32, 0.16, 16, false);
    const aorta = new THREE.Mesh(aortaGeo, vesselMatRed);
    heartGroup.add(aorta);

    // Branching vessels off aorta (Brachiocephalic, Carotid, Subclavian)
    const branches = [
      new THREE.Vector3(0.0, 1.12, 0.05),
      new THREE.Vector3(-0.22, 1.25, -0.05),
      new THREE.Vector3(-0.44, 1.2, -0.15),
    ];
    branches.forEach((pt, idx) => {
      const branchCurve = new THREE.CatmullRomCurve3([
        pt,
        new THREE.Vector3(pt.x + (idx - 1) * 0.08, pt.y + 0.35, pt.z + 0.05),
      ]);
      const branchGeo = new THREE.TubeGeometry(branchCurve, 12, 0.055, 12, false);
      const branchMesh = new THREE.Mesh(branchGeo, vesselMatRed);
      heartGroup.add(branchMesh);
    });

    // Part F: Pulmonary Artery Trunk (Blue)
    const pulmCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.15, 0.15, 0.3),
      new THREE.Vector3(0.08, 0.7, 0.28),
      new THREE.Vector3(0.4, 0.95, -0.1),
    ]);
    const pulmGeo = new THREE.TubeGeometry(pulmCurve, 24, 0.15, 16, false);
    const pulmonaryTrunk = new THREE.Mesh(pulmGeo, vesselMatBlue);
    heartGroup.add(pulmonaryTrunk);

    // Part G: Superior Vena Cava (Blue)
    const cavaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.55, 0.5, 0),
      new THREE.Vector3(0.58, 1.05, -0.1),
    ]);
    const cavaGeo = new THREE.TubeGeometry(cavaCurve, 16, 0.13, 14, false);
    const venaCava = new THREE.Mesh(cavaGeo, vesselMatBlue);
    heartGroup.add(venaCava);

    // Part H: Coronary Sulcus Vessels (Subtle surface veins)
    const sulcusCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.05, 0.35, 0.45),
      new THREE.Vector3(0.05, 0.0, 0.55),
      new THREE.Vector3(0.0, -0.45, 0.42),
      new THREE.Vector3(-0.1, -0.85, 0.2),
    ]);
    const sulcusGeo = new THREE.TubeGeometry(sulcusCurve, 24, 0.025, 10, false);
    const coronaryVein = new THREE.Mesh(sulcusGeo, coronaryMat);
    heartGroup.add(coronaryVein);

    // 2. PROCEDURAL DNA DOUBLE-HELIX STRAND (Surrounding the bio-scene)
    const dnaGroup = new THREE.Group();
    mainGroup.add(dnaGroup);
    dnaGroup.position.set(2.2, -0.2, -0.5);

    const dnaStrandMat1 = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#059669'),
      emissive: new THREE.Color('#065F46'),
      roughness: 0.25,
      metalness: 0.4,
      clearcoat: 0.9,
    });

    const dnaStrandMat2 = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0284C7'),
      emissive: new THREE.Color('#0369A1'),
      roughness: 0.25,
      metalness: 0.4,
      clearcoat: 0.9,
    });

    const rungsMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F59E0B'),
      metalness: 0.3,
      roughness: 0.3,
    });

    const numBasePairs = 28;
    const helixHeight = 3.8;
    const helixRadius = 0.55;

    for (let i = 0; i < numBasePairs; i++) {
      const t = i / numBasePairs;
      const angle = t * Math.PI * 5;
      const y = (t - 0.5) * helixHeight;

      const x1 = Math.cos(angle) * helixRadius;
      const z1 = Math.sin(angle) * helixRadius;
      const x2 = Math.cos(angle + Math.PI) * helixRadius;
      const z2 = Math.sin(angle + Math.PI) * helixRadius;

      // Backbone node 1
      const sphere1 = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), dnaStrandMat1);
      sphere1.position.set(x1, y, z1);
      dnaGroup.add(sphere1);

      // Backbone node 2
      const sphere2 = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), dnaStrandMat2);
      sphere2.position.set(x2, y, z2);
      dnaGroup.add(sphere2);

      // Base pair hydrogen bond rung
      const rungCurve = new THREE.LineCurve3(new THREE.Vector3(x1, y, z1), new THREE.Vector3(x2, y, z2));
      const rungGeo = new THREE.TubeGeometry(rungCurve, 4, 0.018, 8, false);
      const rungMesh = new THREE.Mesh(rungGeo, rungsMat);
      dnaGroup.add(rungMesh);
    }

    // 3. FLOATING BIO-LUMINESCENT CELLULAR PARTICLES
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.003,
        y: Math.random() * 0.005 + 0.002,
        z: (Math.random() - 0.5) * 0.003,
      });
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Canvas particle texture for smooth round dots without 404
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    gradient.addColorStop(0, 'rgba(52, 211, 153, 1)');
    gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.6)');
    gradient.addColorStop(1, 'rgba(5, 150, 105, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const particleTexture = new THREE.CanvasTexture(canvas);
    particleTexture.colorSpace = THREE.SRGBColorSpace;

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Contact shadow plane beneath the organ
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.6;
    scene.add(shadowMesh);

    // Mouse interaction & Camera damping
    let targetRotY = 0;
    let targetRotX = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;
      targetRotY += deltaX * 0.008;
      targetRotX += deltaY * 0.008;
      targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onPointerDown);
    domElement.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    domElement.addEventListener('touchstart', onPointerDown, { passive: true });
    domElement.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Animation Loop
    let animId = 0;
    let lastBeatTime = 0;
    let clock = new THREE.Clock();

    const tick = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Damped rotation
      mainGroup.rotation.y = THREE.MathUtils.damp(mainGroup.rotation.y, targetRotY, 5, delta);
      mainGroup.rotation.x = THREE.MathUtils.damp(mainGroup.rotation.x, targetRotX, 5, delta);

      // Continuous gentle idle rotation if not dragging
      if (!isDragging) {
        targetRotY += 0.003;
      }

      // Heartbeat pulse physics (sinus rhythm cycle)
      const currentBpm = bpmRef.current;
      const beatPeriod = 60 / currentBpm;
      const phase = (time % beatPeriod) / beatPeriod;

      // Double-peak systolic pulse
      let contraction = 0;
      if (phase < 0.18) {
        // First systole (Atrial kick & Ventricular squeeze)
        contraction = Math.sin((phase / 0.18) * Math.PI) * 0.14;
      } else if (phase > 0.22 && phase < 0.40) {
        // Second systole (Aortic ejection)
        contraction = Math.sin(((phase - 0.22) / 0.18) * Math.PI) * 0.09;
      }

      // Trigger heartbeat audio on cycle start
      if (time - lastBeatTime > beatPeriod) {
        lastBeatTime = time;
        playHeartSound();
      }

      const currentScale = 1.0 + contraction;
      heartGroup.scale.set(currentScale, currentScale * 1.04, currentScale * 0.96);

      // DNA continuous helix rotation & subtle floating motion
      dnaGroup.rotation.y = time * 0.6;
      dnaGroup.position.y = -0.2 + Math.sin(time * 1.2) * 0.08;

      // Smooth camera interpolation based on activePreset (Heart vs DNA vs Overview)
      let targetCamX = 0;
      let targetCamY = 0.8;
      let targetCamZ = 5.5;

      if (presetRef.current === 'heart') {
        targetCamX = 0;
        targetCamY = 0.35;
        targetCamZ = 4.2;
      } else if (presetRef.current === 'dna') {
        targetCamX = 1.35;
        targetCamY = 0.15;
        targetCamZ = 3.65;
      } else {
        targetCamX = 0;
        targetCamY = 0.8;
        targetCamZ = 5.6;
      }

      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 3.5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 3.5, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 3.5, delta);

      // Wireframe toggles
      const targetWireframe = wireframeRef.current;
      heartMat.wireframe = targetWireframe;
      vesselMatRed.wireframe = targetWireframe;
      vesselMatBlue.wireframe = targetWireframe;

      // Particle update
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        positions[idx] += particleVelocities[i].x;
        positions[idx + 1] += particleVelocities[i].y;
        positions[idx + 2] += particleVelocities[i].z;

        // Reset if drifted beyond bounding volume
        if (positions[idx + 1] > 3) {
          positions[idx + 1] = -2.5;
          positions[idx] = (Math.random() - 0.5) * 8;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    // Resize handler
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      domElement.removeEventListener('mousedown', onPointerDown);
      domElement.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      domElement.removeEventListener('touchstart', onPointerDown);
      domElement.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      renderer.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, []);

  // Handle Fullscreen keyboard exit (Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Trigger Three.js canvas resize whenever full screen state toggles
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 60);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const getRhythmStatus = () => {
    if (bpm < 60) return { label: 'Sinus Bradycardia', color: 'text-sky-400', bg: 'bg-sky-500/10' };
    if (bpm > 100) return { label: 'Sinus Tachycardia', color: 'text-amber-400', bg: 'bg-amber-500/10' };
    return { label: 'Normal Sinus Rhythm', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
  };

  const rhythm = getRhythmStatus();
  const cardiacOutputL = ((bpm * 70) / 1000).toFixed(1);

  return (
    <div
      ref={containerRef}
      className={`transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-[100] w-screen h-screen bg-[#071A2E] overflow-hidden'
          : 'relative w-full h-[520px] lg:h-[620px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#071A2E] to-[#0A2540] border border-emerald-500/20 shadow-2xl'
      }`}
    >
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Telemetry & Fullscreen Navigation Overlay */}
      <div className="absolute top-4 sm:top-5 left-4 sm:left-5 right-4 sm:right-5 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-20">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-2.5 bg-[#071A2E]/85 border border-emerald-500/30 px-3.5 py-2 rounded-xl backdrop-blur-md shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-semibold">
              CureX Bio-Visualizer · 3D Heart & DNA
            </div>
          </div>

          {/* Preset Selector: Heart Focus vs DNA Helix vs Overview */}
          <div className="hidden sm:flex items-center bg-[#071A2E]/85 border border-slate-700/80 p-1 rounded-xl backdrop-blur-md">
            <button
              onClick={() => setActivePreset('heart')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activePreset === 'heart'
                  ? 'bg-rose-900/40 text-rose-300 border border-rose-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>Heart Focus</span>
            </button>
            <button
              onClick={() => setActivePreset('dna')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activePreset === 'dna'
                  ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Dna className="w-3.5 h-3.5 text-emerald-400" />
              <span>DNA Helix</span>
            </button>
            <button
              onClick={() => setActivePreset('overview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activePreset === 'overview'
                  ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dual Scene</span>
            </button>
          </div>
        </div>

        {/* Right side: Live Pulse, Animated ECG & Fullscreen Button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* ECG Animated Wave */}
          <div className="hidden md:flex items-center gap-2 bg-[#071A2E]/85 border border-slate-700/80 px-3 py-1.5 rounded-xl backdrop-blur-md text-xs font-mono text-slate-300">
            <svg className="w-16 h-5 text-emerald-400 stroke-current fill-none" viewBox="0 0 100 30">
              <path
                d="M0 15 L20 15 L25 5 L30 25 L35 15 L45 15 L50 20 L55 10 L60 15 L100 15"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: '120',
                  animation: `ecgPulse ${Math.max(0.4, 60 / bpm)}s linear infinite`,
                }}
              />
            </svg>
            <span className="text-slate-400">PULSE:</span>
            <span className="font-bold text-emerald-400 text-sm">{bpm} BPM</span>
          </div>

          {/* Full Screen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-lg cursor-pointer ${
              isFullscreen
                ? 'bg-rose-600/30 hover:bg-rose-600/50 border border-rose-400/50 text-rose-200'
                : 'bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/50 text-emerald-200 backdrop-blur-md'
            }`}
            title={isFullscreen ? 'Exit Full Screen mode (or press Esc)' : 'Expand 3D Organ & DNA to Full Screen'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4 text-rose-300" />
                <span>Exit Fullscreen</span>
                <span className="text-[10px] text-rose-300/80 font-mono hidden sm:inline">(Esc)</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4 text-emerald-300" />
                <span>Full Screen 3D</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Instruction hint */}
      <div className="absolute top-18 left-5 text-[11px] font-sans text-slate-400/80 pointer-events-none hidden sm:block z-10">
        Drag to rotate anatomical heart & double-helix strand · Use presets or change BPM below
      </div>

      {/* Quick Focus Pill for Mobile */}
      <div className="sm:hidden absolute top-16 left-4 right-4 flex items-center justify-center gap-1 z-20 pointer-events-auto">
        <button
          onClick={() => setActivePreset('heart')}
          className={`px-3 py-1 rounded-lg text-xs font-medium backdrop-blur-md ${
            activePreset === 'heart' ? 'bg-rose-900/60 text-rose-200 border border-rose-500/50' : 'bg-[#071A2E]/80 text-slate-300'
          }`}
        >
          Heart
        </button>
        <button
          onClick={() => setActivePreset('dna')}
          className={`px-3 py-1 rounded-lg text-xs font-medium backdrop-blur-md ${
            activePreset === 'dna' ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-500/50' : 'bg-[#071A2E]/80 text-slate-300'
          }`}
        >
          DNA
        </button>
        <button
          onClick={() => setActivePreset('overview')}
          className={`px-3 py-1 rounded-lg text-xs font-medium backdrop-blur-md ${
            activePreset === 'overview' ? 'bg-cyan-900/60 text-cyan-200 border border-cyan-500/50' : 'bg-[#071A2E]/80 text-slate-300'
          }`}
        >
          Dual
        </button>
      </div>

      {/* Ergonomic Collapsible Bottom Control Dock */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 w-[94%] max-w-[840px] z-30 transition-all duration-300 ${
          isFullscreen ? 'bottom-6' : 'bottom-4'
        }`}
      >
        {/* Toggle Collapse Bar */}
        <div className="flex justify-center -mb-2">
          <button
            onClick={() => setIsDockCollapsed(!isDockCollapsed)}
            className="flex items-center gap-1.5 px-3.5 py-1 bg-[#0A2540] border border-emerald-500/30 rounded-t-lg text-[11px] font-semibold text-emerald-300 hover:text-white transition-colors cursor-pointer shadow-lg"
          >
            {isDockCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" /> Show BPM & Bio-Controls
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" /> Minimize Dock
              </>
            )}
          </button>
        </div>

        {!isDockCollapsed && (
          <div className="bg-[#071A2E]/95 border border-emerald-500/35 rounded-2xl p-4 shadow-2xl backdrop-blur-md space-y-3">
            {/* Main Control Row */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Heartbeat BPM Slider with Live Feedback */}
              <div className="flex items-center gap-3 flex-1 min-w-[220px]">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center text-xs font-mono mb-1">
                    <span className="text-slate-300 font-semibold">Change Heartbeat Rate (BPM)</span>
                    <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      {bpm} BPM
                    </span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="180"
                    step="1"
                    value={bpm}
                    onChange={(e) => setBpm(Number(e.target.value))}
                    className="w-full accent-emerald-400 h-2 bg-slate-700/80 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>40 (Deep Sleep)</span>
                    <span>72 (Normal)</span>
                    <span>120 (Workout)</span>
                    <span>180 (Peak)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Audio, Wireframe, Reset, Fullscreen */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {/* Audio Lub-Dub Toggle */}
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    soundEnabled
                      ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200 shadow-sm'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                  title="Toggle heartbeat sound chime"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
                  <span>{soundEnabled ? 'Lub-Dub ON' : 'Muted'}</span>
                </button>

                {/* Wireframe Toggle */}
                <button
                  onClick={() => setIsWireframe(!isWireframe)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isWireframe
                      ? 'bg-cyan-600/30 border-cyan-400 text-cyan-200 shadow-sm'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                  title="Toggle wireframe topology"
                >
                  <Eye className="w-4 h-4" />
                  <span>{isWireframe ? 'Wireframe' : 'Solid PBR'}</span>
                </button>

                {/* Reset View & Vitals */}
                <button
                  onClick={() => {
                    setBpm(72);
                    setIsWireframe(false);
                    setActivePreset('heart');
                  }}
                  className="p-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Reset to 72 BPM and initial camera"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                {/* Full Screen button inside dock */}
                <button
                  onClick={toggleFullscreen}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  <span>{isFullscreen ? 'Exit Full' : 'Full Screen'}</span>
                </button>
              </div>
            </div>

            {/* Quick BPM Preset Chips & Physiological Vitals Strip */}
            <div className="pt-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-mono mr-1">Quick BPM:</span>
                {[
                  { val: 48, label: '48 (Sleep)' },
                  { val: 60, label: '60 (Resting)' },
                  { val: 72, label: '72 (Normal)' },
                  { val: 100, label: '100 (Walk)' },
                  { val: 140, label: '140 (Cardio)' },
                  { val: 170, label: '170 (Sprint)' },
                ].map((chip) => (
                  <button
                    key={chip.val}
                    onClick={() => setBpm(chip.val)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                      bpm === chip.val
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Vitals Telemetry Badge */}
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                <span className={`px-2 py-0.5 rounded font-semibold ${rhythm.bg} ${rhythm.color}`}>
                  {rhythm.label}
                </span>
                <span className="hidden sm:inline">
                  Cardiac Output: <b className="text-white">{cardiacOutputL} L/min</b>
                </span>
                <span className="hidden md:inline">
                  Cycle: <b className="text-white">{(60 / bpm).toFixed(2)}s</b>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes ecgPulse {
          0% { stroke-dashoffset: 120; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
