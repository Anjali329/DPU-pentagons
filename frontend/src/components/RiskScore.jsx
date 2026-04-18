/**
 * RiskScore
 * =========
 * Animated circular risk score meter (0-100).
 *
 * Props:
 *   score: number (0-100)
 *
 * Owner: Frontend Dev 2
 */

import React, { useEffect, useRef } from 'react'

export default function RiskScore({ score = 0 }) {
  const canvasRef = useRef(null)

  const getColor = (s) => {
    if (s >= 70) return '#ef4444'
    if (s >= 40) return '#f59e0b'
    return '#10b981'
  }

  const getLabel = (s) => {
    if (s >= 70) return 'High Risk'
    if (s >= 40) return 'Medium Risk'
    return 'Low Risk'
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const size = 160
    canvas.width = size * 2
    canvas.height = size * 2
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(2, 2)

    const cx = size / 2, cy = size / 2, radius = 60, lineWidth = 10
    const startAngle = 0.75 * Math.PI
    const endAngle = 2.25 * Math.PI
    
    let currentScore = 0
    let animationFrameId
    const duration = 1500 // ms
    const startTime = performance.now()

    const draw = (timestamp) => {
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1) // 0 to 1
      
      // Easing function (easeOutQuart)
      const easeProgress = 1 - Math.pow(1 - progress, 4)
      currentScore = easeProgress * score

      ctx.clearRect(0, 0, size, size)

      const color = getColor(currentScore)
      const scoreAngle = startAngle + (currentScore / 100) * (endAngle - startAngle)

      // Background arc
      ctx.beginPath()
      ctx.arc(cx, cy, radius, startAngle, endAngle)
      ctx.strokeStyle = 'rgba(30,58,95,0.4)'
      ctx.lineWidth = lineWidth
      ctx.lineCap = 'round'
      ctx.stroke()

      // Score arc
      ctx.beginPath()
      ctx.arc(cx, cy, radius, startAngle, scoreAngle)
      ctx.strokeStyle = color
      ctx.lineWidth = lineWidth
      ctx.lineCap = 'round'
      ctx.shadowColor = color
      ctx.shadowBlur = 15
      ctx.stroke()
      ctx.shadowBlur = 0

      // Score text
      ctx.fillStyle = '#e2e8f0'
      ctx.font = 'bold 36px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(Math.round(currentScore), cx, cy + 8)

      ctx.fillStyle = '#94a3b8'
      ctx.font = '12px Inter, sans-serif'
      ctx.fillText('/100', cx, cy + 26)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(draw)
      }
    }

    animationFrameId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [score])

  return (
    <div className="glass-card flex flex-col items-center justify-center col-span-1 transform transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1">
      <canvas ref={canvasRef} />
      <p className="text-sm font-semibold mt-4" style={{ color: getColor(score) }}>
        {getLabel(score)}
      </p>
      <p className="text-xs mt-1" style={{ color: 'var(--forensiq-text-muted)' }}>Overall Risk Score</p>
    </div>
  )
}
