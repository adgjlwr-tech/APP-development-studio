
import React, { useState } from 'react';
import { GeneratedBook, GenerationState } from './types';
import { generateColoringBookImages } from './services/geminiService';
import { LoadingState } from './components/LoadingState';
import { BookPreview } from './components/BookPreview';
import { SparklesIcon, PencilIcon } from '@heroicons/react/24/solid';

const App: React.FC = () => {
  const [childName, setChildName] = useState('');
  const [theme, setTheme] = useState('');
  const [generationState, setGenerationState] = useState<GenerationState>({ status: 'idle' });
  const [book, setBook] = useState<GeneratedBook | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim() || !theme.trim()) return;

    setGenerationState({ status: 'generating', progress: 0 });

    try {
      const { cover, pages } = await generateColoringBookImages(
        theme,
        (completed, total) => {
          setGenerationState({
            status: 'generating',
            progress: (completed / total) * 100
          });
        }
      );

      setBook({
        coverImage: cover,
        pages: pages,
        theme: theme,
        childName: childName
      });
      setGenerationState({ status: 'complete' });
    } catch (error) {
      setGenerationState({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Something went wrong' 
      });
    }
  };

  const resetApp = () => {
    setBook(null);
    setGenerationState({ status: 'idle' });
    setTheme('');
    setChildName('');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* Navigation / Header */}
      <nav className="max-w-6xl mx-auto mb-12 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white">
          <PencilIcon className="w-6 h-6" />
        </div>
        <span className="text-2xl font-bold text-indigo-900 tracking-tight">ColorMyWorld</span>
      </nav>

      <main className="max-w-6xl mx-auto">
        {generationState.status === 'idle' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-slate-900 mb-4 leading-tight">
                Create Your Own <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                  Magical Coloring Book
                </span>
              </h1>
              <p className="text-lg text-slate-600">
                Turn any idea into a printable PDF coloring book in seconds.
                Perfect for rainy days and creative kids!
              </p>
            </div>

            <form onSubmit={handleGenerate} className="bg-white p-8 rounded-3xl shadow-xl border border-indigo-50 space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-bold text-slate-700 ml-1">
                  Who is this book for?
                </label>
                <input
                  id="name"
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="e.g. Leo"
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="theme" className="block text-sm font-bold text-slate-700 ml-1">
                  What should we draw?
                </label>
                <input
                  id="theme"
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="e.g. Space Dinosaurs, Underwater Castles, Racing Cats"
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transform transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <SparklesIcon className="w-6 h-6 text-indigo-200" />
                Generate Coloring Book
              </button>
            </form>

            {/* Examples */}
            <div className="mt-12 text-center">
              <p className="text-slate-400 text-sm mb-4 uppercase tracking-widest font-bold">Try these ideas</p>
              <div className="flex flex-wrap justify-center gap-3">
                {['Robots having a tea party', 'Fairy treehouse village', 'Super hero hamsters', 'Candy land adventure'].map((idea) => (
                  <button
                    key={idea}
                    onClick={() => setTheme(idea)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors text-sm font-medium"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {generationState.status === 'generating' && (
          <div className="max-w-lg mx-auto mt-20">
            <LoadingState 
              progress={generationState.progress || 0} 
              theme={theme} 
            />
          </div>
        )}

        {generationState.status === 'error' && (
          <div className="max-w-md mx-auto mt-20 text-center bg-white p-8 rounded-3xl shadow-xl border border-red-100">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              !
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Oops! Something went wrong.</h3>
            <p className="text-slate-500 mb-6">{generationState.message}</p>
            <button
              onClick={() => setGenerationState({ status: 'idle' })}
              className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {generationState.status === 'complete' && book && (
          <BookPreview book={book} onReset={resetApp} />
        )}
      </main>
    </div>
  );
};

export default App;
