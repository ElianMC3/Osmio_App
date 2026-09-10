import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const MASK_SIZE = 1024
const BRUSH_RADIUS = 120
const BASE_IMAGE = '/backgrounds/b1.png'
const REVEAL_IMAGE = '/backgrounds/b2.png'

export default function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    } catch {
      return
    }

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 1

    renderer.setSize(window.innerWidth, window.innerHeight, false)

    const updateCamera = () => {
      const aspect = window.innerWidth / window.innerHeight
      camera.left = -aspect
      camera.right = aspect
      camera.top = 1
      camera.bottom = -1
      camera.updateProjectionMatrix()
    }
    updateCamera()

    const fitCover = (plane: THREE.Mesh, texture: THREE.Texture) => {
      const img = texture.image as HTMLImageElement
      const imgAspect = img.width / img.height
      const winAspect = window.innerWidth / window.innerHeight
      if (imgAspect >= winAspect) {
        plane.scale.set(imgAspect, 1, 1)
      } else {
        plane.scale.set(winAspect, winAspect / imgAspect, 1)
      }
    }

    const maskCanvas = document.createElement('canvas')
    maskCanvas.width = MASK_SIZE
    maskCanvas.height = MASK_SIZE
    const maskCtx = maskCanvas.getContext('2d')!
    maskCtx.fillStyle = 'black'
    maskCtx.fillRect(0, 0, MASK_SIZE, MASK_SIZE)
    const maskTexture = new THREE.CanvasTexture(maskCanvas)

    const paintBrush = (x: number, y: number, dx = 0, dy = 0) => {
      const speed = Math.hypot(dx, dy)
      const angle = speed > 1 ? Math.atan2(dy, dx) : 0
      const stretch = 1 + Math.min(speed / (BRUSH_RADIUS * 0.4), 3.0)

      maskCtx.save()
      maskCtx.translate(x, y)
      maskCtx.rotate(angle)
      maskCtx.scale(stretch, 1)

      const g = maskCtx.createRadialGradient(0, 0, 0, 0, 0, BRUSH_RADIUS)
      g.addColorStop(0, 'rgba(255,255,255,1)')
      g.addColorStop(0.65, 'rgba(255,255,255,0.9)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      maskCtx.globalCompositeOperation = 'source-over'
      maskCtx.fillStyle = g
      maskCtx.beginPath()
      maskCtx.arc(0, 0, BRUSH_RADIUS, 0, Math.PI * 2)
      maskCtx.fill()
      maskCtx.restore()

      maskTexture.needsUpdate = true
    }

    let mouseNormX = 0
    let mouseNormY = 0
    let smoothX = 0
    let smoothY = 0
    let smoothZ = 0

    let prevMouse: { x: number; y: number } | null = null
    let lastMouseTime = performance.now()

    const handleMove = (clientX: number, clientY: number) => {
      lastMouseTime = performance.now()
      mouseNormX = (clientX / window.innerWidth - 0.5) * 2
      mouseNormY = -(clientY / window.innerHeight - 0.5) * 2
      const winAspect = window.innerWidth / window.innerHeight
      const worldX = ((clientX / window.innerWidth) * 2 - 1) * winAspect
      const worldY = 1 - (clientY / window.innerHeight) * 2
      const scaleX = plane2.scale.x
      const scaleY = plane2.scale.y
      const cx = ((worldX + scaleX) / (2 * scaleX)) * MASK_SIZE
      const cy = ((scaleY - worldY) / (2 * scaleY)) * MASK_SIZE
      if (prevMouse) {
        const dx = cx - prevMouse.x
        const dy = cy - prevMouse.y
        const steps = Math.max(1, Math.floor(Math.hypot(dx, dy) / (BRUSH_RADIUS * 0.25)))
        for (let i = 0; i <= steps; i++) {
          paintBrush(prevMouse.x + (dx * i) / steps, prevMouse.y + (dy * i) / steps, dx, dy)
        }
      } else {
        paintBrush(cx, cy)
      }
      prevMouse = { x: cx, y: cy }
    }

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY)
    const onMouseLeave = () => {
      prevMouse = null
    }
    const onTouchStart = (e: TouchEvent) => {
      prevMouse = null
      handleMove(e.touches[0].clientX, e.touches[0].clientY)
    }
    const onTouchMove = (e: TouchEvent) => {
      handleMove(e.touches[0].clientX, e.touches[0].clientY)
    }
    const onTouchEnd = () => {
      prevMouse = null
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    const textureLoader = new THREE.TextureLoader()

    const plane1 = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.MeshBasicMaterial(),
    )
    plane1.position.z = 0
    scene.add(plane1)

    textureLoader.load(
      BASE_IMAGE,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        plane1.material.map = tex
        plane1.material.needsUpdate = true
        fitCover(plane1, tex)
      },
      undefined,
      () => console.warn('Failed to load base background image')
    )

    const plane2Material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTexture: { value: null },
        uMask: { value: maskTexture },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform sampler2D uMask;
        uniform float uTime;
        varying vec2 vUv;

        void main() {
          // ---- REVEAL LÍQUIDO ----
          // Domain warp suave
          vec2 wUv = vUv + vec2(
            sin(vUv.y * 5.0 + uTime * 0.9) * 0.02,
            cos(vUv.x * 5.0 + uTime * 0.7) * 0.02
          );
          // Capa 1: onda lenta
          vec2 d1 = vec2(
            sin(wUv.y * 4.0 + uTime * 1.4) * cos(wUv.x * 3.0 + uTime * 1.1),
            cos(wUv.x * 3.5 + uTime * 1.3) * sin(wUv.y * 2.5 + uTime * 0.9)
          ) * 0.045;
          // Capa 2: media
          vec2 d2 = vec2(
            sin(wUv.y * 11.0 - uTime * 2.6 + wUv.x * 5.0),
            cos(wUv.x * 9.0  + uTime * 2.9 - wUv.y * 6.0)
          ) * 0.022;
          vec2 distort = d1 + d2;

          float mask = texture2D(uMask, vUv + distort).r;

          // Ruido sutil solo en el borde
          float noise =
            sin(vUv.x * 18.0 + uTime * 2.0) * cos(vUv.y * 16.0 + uTime * 1.7) * 0.22
          + sin(vUv.x * 38.0 - uTime * 3.2) * cos(vUv.y * 33.0 + uTime * 2.6) * 0.11;

          float edgeMask = smoothstep(0.05, 0.35, mask) * (1.0 - smoothstep(0.35, 0.65, mask));
          float liquidMask = mask + noise * edgeMask * 1.8;

          float alpha = smoothstep(0.45, 0.55, liquidMask);

          vec4 imgColor = texture2D(uTexture, vUv);
          vec4 revealColor = vec4(imgColor.rgb, alpha);

          // ---- WIREFRAME diagonal sweep ----
          float t = mod(uTime, 5.0) / 5.0;
          float target = t * 2.5 - 0.25;
          float dist = (vUv.x + vUv.y) - target;
          float sweepIntensity = max(0.0, 1.0 - abs(dist) / 0.1);

          vec2 grid = fract(vUv * 100.0);
          float thickness = 0.03;
          bool isLine = grid.x < thickness || grid.y < thickness || abs(grid.x - grid.y) < thickness;

          vec4 wireColor = vec4(0.0);
          if (sweepIntensity > 0.0) {
            float baseAlpha = sweepIntensity * 0.18;
            wireColor = vec4(imgColor.rgb, isLine ? sweepIntensity : baseAlpha);
          }

          // ---- COMBINAR: reveal debajo, wireframe encima ----
          gl_FragColor = mix(revealColor, wireColor, wireColor.a);
        }
      `,
    })

    const plane2 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), plane2Material)
    plane2.position.z = 0.01
    scene.add(plane2)

    textureLoader.load(
      REVEAL_IMAGE,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        plane2Material.uniforms.uTexture.value = tex
        plane2Material.needsUpdate = true
        fitCover(plane2, tex)
      },
      undefined,
      () => console.warn('Failed to load reveal background image')
    )

    const clock = new THREE.Clock()
    const lookTarget = new THREE.Vector3()

    let rafId = 0
    const tick = () => {
      const elapsedTime = clock.getElapsedTime()
      plane2Material.uniforms.uTime.value = elapsedTime

      const secondsSinceMouse = (performance.now() - lastMouseTime) / 1000
      let targetX = mouseNormX
      let targetY = mouseNormY

      if (secondsSinceMouse > 2.0) {
        const zigX = Math.sin(elapsedTime * 1.1)
        const zigY = Math.sin(elapsedTime * 0.7)

        const winAspect = window.innerWidth / window.innerHeight
        const worldX = zigX * winAspect
        const worldY = zigY
        const scaleX = plane2.scale.x
        const scaleY = plane2.scale.y
        const cx = ((worldX + scaleX) / (2 * scaleX)) * MASK_SIZE
        const cy = ((scaleY - worldY) / (2 * scaleY)) * MASK_SIZE
        paintBrush(cx, cy)
      }

      smoothX += (targetX - smoothX) * 0.06
      smoothY += (targetY - smoothY) * 0.06
      const dist = Math.sqrt(targetX * targetX + targetY * targetY)
      smoothZ += (dist - smoothZ) * 0.06

      plane1.position.x = smoothX * 0.012
      plane1.position.y = smoothY * 0.012
      plane1.position.z = -smoothZ * 0.03

      plane2.position.x = smoothX * 0.02
      plane2.position.y = smoothY * 0.02
      plane2.position.z = 0.01 + smoothZ * 0.05

      lookTarget.set(smoothX * 0.3, smoothY * 0.3, 5)
      plane1.lookAt(lookTarget)
      plane2.lookAt(lookTarget)

      maskCtx.globalCompositeOperation = 'source-over'
      maskCtx.fillStyle = 'rgba(0,0,0,0.018)'
      maskCtx.fillRect(0, 0, MASK_SIZE, MASK_SIZE)
      maskTexture.needsUpdate = true

      renderer.render(scene, camera)

      rafId = requestAnimationFrame(tick)
    }
    tick()

    const onResize = () => {
      updateCamera()
      renderer.setSize(window.innerWidth, window.innerHeight, false)
      if (plane1.material.map) fitCover(plane1, plane1.material.map)
      if (plane2Material.uniforms.uTexture.value) fitCover(plane2, plane2Material.uniforms.uTexture.value)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('resize', onResize)

      plane1.geometry.dispose()
      plane2.geometry.dispose()
      plane1.material.dispose()
      plane2Material.dispose()
      maskTexture.dispose()
      if (plane1.material.map) plane1.material.map.dispose()
      if (plane2Material.uniforms.uTexture.value) plane2Material.uniforms.uTexture.value.dispose()

      renderer.dispose()
      scene.clear()
    }
  }, [])

  return <canvas ref={canvasRef} className="cyber-background" aria-hidden="true" />
}
