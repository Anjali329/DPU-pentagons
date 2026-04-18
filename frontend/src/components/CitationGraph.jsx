/**
 * CitationGraph
 * =============
 * Displays citation anomaly indicators.
 *
 * Props:
 *   anomalies: { temporal_anomaly, topic_mismatch, self_citation_anomaly, score, details }
 *
 * Owner: Frontend Dev 2
 */

import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'

const CHECKS = [
  { key: 'temporal_anomaly', label: 'Temporal Consistency', icon: '📅', desc: 'Citation years are evenly distributed' },
  { key: 'topic_mismatch', label: 'Topic Coherence', icon: '🧩', desc: 'Citations match the paper topic throughout' },
  { key: 'self_citation_anomaly', label: 'Self-Citation Pattern', icon: '🔁', desc: 'Self-citation rate is within normal range' },
]

// Mock data demonstrating the anomaly (old citations vs brand new citations)
const MOCK_YEARS_DATA = [
  { year: 1995, count: 15 },
  { year: 1996, count: 4 },
  { year: 2000, count: 1 },
  { year: 2005, count: 2 },
  { year: 2010, count: 1 },
  { year: 2020, count: 3 },
  { year: 2022, count: 10 },
  { year: 2023, count: 22 },
]

function TemporalTimeline({ hasAnomaly }) {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = svgRef.current.parentElement.offsetWidth || 300
    const height = 60
    const margin = { top: 10, right: 10, bottom: 20, left: 10 }

    svg.attr('width', width).attr('height', height)

    const x = d3.scaleLinear()
      .domain([1990, 2025])
      .range([margin.left, width - margin.right])

    const maxCount = d3.max(MOCK_YEARS_DATA, d => d.count)
    const y = d3.scaleLinear()
      .domain([0, maxCount])
      .range([height - margin.bottom, margin.top])

    // Draw bars
    svg.selectAll('rect')
      .data(MOCK_YEARS_DATA)
      .enter()
      .append('rect')
      .attr('x', d => x(d.year) - 4)
      .attr('y', d => y(d.count))
      .attr('width', 8)
      .attr('height', d => height - margin.bottom - y(d.count))
      .attr('fill', d => hasAnomaly && (d.year < 1998 || d.year > 2020) ? 'var(--forensiq-danger)' : 'var(--forensiq-accent)')
      .attr('rx', 2)

    // Axis
    const xAxis = d3.axisBottom(x).tickValues([1995, 2005, 2015, 2023]).tickFormat(d3.format("d")).tickSize(4)
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .style('color', 'var(--forensiq-text-muted)')
      .selectAll('text')
      .style('font-size', '10px')
      .style('font-family', 'Inter, sans-serif')
    
    // Remove domain line inside axis
    svg.select('.domain').remove()

  }, [hasAnomaly])

  return (
    <div className="mt-3 w-full" style={{ height: 60 }}>
      {hasAnomaly && <p className="text-[10px] mb-1" style={{ color: 'var(--forensiq-danger)' }}>Warning: Clustered citations in 1995 and 2023</p>}
      <svg ref={svgRef} />
    </div>
  )
}


export default function CitationGraph({ anomalies = {} }) {
  const score = anomalies.score || 0

  return (
    <div className="glass-card flex flex-col justify-between h-full">
      <div>
        <h3 className="text-sm font-semibold mb-4">Citation Health</h3>
        <div className="flex flex-col gap-4">
          {CHECKS.map(check => {
            const hasAnomaly = anomalies[check.key]
            return (
              <div key={check.key} className="flex flex-col border-b border-[rgba(255,255,255,0.05)] pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0,
                    background: hasAnomaly ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                    border: `1px solid ${hasAnomaly ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
                  }}>
                    {hasAnomaly ? '⚠️' : '✓'}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium" style={{ color: hasAnomaly ? 'var(--forensiq-danger)' : 'var(--forensiq-success)' }}>
                      {check.label}
                    </p>
                    <p className="text-[11px]" style={{ color: 'var(--forensiq-text-muted)' }}>{check.desc}</p>
                  </div>
                </div>
                {check.key === 'temporal_anomaly' && (
                  <TemporalTimeline hasAnomaly={hasAnomaly} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Anomaly Score Bar */}
      <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.05)]">
        <div className="flex justify-between text-xs mb-2">
          <span style={{ color: 'var(--forensiq-text-muted)' }}>Anomaly Score</span>
          <span className="font-mono font-bold">{(score * 100).toFixed(0)}%</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: 'var(--forensiq-surface-2)' }}>
          <div style={{
            height: '100%', borderRadius: 3,
            background: score > 0.5 ? 'var(--forensiq-danger)' : score > 0.2 ? 'var(--forensiq-warning)' : 'var(--forensiq-success)',
            width: `${score * 100}%`, transition: 'width 1s ease-out',
            boxShadow: `0 0 10px ${score > 0.5 ? 'var(--forensiq-danger)' : score > 0.2 ? 'var(--forensiq-warning)' : 'var(--forensiq-success)'}40`
          }} />
        </div>
      </div>
    </div>
  )
}
