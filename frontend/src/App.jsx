import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import UploadPage from './pages/UploadPage.jsx'
import AnalysisPage from './pages/AnalysisPage.jsx'
import ReportPage from './pages/ReportPage.jsx'

function Navbar() {
  const location = useLocation()
  const [reportOpen, setReportOpen] = React.useState(false)
  const reportRef = React.useRef(null)

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(e) {
      if (reportRef.current && !reportRef.current.contains(e.target)) {
        setReportOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navItems = [
    { 
      path: '/', 
      label: 'Upload', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
      ) 
    },
    { 
      path: '/dashboard', 
      label: 'Analysis', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
      ) 
    },
  ]

  const isReportActive = location.pathname === '/report' || location.pathname.startsWith('/report/')

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-[1400px] transition-all duration-300">
      <div className="flex items-center justify-between w-full px-6 md:px-10 lg:px-12 py-3 rounded-[2rem]" style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.08)'
      }}>
        
        {/* Left: Brand Logo */}
        <Link to="/" className="flex items-center justify-start gap-3 no-underline group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-[14px] bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-[1.1rem] shadow-[0_8px_16px_rgba(99,102,241,0.3)] transition-transform duration-300 group-hover:scale-105">
            F
            <div className="absolute inset-0 rounded-[14px] border border-white/20" />
          </div>
          <span className="text-xl font-extrabold text-slate-800 tracking-tight">
            Forens<span className="text-indigo-600">IQ</span>
          </span>
        </Link>
        
        {/* Right: Navigation Links */}
        <div className="flex items-center justify-end gap-[60px] sm:gap-[120px] p-2.5 pr-4 sm:pr-8 mr-4 sm:mr-10 rounded-full shadow-inner" style={{ background: 'rgba(241,245,249,0.7)', border: '1px solid rgba(0,0,0,0.03)' }}>
          
          {/* Upload & Analysis links */}
          {navItems.map(item => {
            const isActive = location.pathname === item.path
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className="relative shrink-0 whitespace-nowrap flex items-center gap-4 px-8 sm:px-12 py-3 rounded-full text-base font-bold tracking-wide no-underline transition-all duration-300 z-10"
                style={{ color: '#4f46e5' }}
              >
                {isActive && (
                  <span className="absolute inset-0 bg-white rounded-full shadow-[0_2px_10px_-2px_rgba(0,0,0,0.08)] border border-slate-200/60 -z-10" />
                )}
                <span className="shrink-0 flex items-center justify-center text-indigo-600">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}

          {/* Report Link */}
          <Link
            to="/report"
            target="_blank"
            className="relative shrink-0 whitespace-nowrap flex items-center gap-4 px-8 sm:px-12 py-3 rounded-full text-base font-bold tracking-wide no-underline transition-all duration-300 z-10"
            style={{ color: '#4f46e5' }}
          >
            {isReportActive && (
              <span className="absolute inset-0 bg-white rounded-full shadow-[0_2px_10px_-2px_rgba(0,0,0,0.08)] border border-slate-200/60 -z-10" />
            )}
            <span className="shrink-0 flex items-center justify-center text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </span>
            <span>Report</span>
          </Link>

        </div>

      </div>
    </nav>
  )
}

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen">
        {/* Ambient 3D Depth Orbs */}
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
        <div className="ambient-orb orb-3" />

        <Navbar />
        <main className="relative z-10" style={{ paddingTop: 100 }}>
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/dashboard" element={<ReportPage forceView="view" />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/report/:fileId" element={<ReportPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
