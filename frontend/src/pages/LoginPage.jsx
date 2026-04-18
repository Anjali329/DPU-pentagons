import React from 'react';
import { SignIn } from '@clerk/clerk-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{
      background: '#0a0e1a',
    }}>
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(99, 102, 241, 0.15)' }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(139, 92, 246, 0.15)' }}></div>
      
      <div className="relative z-10 w-full max-w-md p-6 flex flex-col items-center">
        {/* Logo/Branding */}
        <div className="flex items-center gap-3 mb-8">
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 800, color: '#fff',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)'
          }}>F</div>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.02em' }}>
            Forens<span style={{ color: '#6366f1' }}>IQ</span>
          </span>
        </div>

        <p className="text-slate-400 text-center mb-8">
          Please sign in to access the Academic Integrity Analyzer.
        </p>

        {/* Clerk Sign In component styled for dark mode */}
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-indigo-500 hover:bg-indigo-600 text-sm normal-case",
              card: "bg-[#111827] border border-slate-800 shadow-2xl",
              headerTitle: "text-slate-200",
              headerSubtitle: "text-slate-400",
              socialButtonsBlockButton: "border-slate-700 hover:bg-slate-800 text-slate-300",
              socialButtonsBlockButtonText: "text-slate-300",
              dividerLine: "bg-slate-700",
              dividerText: "text-slate-500",
              formFieldLabel: "text-slate-300",
              formFieldInput: "bg-slate-900 border-slate-700 text-slate-200",
              footerActionText: "text-slate-400",
              footerActionLink: "text-indigo-400 hover:text-indigo-300",
            }
          }}
          routing="path" 
          path="/login" 
          redirectUrl="/" 
        />
      </div>
    </div>
  );
}
