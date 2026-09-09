import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './GlobeBackdrop.css'

const CONFIG = {
  opacity: 0.32,
  color: '#38bdf8',
  glowColor: '#7dd3fc',
  lineWidth: 1,
  rotationSpeed: 0.0002,
  tilt: 23.5,
  glow: true,
}

function GlobeBackdrop() {
  const containerRef = useRef(null)
  const requestRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let renderer

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
    camera.position.z = 1200

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    const size = Math.max(container.clientWidth, 1)
    renderer.setSize(size, size)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const globeGroup = new THREE.Group()
    scene.add(globeGroup)

    const tiltInRadians = (CONFIG.tilt * Math.PI) / 180
    globeGroup.rotation.z = tiltInRadians

    const geometry = new THREE.SphereGeometry(400, 36, 36)
    const wireframeGeometry = new THREE.WireframeGeometry(geometry)

    const lineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(CONFIG.color),
      transparent: true,
      opacity: CONFIG.opacity,
      linewidth: CONFIG.lineWidth,
    })

    const globeLines = new THREE.LineSegments(wireframeGeometry, lineMaterial)
    globeGroup.add(globeLines)

    if (CONFIG.glow) {
      const glowMaterial = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
            gl_FragColor = vec4(${new THREE.Color(CONFIG.glowColor).r}, ${new THREE.Color(CONFIG.glowColor).g}, ${new THREE.Color(CONFIG.glowColor).b}, 1.0) * intensity * 0.04;
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      })

      const glowSphere = new THREE.Mesh(geometry, glowMaterial)
      glowSphere.scale.set(1.002, 1.002, 1.002)
      globeGroup.add(glowSphere)
    }

    function animate() {
      requestRef.current = requestAnimationFrame(animate)
      globeGroup.rotation.y += CONFIG.rotationSpeed
      renderer.render(scene, camera)
    }

    animate()

    function handleResize() {
      if (!container) return
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      if (newWidth > 0 && newHeight > 0) {
        camera.aspect = newWidth / newHeight
        camera.updateProjectionMatrix()
        renderer.setSize(newWidth, newHeight)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(requestRef.current)
      renderer.dispose()
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose())
          } else {
            obj.material.dispose()
          }
        }
      })
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="globe-backdrop" aria-hidden="true" />
}

export default GlobeBackdrop
