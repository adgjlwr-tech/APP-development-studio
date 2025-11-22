import React, { useState } from 'react';
import { GeneratedBook } from '../types';
import { downloadPDF } from '../services/pdfService';
import { ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface BookPreviewProps {
  book: GeneratedBook;
  onReset: () => void;
}

export const BookPreview: React.FC<BookPreviewProps> = ({ book, onReset }) => {
  const [activeTab, setActiveTab] = useState<'cover' | 'pages'>('cover');

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-indigo-100">
      {/* Header Actions */}
      <div className="bg-indigo-50 p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-indigo-100">
        <div>
          <h2 className="text-3xl font-bold text-indigo-900">Ready to Color!</h2>
          <p className="text-indigo-600">Created for {book.childName}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 text-indigo-700 bg-white rounded-xl hover:bg-indigo-50 border-2 border-indigo-200 transition-colors font-bold"
          >
            <ArrowPathIcon className="w-5 h-5" />
            New Book
          </button>
          <button
            onClick={() => downloadPDF(book)}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform hover:scale-105 font-bold"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Preview Tabs */}
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setActiveTab('cover')}
          className={`flex-1 py-4 text-lg font-bold transition-colors ${
            activeTab === 'cover' 
              ? 'text-indigo-600 border-b-4 border-indigo-600 bg-indigo-50/50' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Cover Page
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`flex-1 py-4 text-lg font-bold transition-colors ${
            activeTab === 'pages' 
              ? 'text-indigo-600 border-b-4 border-indigo-600 bg-indigo-50/50' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Coloring Pages ({book.pages.length})
        </button>
      </div>

      {/* Content */}
      <div className="p-8 bg-slate-50 min-h-[500px]">
        {activeTab === 'cover' ? (
          <div className="max-w-md mx-auto bg-white p-6 shadow-lg border-2 border-slate-200 aspect-[1/1.41] flex flex-col relative">
            {/* Simulated PDF Layout for Cover */}
            <div className="text-center mt-8 mb-4">
              <h1 className="text-4xl font-bold font-serif text-slate-900">My Coloring Book</h1>
            </div>
            <div className="flex-1 flex items-center justify-center p-4 border-2 border-dashed border-slate-100 m-4">
              <img 
                src={book.coverImage} 
                alt="Cover Art" 
                className="max-w-full max-h-full object-contain grayscale contrast-125"
              />
            </div>
            <div className="text-center mb-12">
              <p className="text-2xl text-slate-800">For {book.childName}</p>
              <p className="text-sm text-slate-400 mt-2 uppercase tracking-widest">{book.theme}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {book.pages.map((page, idx) => (
              <div key={idx} className="bg-white p-4 shadow-md border border-slate-200 rounded-lg">
                <div className="aspect-[1/1.41] w-full flex items-center justify-center bg-white overflow-hidden mb-2 border border-slate-100">
                  <img 
                    src={page} 
                    alt={`Page ${idx + 1}`} 
                    className="max-w-full max-h-full object-contain grayscale contrast-125 hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-center text-slate-400 font-bold text-sm">Page {idx + 1}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
