import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { generateVisaChecklistPDF } from '../../utils/pdfTicketGenerator';
import { 
  ShieldCheck, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Download, 
  AlertTriangle, 
  ExternalLink,
  Sparkles,
  Plane 
} from 'lucide-react';

export const Screen13_Visa: React.FC = () => {
  const { userProfile, activeTrip } = useTravel();

  const [passportNationality, setPassportNationality] = useState(userProfile.passportCountry || 'India');
  const [destination, setDestination] = useState('UAE (Dubai / Abu Dhabi)');

  const visa = activeTrip.visaRequirements;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 select-none animate-page-enter">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold border border-cyan-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Screen 13 • Visa & Travel Documents Guide</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-midnight-navy dark:text-white">
          Immigration & Document Guidance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Synchronized with IATA Timatic standards for {passportNationality} passports travelling to {destination}.
        </p>
      </div>

      {/* Main Visa Status Card */}
      <div className="theme-card p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
              Official Visa Classification
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-midnight-navy dark:text-white mt-0.5">
              {visa.type}
            </h2>
            <p className="text-xs text-slate-400">{visa.validity}</p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Government Fee</span>
            <div className="text-2xl font-black text-ai-purple">₹{visa.costINR.toLocaleString()}</div>
            <span className="text-[10px] text-emerald-500 font-semibold block">Processing: {visa.processingDays}</span>
          </div>
        </div>

        {/* Special Exemption / Visa On Arrival Notice */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-1">
          <div className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Special Visa on Arrival Rule for Indian Passports:</span>
          </div>
          <p className="text-[11px] leading-relaxed">{visa.notes}</p>
        </div>

        {/* Mandatory Checklist */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-midnight-navy dark:text-white uppercase tracking-wider">
            Mandatory Documents Checklist
          </h3>
          <div className="space-y-2">
            {visa.documents.map((doc, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="font-medium text-slate-700 dark:text-slate-200">{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => generateVisaChecklistPDF()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-midnight-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <Download className="w-4 h-4 text-ai-purple" />
            <span>Download PDF Checklist</span>
          </button>

          <a
            href="https://smartservices.icp.gov.ae"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary-gradient px-6 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5"
          >
            <span>Apply via Official ICP Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
