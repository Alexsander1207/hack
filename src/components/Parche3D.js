import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const mapColor = (value) => {
  if (value === 'Muy Alto' || value === 'Bajo' || value === 'MUY SECO') return '#c0392b';
  if (value === 'Moderado' || value === 'Seco' || value === 'Saturado') return '#f39c12';
  return '#27ae60';
};

const Parche3D = ({ nasaData }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const plantasRef = useRef([]);
  const particlesRef = useRef(null);
  const animationIdRef = useRef(null);
  
  // Control de cámara mejorado
  const cameraControlRef = useRef({
    isDragging: false,
    previousMouse: { x: 0, y: 0 },
    rotation: { x: -0.25, y: 0.8 }, // Ángulo inicial fijo
    distance: 5.5, // Distancia fija de la cámara
    minDistance: 4.5, // Distancia mínima (zoom in)
    maxDistance: 6, // Distancia máxima (zoom out) - MÁS LIMITADO
    minVertical: -0.35, // NO puede subir mucho
    maxVertical: -0.05 // NO puede bajar - SIEMPRE VE LOS CULTIVOS
  });

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // Escena con cielo degradado realista
    const scene = new THREE.Scene();
    
    // Crear cielo con degradado (arriba azul, abajo horizonte claro)
    const vertexShader = `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    
    const fragmentShader = `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition + offset).y;
        gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
      }
    `;
    
    const uniforms = {
      topColor: { value: new THREE.Color(nasaData.Clima === 'ALTO' ? 0x5a5a5a : 0x0077be) },
      bottomColor: { value: new THREE.Color(nasaData.Clima === 'ALTO' ? 0x8b8b8b : 0xb8d4e8) },
      offset: { value: 10 },
      exponent: { value: 0.6 }
    };
    
    const skyGeo = new THREE.SphereGeometry(500, 32, 15);
    const skyMat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.BackSide
    });
    
    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);
    
    scene.fog = new THREE.Fog(nasaData.Clima === 'ALTO' ? 0x8b8b8b : 0xb8d4e8, 15, 50);
    sceneRef.current = scene;

    // Cámara con posición fija inicial
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    const ctrl = cameraControlRef.current;
    camera.position.set(
      ctrl.distance * Math.sin(ctrl.rotation.y) * Math.cos(ctrl.rotation.x),
      ctrl.distance * Math.sin(ctrl.rotation.x) + 3.5,
      ctrl.distance * Math.cos(ctrl.rotation.y) * Math.cos(ctrl.rotation.x)
    );
    camera.lookAt(0, 0.6, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, nasaData.Clima === 'ALTO' ? 0.3 : 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, nasaData.Clima === 'ALTO' ? 0.4 : 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x654321, 0.4);
    scene.add(hemisphereLight);

    // Crear suelo
    const crearSuelo = () => {
      const colorBase = nasaData.SMAP === 'MUY SECO' ? 0x8B4513 :
                        nasaData.SMAP === 'Seco' ? 0xA0522D :
                        nasaData.SMAP === 'Saturado' ? 0x5D4E37 : 0x654321;

      // Suelo GIGANTE para que NUNCA desaparezca
      const sueloGeometry = new THREE.PlaneGeometry(50, 50, 32, 32);
      const sueloMaterial = new THREE.MeshStandardMaterial({
        color: colorBase,
        roughness: 0.95,
        metalness: 0.1
      });
      const suelo = new THREE.Mesh(sueloGeometry, sueloMaterial);
      suelo.rotation.x = -Math.PI / 2;
      suelo.receiveShadow = true;
      scene.add(suelo);

      // Borde decorativo alrededor del área de cultivo
      const bordeGeometry = new THREE.RingGeometry(6, 6.3, 64);
      const bordeMaterial = new THREE.MeshStandardMaterial({
        color: 0x3d2817,
        roughness: 0.9
      });
      const borde = new THREE.Mesh(bordeGeometry, bordeMaterial);
      borde.rotation.x = -Math.PI / 2;
      borde.position.y = 0.02;
      scene.add(borde);

      for (let i = 0; i < 4; i++) {
        const z = -1.5 + i * 1;
        const surcoGeometry = new THREE.PlaneGeometry(8, 0.4);
        const surcoMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color(colorBase).multiplyScalar(0.7),
          roughness: 1
        });
        const surco = new THREE.Mesh(surcoGeometry, surcoMaterial);
        surco.rotation.x = -Math.PI / 2;
        surco.position.set(0, 0.05, z);
        scene.add(surco);
      }

      if (nasaData.SMAP === 'Saturado') {
        const aguaGeometry = new THREE.PlaneGeometry(9, 9);
        const aguaMaterial = new THREE.MeshStandardMaterial({
          color: 0x3498db,
          transparent: true,
          opacity: 0.3,
          roughness: 0.1,
          metalness: 0.8
        });
        const agua = new THREE.Mesh(aguaGeometry, aguaMaterial);
        agua.rotation.x = -Math.PI / 2;
        agua.position.y = 0.08;
        scene.add(agua);
      }

      // Textura de pasto alrededor
      const pastoGeometry = new THREE.RingGeometry(6.5, 15, 64);
      const pastoMaterial = new THREE.MeshStandardMaterial({
        color: nasaData.Clima === 'ALTO' ? 0x556b2f : 0x6b8e23,
        roughness: 1
      });
      const pasto = new THREE.Mesh(pastoGeometry, pastoMaterial);
      pasto.rotation.x = -Math.PI / 2;
      pasto.position.y = 0.01;
      pasto.receiveShadow = true;
      scene.add(pasto);
    };

    const crearPlanta = (x, z) => {
      const group = new THREE.Group();
      const escalaVigor = nasaData.NDVI === 'Muy Alto' ? 1.3 : nasaData.NDVI === 'Bajo' ? 0.6 : 1;
      const colorPlanta = new THREE.Color(mapColor(nasaData.NDVI));
      const ajusteColor = nasaData.SMAP === 'MUY SECO' ? 0.6 : nasaData.SMAP === 'Saturado' ? 0.8 : 1;
      colorPlanta.multiplyScalar(ajusteColor);

      const talloGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.6, 8);
      const talloMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorPlanta).multiplyScalar(0.7),
        roughness: 0.8
      });
      const tallo = new THREE.Mesh(talloGeometry, talloMaterial);
      tallo.position.y = 0.3;
      tallo.castShadow = true;
      group.add(tallo);

      const hojas = [];
      for (let nivel = 0; nivel < 4; nivel++) {
        for (let i = 0; i < 4; i++) {
          const angulo = (i * Math.PI) / 2 + nivel * 0.3;
          const hojaGeometry = new THREE.BoxGeometry(0.02, 0.2, 0.15);
          const hojaMaterial = new THREE.MeshStandardMaterial({
            color: colorPlanta,
            roughness: 0.6,
            side: THREE.DoubleSide
          });
          const hoja = new THREE.Mesh(hojaGeometry, hojaMaterial);
          hoja.position.set(
            Math.cos(angulo) * 0.15,
            0.2 + nivel * 0.15,
            Math.sin(angulo) * 0.15
          );
          hoja.rotation.y = angulo;
          hoja.rotation.z = Math.PI / 6;
          hoja.castShadow = true;
          hojas.push({ mesh: hoja, angulo, offset: i });
          group.add(hoja);
        }
      }

      if (nasaData.NDVI !== 'Bajo') {
        const florGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const florMaterial = new THREE.MeshStandardMaterial({
          color: 0xe8b4f0,
          roughness: 0.3
        });
        const flor = new THREE.Mesh(florGeometry, florMaterial);
        flor.position.y = 0.8;
        flor.castShadow = true;
        group.add(flor);
      }

      group.position.set(x, 0.05, z);
      group.scale.set(escalaVigor, escalaVigor, escalaVigor);
      group.userData.hojas = hojas;
      
      return group;
    };

    const plantas = [];
    const spacing = 0.8;
    for (let x = -1.5; x <= 1.5; x += spacing) {
      for (let z = -1.5; z <= 1.5; z += spacing) {
        const planta = crearPlanta(x, z);
        plantas.push(planta);
        scene.add(planta);
      }
    }
    plantasRef.current = plantas;

    const particleCount = nasaData.Clima === 'ALTO' ? 500 : nasaData.SMAP === 'Saturado' ? 200 : 0;
    if (particleCount > 0) {
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = Math.random() * 8 + 2;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }

      const particlesGeometry = new THREE.BufferGeometry();
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x3498db,
        transparent: true,
        opacity: 0.6
      });
      const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particleSystem);
      particlesRef.current = particleSystem;
    }

    crearSuelo();

    // Controles mejorados con límites
    const onMouseDown = (e) => {
      cameraControlRef.current.isDragging = true;
      cameraControlRef.current.previousMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!cameraControlRef.current.isDragging) return;

      const deltaX = e.clientX - cameraControlRef.current.previousMouse.x;
      const deltaY = e.clientY - cameraControlRef.current.previousMouse.y;

      // Rotación suave y limitada
      cameraControlRef.current.rotation.y += deltaX * 0.003;
      cameraControlRef.current.rotation.x += deltaY * 0.003;
      
      // Límites ESTRICTOS para que NO baje mucho y siempre vea el cultivo
      const ctrl = cameraControlRef.current;
      ctrl.rotation.x = Math.max(ctrl.minVertical, Math.min(ctrl.maxVertical, ctrl.rotation.x));

      cameraControlRef.current.previousMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      cameraControlRef.current.isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      // Zoom LIMITADO para que no se aleje mucho
      const ctrl = cameraControlRef.current;
      ctrl.distance = Math.max(ctrl.minDistance, Math.min(ctrl.maxDistance, ctrl.distance + e.deltaY * 0.005));
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    // Animación optimizada
    const clock = new THREE.Clock();
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const velocidadViento = nasaData.Clima === 'ALTO' ? 2 : 0.5;

      // Animar plantas suavemente
      plantasRef.current.forEach((planta) => {
        planta.rotation.z = Math.sin(elapsedTime * velocidadViento) * 0.08;
        
        if (planta.userData.hojas) {
          planta.userData.hojas.forEach((hojaData, i) => {
            hojaData.mesh.rotation.y = hojaData.angulo + Math.sin(elapsedTime * velocidadViento + i) * 0.15;
          });
        }
      });

      // Animar lluvia
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array;
        for (let i = 0; i < positions.length / 3; i++) {
          positions[i * 3 + 1] -= 0.1;
          if (positions[i * 3 + 1] < 0) {
            positions[i * 3 + 1] = 10;
          }
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Actualizar cámara con interpolación suave
      const ctrl = cameraControlRef.current;
      const targetX = ctrl.distance * Math.sin(ctrl.rotation.y) * Math.cos(ctrl.rotation.x);
      const targetY = ctrl.distance * Math.sin(ctrl.rotation.x) + 3.5;
      const targetZ = ctrl.distance * Math.cos(ctrl.rotation.y) * Math.cos(ctrl.rotation.x);
      
      // Interpolación suave para evitar saltos bruscos
      camera.position.x += (targetX - camera.position.x) * 0.1;
      camera.position.y += (targetY - camera.position.y) * 0.1;
      camera.position.z += (targetZ - camera.position.z) * 0.1;
      camera.lookAt(0, 0.6, 0); // Siempre mira el centro del cultivo

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup mejorado
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      window.removeEventListener('resize', handleResize);

      if (renderer.domElement) {
        renderer.domElement.removeEventListener('mousedown', onMouseDown);
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
        renderer.domElement.removeEventListener('mouseup', onMouseUp);
        renderer.domElement.removeEventListener('wheel', onWheel);
      }

      if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }

      renderer.dispose();
      
      plantasRef.current.forEach(planta => {
        if (planta.geometry) planta.geometry.dispose();
        if (planta.material) planta.material.dispose();
      });
      
      if (particlesRef.current) {
        if (particlesRef.current.geometry) particlesRef.current.geometry.dispose();
        if (particlesRef.current.material) particlesRef.current.material.dispose();
      }
    };
  }, [nasaData]);

  return (
    <div
      ref={mountRef}
      style={{
        height: '500px',
        width: '100%',
        border: '2px solid #34495e',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        cursor: 'grab',
        touchAction: 'none'
      }}
    />
  );
};

export default Parche3D;