import React from 'react';
import { useNavigate } from 'react-router-dom';

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
  const isIneligible = type === 'ineligible';

  return (
    <div className={`group bg-white border ${isIneligible ? 'border-gray-50 opacity-70' : 'border-gray-100 hover:border-blue-200 hover:shadow-md'} rounded-2xl p-5 mb-4 transition-all duration-200`}>
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

      {warning && (
        <div className="flex items-start gap-3 bg-amber-50 rounded-xl p-3 mb-4 border border-amber-100">
          <svg className="w-4 h-4 text-amber-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-[11px] font-medium text-amber-700 italic leading-relaxed">{warning}</p>
        </div>
      )}

      <div className="flex items-end justify-between border-t border-gray-50 pt-4 mt-2">
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
          onClick={() => isEligible && navigate(`/register/${id}`)}
          className={`px-5 py-2 whitespace-nowrap text-sm font-bold rounded-xl transition-all ${isEligible
            ? 'bg-[#1e293b] text-white hover:bg-[#0f172a] shadow-sm hover:shadow-md'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}>
          {isEligible ? (title.includes('Draft') ? 'Start Draft' : 'Apply Now') : 'View Criteria'}
        </button>
      </div>
    </div>
  );
};

export default GrantCard;
