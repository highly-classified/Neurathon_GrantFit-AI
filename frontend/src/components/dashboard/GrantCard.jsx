import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, X } from 'lucide-react';

const GrantCard = ({
  id,
  title,
  org,
  tags,
  funding,
  deadline,
  deadlineUrgent,
  type = 'eligible',
  warning
}) => {
  const navigate = useNavigate();
  const isEligible = type === 'eligible';
  const isMaybe = type === 'maybe';
  const isIneligible = type === 'ineligible';

  const statusBorderClass = isIneligible
    ? 'border-l-gray-300'
    : isMaybe
      ? 'border-l-indigo-500/80'
      : 'border-l-emerald-500/80';

  const borderClass = isIneligible
    ? 'border-gray-50 opacity-70'
    : isMaybe
      ? 'border-blue-100/50 hover:border-blue-200 hover:shadow-md'
      : 'border-green-100/50 hover:border-green-200 hover:shadow-md';

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className={`group bg-white border ${borderClass} ${statusBorderClass} border-l-4 rounded-2xl p-5 mb-4 transition-all duration-200 shadow-sm hover:shadow-lg flex flex-col h-full`}>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-[#0f172a] group-hover:text-blue-600 transition-colors leading-tight mb-1">{title}</h3>
                <p className="text-sm text-gray-400 font-medium mb-3">{org}</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-0.5 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wide rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {isIneligible && (
              <div className="px-2.5 py-1 bg-gray-50 text-gray-400 text-[10px] font-bold rounded uppercase">Ineligible</div>
            )}
          </div>
        </div>

        <div className="flex items-end justify-between border-t border-gray-50 pt-4 mt-auto">
          <div className="flex gap-8">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Funding</p>
              <p className="text-sm font-bold text-[#1e293b]">{funding}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Deadline</p>
              <p className={`text-sm font-bold ${deadlineUrgent ? 'text-red-500' : 'text-[#1e293b]'}`}>{deadline}</p>
            </div>
          </div>

          <button
            onClick={() => isEligible ? navigate(`/register/${id}`, { state: { org, title } }) : setIsModalOpen(true)}
            className={`px-5 py-2 whitespace-nowrap text-sm font-bold rounded-xl transition-all ${isEligible
              ? 'bg-[#1e293b] text-white hover:bg-[#0f172a] shadow-sm hover:shadow-md'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}>
            {isEligible ? (title.includes('Draft') ? 'Start Draft' : 'Apply Now') : 'View Criteria'}
          </button>
        </div>
      </div>

      {/* Criteria Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                    <AlertTriangle className="size-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Eligibility Criteria</h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-6">
                <div className="flex items-start gap-4">
                  <div className="text-xl mt-0.5">❗</div>
                  <p className="text-base font-medium text-amber-900 leading-relaxed italic">
                    {warning || "Additional criteria may apply. Please contact our support for details."}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
              >
                Got it
              </button>
            </div>
          </div>
          {/* Backdrop click to close */}
          <div className="absolute inset-0 -z-10" onClick={() => setIsModalOpen(false)}></div>
        </div>
      )}
    </>
  );
};

export default GrantCard;
