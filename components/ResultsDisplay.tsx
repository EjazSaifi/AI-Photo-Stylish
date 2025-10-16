
import React from 'react';
import { GeneratedData } from '../types';

interface ResultsDisplayProps {
  originalImage: string;
  generatedImage: string;
  data: GeneratedData;
  onSuggestionClick: (suggestion: string) => void;
  onReset: () => void;
}

const SuggestionPills: React.FC<{ suggestions: string[], onClick: (suggestion: string) => void }> = ({ suggestions, onClick }) => (
    <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
            <button
                key={s}
                onClick={() => onClick(s)}
                className="px-3 py-1.5 text-sm bg-gray-700/50 text-purple-300 rounded-full hover:bg-brand-purple hover:text-white transition-colors duration-300"
            >
                {s}
            </button>
        ))}
    </div>
);


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ originalImage, generatedImage, data, onSuggestionClick, onReset }) => {
  return (
    <div className="animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
                <h3 className="text-center text-xl font-semibold mb-3 text-gray-300">Original</h3>
                <img src={originalImage} alt="Original" className="w-full h-auto object-contain rounded-lg shadow-lg border-2 border-gray-700"/>
            </div>
            <div>
                <h3 className="text-center text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
                    Styled
                </h3>
                <img src={generatedImage} alt="Generated" className="w-full h-auto object-contain rounded-lg shadow-2xl border-2 border-brand-purple"/>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gray-900/40 p-6 rounded-lg">
            <div className="space-y-6">
                <div>
                    <h4 className="font-semibold text-lg text-purple-300 mb-2">Caption Suggestion</h4>
                    <p className="text-gray-200 italic">"{data.caption}"</p>
                </div>
                <div>
                    <h4 className="font-semibold text-lg text-purple-300 mb-2">Hashtag Ideas</h4>
                    <p className="text-gray-400">{data.hashtags.map(h => `#${h}`).join(' ')}</p>
                </div>
            </div>
             <div className="space-y-4">
                <h4 className="font-semibold text-lg text-purple-300 mb-2">Try these next:</h4>
                <SuggestionPills suggestions={data.relatedPrompts} onClick={onSuggestionClick}/>
            </div>
        </div>

        <div className="text-center mt-8">
             <button
                onClick={onReset}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
            >
                Start Over
            </button>
        </div>
    </div>
  );
};

export default ResultsDisplay;
