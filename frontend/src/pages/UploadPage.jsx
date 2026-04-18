/**
 * UploadPage
 * ==========
 * Drag & drop PDF upload interface with animated drop zone.
 *
 * Flow: User drops PDF → calls uploadPDF() → navigates to /analysis
 * Owner: Frontend Dev 1
 */

import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadPDF } from '../services/api.js'

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleDrop = useCallback(async (e) => {
    e.preventDefault()
    setIsDragging(false)
    setError(null)

    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.')
      return
    }

    try {
      setUploading(true)
      const result = await uploadPDF(file)
      
      // Save file_id to local storage so new tabs (like Report options) can automatically load the most recent session
      localStorage.setItem('last_file_id', result.file_id)
      
      // Navigate to analysis page with file_id
      navigate('/analysis', { state: { fileId: result.file_id, filename: result.filename } })
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden" 
         style={{ background: 'radial-gradient(circle at 100% 0%, rgba(99,102,241,0.08) 0%, transparent 40%)' }}>
      
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
           style={{ backgroundImage: 'linear-gradient(var(--forensiq-border) 1px, transparent 1px), linear-gradient(90deg, var(--forensiq-border) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center z-10 animate-fade-in-up px-6 lg:px-8">
        
        {/* Left Side: Information & Separated Features */}
        <div className="flex flex-col justify-center gap-12">
          
          {/* Badge */}
          <div className="inline-flex w-fit items-center px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full shadow-sm"
               style={{ background: 'rgba(79,70,229,0.1)', color: '#4f46e5', border: '1px solid rgba(79,70,229,0.2)' }}>
            Forensic System Ready
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-5xl lg:text-6xl font-extrabold mb-8 leading-[1.1]" style={{
              background: 'linear-gradient(135deg, #0f172a 30%, #4f46e5 70%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.03em',
            }}>
              Uncover the Truth<br/>in Research.
            </h1>
            <p className="text-base leading-relaxed max-w-md" style={{ color: 'var(--forensiq-text-muted)' }}>
              A state-of-the-art forensic analysis suite. Upload a paper to trace multi-author stylistic anomalies, expose manipulated citations, and verify originality.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="flex flex-col gap-5 max-w-lg">
            {[
              { icon: '🧬', title: 'Stylometry Mapping', desc: 'Detects writing style shifts paragraph by paragraph.' },
              { icon: '📚', title: 'Citation Deep-Scan', desc: 'Identifies temporal clustering and reference anomalies.' },
              { icon: '🔍', title: 'Global Source Trace', desc: 'Cross-references content against arXiv and Semantic Scholar.' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-6 p-6 rounded-2xl transition-all duration-300 hover:shadow-md"
                   style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                <div className="text-3xl flex-shrink-0 flex items-center justify-center rounded-2xl"
                     style={{ width: 64, height: 64, background: 'rgba(79,70,229,0.07)', border: '1px solid rgba(79,70,229,0.12)' }}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--forensiq-text)' }}>{f.title}</h3>
                  <p className="text-base" style={{ color: 'var(--forensiq-text-muted)' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>



        </div>

        {/* Right Side: Modern Upload Dropzone */}
        <div className="flex justify-center lg:justify-end w-full relative group">
          
          {/* Subtle animated background glow behind the dropzone */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-5 group-hover:opacity-15 transition duration-1000 group-hover:duration-200"></div>

          <div
            id="upload-dropzone"
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={(e) => {
              if (e.currentTarget.contains(e.relatedTarget)) return;
              setIsDragging(false)
            }}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
            className={`relative w-full max-w-lg min-h-[500px] flex flex-col items-center justify-center p-10 cursor-pointer rounded-[2rem] transition-all duration-500 ease-out backdrop-blur-xl ${
              isDragging 
                ? 'bg-indigo-50/90 border-2 border-indigo-500 scale-[1.02] shadow-[0_0_20px_rgba(79,70,229,0.15)]' 
                : 'bg-white/60 border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-white/90 hover:scale-[1.01] hover:shadow-lg'
            }`}
          >
            {isDragging && <div className="absolute inset-0 rounded-[2rem] overflow-hidden"><div className="animate-scan w-full h-[3px] bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.8)]" /></div>}
            
            <input
              id="file-input"
              type="file"
              accept=".pdf"
              onChange={handleDrop}
              style={{ display: 'none' }}
            />

            {error && (
              <div className="absolute top-6 left-6 right-6 px-4 py-3 rounded-2xl text-sm font-bold z-20 shadow-lg text-center" style={{
                background: 'rgba(254,226,226,0.95)',
                color: '#b91c1c',
                backdropFilter: 'blur(8px)',
                border: '1px solid #fca5a5'
              }}>
                ⚠️ {error}
              </div>
            )}

            {uploading ? (
              <div className="flex flex-col items-center gap-8 z-10 w-full animate-fade-in-up">
                 <div className="relative">
                   <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin" />
                   <div className="absolute inset-0 flex items-center justify-center text-xl font-black text-indigo-900 animate-pulse">
                     PDF
                   </div>
                 </div>
                <div className="w-full max-w-xs text-center border p-6 rounded-2xl bg-white shadow-xl shadow-indigo-500/10 border-indigo-50">
                  <p className="text-xl font-bold mb-2 text-slate-800">Synthesizing Report</p>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full mb-3 overflow-hidden">
                    <div className="h-full bg-indigo-600 w-1/2 animate-[pulse_1s_ease-in-out_infinite]" style={{ transformOrigin: 'left', animation: 'load 2s ease-in-out infinite alternate' }} />
                  </div>
                  <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">Extracting Metadata...</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center z-10 transition-transform duration-500 group-hover:-translate-y-4">
                
                {/* Floating Icon Container */}
                <div className="relative mb-10 w-32 h-32 rounded-3xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-500 shadow-inner">
                  {/* Subtle shadow underneath icon */}
                  <div className="absolute -bottom-6 w-20 h-4 bg-indigo-900/20 blur-xl rounded-full transition-all duration-500 group-hover:bg-indigo-900/40 group-hover:w-24" />
                  
                  <div className="text-6xl text-indigo-500 group-hover:text-white transition-colors duration-500 group-hover:scale-110 ease-out">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold mb-4 text-slate-800 tracking-tight">
                  {isDragging ? 'Drop to Analyze' : 'Upload PDF Document'}
                </h2>
                
                <p className="text-lg text-slate-500 mb-8 max-w-[250px]">
                  Drag and drop your research paper here to begin forensic analysis.
                </p>

                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-semibold text-slate-700 transition-all group-hover:border-indigo-200 group-hover:text-indigo-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Browse Files
                </div>
                
                <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none rounded-b-[2rem] bg-gradient-to-t from-white/40 to-transparent" />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
