/**
 * HeatmapView
 * ===========
 * D3.js-powered paragraph heatmap showing cluster assignments.
 * Each paragraph = one colored block. Hover shows preview + stats.
 *
 * Props:
 *   paragraphs: Array<{ id, text_preview, cluster, style_stats, flagged }>
 *
 * Owner: Frontend Dev 2 (D3.js)
 */

import React, { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'

const CLUSTER_COLORS = ['#3b82f6', '#f97316', '#ef4444', '#a855f7', '#10b981']

export default function HeatmapView({ paragraphs = [] }) {
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const [tooltip, setTooltip] = useState(null)
  const [modalData, setModalData] = useState(null)
  const [dimensions, setDimensions] = useState({ width: 800 })

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({ width: containerRef.current.offsetWidth })
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!paragraphs.length || !svgRef.current || !containerRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = dimensions.width
    const gap = 6
    const minCellSize = 36
    const maxCellSize = 48
    
    // Estimate optimal cell size based on width, but cap it so it looks good
    let cols = Math.max(1, Math.floor(width / (maxCellSize + gap)))
    let cellSize = maxCellSize
    // If we have many paragraphs, squeeze them a bit down to minCellSize
    if (paragraphs.length > cols) {
      cols = Math.max(1, Math.floor(width / (minCellSize + gap)))
      cellSize = Math.floor(width / cols) - gap
      if (cellSize < minCellSize) cellSize = minCellSize
    }

    const rows = Math.ceil(paragraphs.length / cols)
    const height = (rows * (cellSize + gap)) + 20

    svg.attr('width', width).attr('height', height)

    // Draw cells
    svg.selectAll('rect')
      .data(paragraphs)
      .enter()
      .append('rect')
      .attr('x', (d, i) => (i % cols) * (cellSize + gap))
      .attr('y', (d, i) => Math.floor(i / cols) * (cellSize + gap) + 10)
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('rx', 6)
      .attr('fill', d => CLUSTER_COLORS[d.cluster % CLUSTER_COLORS.length])
      .attr('opacity', d => d.flagged ? 1 : 0.6)
      .attr('stroke', d => d.flagged ? '#fff' : 'transparent')
      .attr('stroke-width', d => d.flagged ? 2 : 0)
      .style('cursor', 'pointer')
      .style('transition', 'all 0.2s ease')
      .on('mouseenter', (event, d) => {
        d3.select(event.currentTarget).attr('opacity', 1).attr('transform', 'scale(1.05)')
        const rect = event.currentTarget.getBoundingClientRect()
        setTooltip({ x: rect.left, y: rect.top - 10, data: d })
      })
      .on('mouseleave', (event, d) => {
        d3.select(event.currentTarget).attr('opacity', d.flagged ? 1 : 0.6).attr('transform', '')
        setTooltip(null)
      })
      .on('click', (event, d) => {
        setModalData(d)
        setTooltip(null)
      })

    // Paragraph labels
    svg.selectAll('text')
      .data(paragraphs)
      .enter()
      .append('text')
      .attr('x', (d, i) => (i % cols) * (cellSize + gap) + cellSize / 2)
      .attr('y', (d, i) => Math.floor(i / cols) * (cellSize + gap) + 10 + cellSize / 2 + 4)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-size', cellSize * 0.35)
      .attr('font-weight', 600)
      .style('pointer-events', 'none')
      .text(d => `P${d.id + 1}`)

  }, [paragraphs, dimensions])

  return (
    <div ref={containerRef} className="glass-card relative" style={{ padding: 20 }}>
      {/* Scrollable Container if it gets too long */}
      <div style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'hidden', scrollBehavior: 'smooth' }}>
        <svg ref={svgRef} />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-[rgba(255,255,255,0.05)]">
        {[...new Set(paragraphs.map(p => p.cluster))].sort().map(cid => (
          <div key={cid} className="flex items-center gap-2 text-xs">
            <div style={{ width: 12, height: 12, borderRadius: 3, background: CLUSTER_COLORS[cid % CLUSTER_COLORS.length] }} />
            <span style={{ color: 'var(--forensiq-text-muted)' }}>Style {String.fromCharCode(65 + cid)}</span>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: 'fixed', left: tooltip.x, top: tooltip.y - 120,
          background: 'rgba(17,24,39,0.95)', border: '1px solid var(--forensiq-border)',
          borderRadius: 12, padding: 16, maxWidth: 300, zIndex: 100,
          backdropFilter: 'blur(8px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          pointerEvents: 'none'
        }}>
          <p className="text-xs font-bold mb-1" style={{ color: CLUSTER_COLORS[tooltip.data.cluster % CLUSTER_COLORS.length] }}>
            Paragraph {tooltip.data.id + 1} — Cluster {String.fromCharCode(65 + tooltip.data.cluster)}
            {tooltip.data.flagged && <span className="ml-2">🚩 Flagged</span>}
          </p>
          <p className="text-xs" style={{ color: 'var(--forensiq-text-muted)' }}>
            {tooltip.data.text_preview?.slice(0, 120)}...
          </p>
          <p className="text-[10px] text-blue-400 mt-2">Click to view full paragraph</p>
        </div>
      )}

      {/* Paragraph Detail Modal */}
      {modalData && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
             onClick={() => setModalData(null)}>
          <div className="glass-card max-w-2xl w-full relative" style={{ background: 'rgba(15,23,42,0.95)' }}
               onClick={e => e.stopPropagation()}>
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setModalData(null)}>
              ✕
            </button>
            <h3 className="text-lg font-bold mb-4" style={{ color: CLUSTER_COLORS[modalData.cluster % CLUSTER_COLORS.length] }}>
              Paragraph {modalData.id + 1}
              {modalData.flagged && <span className="ml-2 text-sm text-red-500">🚩 Flagged Anomaly</span>}
            </h3>
            <div className="p-4 rounded-lg bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.05)] text-sm text-gray-200 leading-relaxed max-h-64 overflow-y-auto">
              {modalData.text_preview || "No content available."}
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 bg-[rgba(255,255,255,0.02)] rounded">
                 <p className="text-xs text-gray-400">Assigned Cluster</p>
                 <p className="text-sm font-semibold mt-1">Style {String.fromCharCode(65 + modalData.cluster)}</p>
              </div>
              <div className="p-3 bg-[rgba(255,255,255,0.02)] rounded">
                 <p className="text-xs text-gray-400">Word Count</p>
                 <p className="text-sm font-semibold mt-1">{modalData.text_preview?.split(' ').length || 0} words</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
