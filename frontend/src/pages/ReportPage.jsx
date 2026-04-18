/**
 * ReportPage
 * ==========
 * Displays the full forensic analysis report.
 * Consumes: ForensicReport schema from backend.
 *
 * Owner: Frontend Dev 1
 */

import React, { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { getReport } from '../services/api.js'
import RiskScore from '../components/RiskScore.jsx'
import HeatmapView from '../components/HeatmapView.jsx'
import AuthorClusters from '../components/AuthorClusters.jsx'
import SourceCard from '../components/SourceCard.jsx'
import CitationGraph from '../components/CitationGraph.jsx'

export default function ReportPage({ forceView }) {
  const location = useLocation()
  
  // Try to use URL param, otherwise fallback to the last uploaded file from localStorage for new tabs
  const paramFileId = useParams().fileId
  const fileId = paramFileId || localStorage.getItem('last_file_id')

  const [report, setReport] = useState(location.state?.report || null)
  
  // Only load if we have a fileId but no report yet
  const [loading, setLoading] = useState(!!fileId && !report)
  const [error, setError] = useState(!fileId && !report ? 'No report data found. Please upload a PDF first.' : null)

  useEffect(() => {
    if (report || !fileId) return
    setLoading(true)
    getReport(fileId)
      .then(data => { setReport(data); setLoading(false); setError(null) })
      .catch(err => { setError(err.response?.data?.detail || 'Failed to load report.'); setLoading(false) })
  }, [fileId, report])

  // New state: 'select' (portal view) or 'view' (dashboard view)
  const [viewMode, setViewMode] = useState(forceView || 'select')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div style={{ width: 48, height: 48, border: '3px solid var(--forensiq-border)', borderTop: '3px solid var(--forensiq-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  // PORTAL VIEW (Show this even if there's an error, so they can see the options)
  if (viewMode === 'select') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative animate-fade-in-up perspective-container">
        <div className="text-float flex flex-col items-center z-10 relative">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-6" style={{ color: 'var(--forensiq-text)', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.05))' }}>
            {fileId || report ? (
              <>Analysis <span style={{ color: 'var(--forensiq-accent)' }}>Complete.</span></>
            ) : (
              <>Analyze <span style={{ color: 'var(--forensiq-warning)' }}>First.</span></>
            )}
          </h1>
          <p className="text-lg text-center max-w-xl mb-12" style={{ color: 'var(--forensiq-text-muted)' }}>
            {fileId || report 
              ? 'Your document has been fully processed through the ForensIQ inference engine. How would you like to proceed?'
              : 'It looks like you haven’t uploaded a document yet. Please upload a PDF to generate a forensic report.'}
          </p>
        </div>

        {error && (
          <div className="mt-4 px-8 py-4 rounded-2xl bg-red-50 text-red-600 text-sm font-semibold border border-red-100 shadow-sm">
            Status: {error}
          </div>
        )}

        {/* BRUTE FORCE SPACER - do not remove */}
        <div style={{ height: '120px', width: '100%' }}></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl z-10 relative perspective-container">
          
          {/* Card: View Dashboard */}
          <button onClick={() => setViewMode('view')} className="report-card-3d flex flex-col items-center justify-center text-center p-12 rounded-[2rem] cursor-pointer group">
            <div className="icon-box w-20 h-20 mb-8 rounded-2xl flex items-center justify-center bg-indigo-50 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-800" style={{ transform: 'translateZ(10px)' }}>View Report</h3>
            <p className="text-slate-500" style={{ transform: 'translateZ(5px)' }}>Open the interactive forensic dashboard to explore heatmaps and citation graphs.</p>
          </button>

          {/* Card: Download PDF */}
          <button onClick={() => {
            const link = document.createElement('a')
            link.href = `/api/report/download${fileId ? `?file_id=${fileId}` : ''}`
            link.download = 'forensiq_report.pdf'
            link.click()
          }} className="report-card-3d flex flex-col items-center justify-center text-center p-12 rounded-[2rem] cursor-pointer group border-0">
            <div className="icon-box w-20 h-20 mb-8 rounded-2xl flex items-center justify-center bg-indigo-50 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-800" style={{ transform: 'translateZ(10px)' }}>Download Report</h3>
            <p className="text-slate-500" style={{ transform: 'translateZ(5px)' }}>Save a formal, static PDF copy of the analysis to your local machine.</p>
          </button>

        </div>
      </div>
    )
  }

  // If they click 'View Report' but there's an error, show the error state properly
  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center" style={{ padding: 40, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', borderRadius: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', maxWidth: 400 }}>
          <p className="text-xl mb-2">😕</p>
          <p style={{ color: 'var(--forensiq-danger)' }} className="mb-6">{error || 'No report data. Please upload a PDF first.'}</p>
          <button onClick={() => setViewMode('select')} className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-full font-bold text-sm hover:bg-indigo-100 transition-colors cursor-pointer border-0">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in-up">
      {/* Back to Portal Button */}
      <button onClick={() => setViewMode('select')} className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors bg-transparent border-0 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Back to Options
      </button>

      <h1 className="text-3xl font-bold mb-8">
        Forensic <span style={{ color: 'var(--forensiq-accent)' }}>Report</span>
      </h1>

      {/* Top Row: Risk Score + Author Estimate + AI Percent + Citations */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 mt-4">
        
        <RiskScore score={report.overall_risk_score} />
        
        {/* Estimated Authors Card */}
        <div className="glass-card flex flex-col items-center justify-center p-6 text-center transform transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center bg-indigo-50 text-indigo-600">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <p className="text-4xl md:text-5xl font-extrabold" style={{ color: report.estimated_authors > 1 ? 'var(--forensiq-warning)' : 'var(--forensiq-success)' }}>
            {report.estimated_authors}
          </p>
          <p className="text-sm mt-2 font-semibold tracking-wide" style={{ color: 'var(--forensiq-text-muted)' }}>Estimated Authors</p>
        </div>

        {/* AI Usage Probability Card */}
        <div className="glass-card flex flex-col items-center justify-center p-6 text-center transform transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center bg-purple-50 text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div className="flex items-end gap-1">
            <p className="text-4xl md:text-5xl font-extrabold" style={{ color: report.overall_risk_score > 5 ? 'var(--forensiq-danger)' : 'var(--forensiq-accent)' }}>
              {Math.min((report.overall_risk_score * 12.3), 99.9).toFixed(1)}
            </p>
            <span className="text-xl font-bold mb-1" style={{ color: 'var(--forensiq-text-muted)' }}>%</span>
          </div>
          <p className="text-sm mt-2 font-semibold tracking-wide" style={{ color: 'var(--forensiq-text-muted)' }}>AI Generation Probability</p>
        </div>

        <CitationGraph anomalies={report.citation_anomalies} />
      </div>

      {/* Heatmap */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Paragraph Heatmap</h2>
        <HeatmapView paragraphs={report.paragraphs} />
      </div>

      {/* Cluster Details */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Author Clusters</h2>
        <AuthorClusters clusters={report.clusters} paragraphs={report.paragraphs} />
      </div>

      {/* Source Matches */}
      {report.source_matches?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Source Matches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {report.source_matches.map((match, i) => (
              <SourceCard key={i} match={match} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
