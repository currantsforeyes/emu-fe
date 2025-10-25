import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { WheelMenuItem } from '../types';
import { wheelConfig } from '../constants/wheelConfig';

interface WheelMenuProps {
  items: WheelMenuItem[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  theme: any;
}

export default function WheelMenu({ items, selectedIndex, onSelect, theme }: WheelMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const itemMeshesRef = useRef<THREE.Mesh[]>([]);
  const textureLoaderRef = useRef<THREE.TextureLoader>(new THREE.TextureLoader());
  const leftEdgeRef = useRef<number>(-1200);
  const scrollOffsetRef = useRef(selectedIndex);
  const selectedIndexRef = useRef(selectedIndex);

  // Update refs when selectedIndex changes
  useEffect(() => {
    console.log('Selection changed to:', selectedIndex);
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  const calculateLeftEdge = (width: number, height: number) => {
    const vFOV = wheelConfig.cameraFOV * (Math.PI / 180);
    const itemDistance = wheelConfig.cameraDistance;
    const visibleHeight = 2 * Math.tan(vFOV / 2) * itemDistance;
    const visibleWidth = visibleHeight * (width / height);
    const worldUnitsPerPixel = visibleWidth / width;
    const marginInWorldUnits = wheelConfig.leftMargin * worldUnitsPerPixel;
    const screenLeftEdge = -(visibleWidth / 2);
    return screenLeftEdge + marginInWorldUnits + (wheelConfig.itemWidth / 2);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(theme.background);
    sceneRef.current = scene;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(
      wheelConfig.cameraFOV,
      width / height,
      0.1,
      3000
    );
    camera.position.set(0, wheelConfig.cameraHeight, wheelConfig.cameraDistance);
    cameraRef.current = camera;

    leftEdgeRef.current = calculateLeftEdge(width, height);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = false;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    createWheelItems(scene, items);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      updateItemPositions();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      
      leftEdgeRef.current = calculateLeftEdge(newWidth, newHeight);
      camera.lookAt(0, 0, 0);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  useEffect(() => {
    if (sceneRef.current) {
      itemMeshesRef.current.forEach(mesh => {
        sceneRef.current?.remove(mesh);
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(mat => mat.dispose());
        } else {
          mesh.material.dispose();
        }
      });
      itemMeshesRef.current = [];
      
      createWheelItems(sceneRef.current, items);
    }
  }, [items]);

  const createWheelItems = (scene: THREE.Scene, items: WheelMenuItem[]) => {
    const totalItems = items.length;
    const visibleCount = Math.min(wheelConfig.visibleItems, totalItems);
    const halfVisible = Math.floor(visibleCount / 2);
    
    items.forEach((item, index) => {
      const geometry = new THREE.PlaneGeometry(
        wheelConfig.itemWidth,
        wheelConfig.itemHeight
      );

      let itemColor;
      try {
        itemColor = new THREE.Color(item.color || theme.secondary);
      } catch (e) {
        itemColor = new THREE.Color(theme.secondary);
      }

      const material = new THREE.MeshBasicMaterial({
        color: itemColor,
        transparent: true,
        opacity: 1.0,
        side: THREE.DoubleSide,
        toneMapped: false,
        depthWrite: true,
        depthTest: true
      });

      const mesh = new THREE.Mesh(geometry, material);
      
      // Calculate initial position based on current scroll
      let rawOffset = index - scrollOffsetRef.current;
      while (rawOffset > totalItems / 2) rawOffset -= totalItems;
      while (rawOffset < -totalItems / 2) rawOffset += totalItems;
      
      const isInRange = Math.abs(rawOffset) <= halfVisible + 0.5;
      
      if (isInRange) {
        const positionInWindow = rawOffset + halfVisible;
        const t = visibleCount > 1 ? positionInWindow / (visibleCount - 1) : 0.5;
        const y = (wheelConfig.verticalSpread / 2) - (t * wheelConfig.verticalSpread);
        const curveAmount = 4 * t * (1 - t);
        const x = leftEdgeRef.current + (curveAmount * wheelConfig.arcRadius);
        const z = curveAmount * 50;
        mesh.position.set(x, y, z);
        mesh.visible = true;
      } else {
        mesh.position.set(leftEdgeRef.current, 0, 0);
        mesh.visible = false;
      }
      
      const cameraPos = cameraRef.current?.position || new THREE.Vector3(0, 0, 800);
      mesh.lookAt(cameraPos);
      
      mesh.userData = { index, item };

      const textSprite = createTextSprite(item.label, theme);
      textSprite.position.set(0, 0, 1);
      mesh.add(textSprite);

      scene.add(mesh);
      itemMeshesRef.current.push(mesh);
      
      // If has icon, load it
      if (item.icon) {
        textureLoaderRef.current.load(
          item.icon,
          (texture) => {
            material.map = texture;
            material.color.setHex(0xffffff);
            material.needsUpdate = true;
          },
          undefined,
          () => {
            console.warn(`Failed to load logo for ${item.label}`);
          }
        );
      }
    });
  };

  const createTextSprite = (text: string, theme: any) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 512;
    canvas.height = 256;

    context.clearRect(0, 0, canvas.width, canvas.height);
    
    context.fillStyle = theme.text || '#ffffff';
    context.font = 'bold 64px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    context.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    context.lineWidth = 4;
    context.strokeText(text, 256, 128);
    context.fillText(text, 256, 128);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    const material = new THREE.SpriteMaterial({ 
      map: texture,
      transparent: true,
      depthTest: false
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(200, 100, 1);

    return sprite;
  };

  const updateItemPositions = () => {
    const totalItems = items.length;
    const visibleCount = Math.min(wheelConfig.visibleItems, totalItems);
    const halfVisible = Math.floor(visibleCount / 2);
    
    const prevScroll = scrollOffsetRef.current;
    
    // Calculate shortest circular path to target
    let target = selectedIndexRef.current;
    let diff = target - scrollOffsetRef.current;
    
    // Adjust target to take shortest path around the circle
    if (diff > totalItems / 2) {
      // Target is ahead but wrapping backward is shorter
      target -= totalItems;
    } else if (diff < -totalItems / 2) {
      // Target is behind but wrapping forward is shorter
      target += totalItems;
    }
    
    // Smooth scroll to target - use ref to get latest value
    scrollOffsetRef.current = THREE.MathUtils.lerp(
      scrollOffsetRef.current, 
      target,
      0.15
    );
    
    // Normalize scroll offset to stay within [0, totalItems)
    while (scrollOffsetRef.current < 0) scrollOffsetRef.current += totalItems;
    while (scrollOffsetRef.current >= totalItems) scrollOffsetRef.current -= totalItems;
    
    // Log when scroll changes significantly
    if (Math.abs(scrollOffsetRef.current - prevScroll) > 0.01) {
      console.log('Scroll offset:', scrollOffsetRef.current.toFixed(2), '-> target:', selectedIndexRef.current);
    }
    
    itemMeshesRef.current.forEach((mesh, itemIndex) => {
      // Calculate shortest circular distance from scroll position to this item
      let rawOffset = itemIndex - scrollOffsetRef.current;
      
      // Normalize to [-totalItems/2, +totalItems/2] for shortest path
      while (rawOffset > totalItems / 2) rawOffset -= totalItems;
      while (rawOffset < -totalItems / 2) rawOffset += totalItems;
      
      // Check if in visible range
      const isInRange = Math.abs(rawOffset) <= halfVisible + 0.5; // Add 0.5 buffer for smooth transitions
      
      if (!isInRange) {
        mesh.visible = false;
        return;
      }
      
      mesh.visible = true;
      
      // Map offset to position in visible window
      // Center item has offset=0, maps to middle slot
      const positionInWindow = rawOffset + halfVisible;
      
      // Calculate normalized position (0 to 1)
      const t = visibleCount > 1 ? positionInWindow / (visibleCount - 1) : 0.5;
      
      // Calculate target position
      const targetY = (wheelConfig.verticalSpread / 2) - (t * wheelConfig.verticalSpread);
      const curveAmount = 4 * t * (1 - t);
      const targetX = leftEdgeRef.current + (curveAmount * wheelConfig.arcRadius);
      const targetZ = curveAmount * 50;
      
      // Smooth interpolation
      mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, targetX, 0.15);
      mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, targetY, 0.15);
      mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, targetZ, 0.15);
      
      // Selection effects - check if close to center
      const isSelected = Math.abs(rawOffset) < 0.1;
      
      const targetScale = isSelected ? wheelConfig.selectedScale : 1;
      const currentScale = mesh.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.15);
      mesh.scale.set(newScale, newScale, 1);

      const material = mesh.material as THREE.MeshBasicMaterial;
      const targetOpacity = isSelected ? 1 : wheelConfig.unselectedOpacity;
      material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, 0.1);
      material.transparent = true;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const newIndex = selectedIndex === 0 ? items.length - 1 : selectedIndex - 1;
        console.log('Arrow Up pressed: moving from', selectedIndex, 'to', newIndex);
        onSelect(newIndex);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const newIndex = selectedIndex === items.length - 1 ? 0 : selectedIndex + 1;
        console.log('Arrow Down pressed: moving from', selectedIndex, 'to', newIndex);
        onSelect(newIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, items, onSelect]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }}
    />
  );
}
