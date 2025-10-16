
import React from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isDisabled: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onGenerate, isDisabled }) => {
  return (
    <div className="flex flex-col justify-center space-y-4">
      <h2 className="text-2xl font-semibold text-gray-100">2. Enter a Keyword</h2>
      <p className="text-gray-400">
        Describe the aesthetic you want. Try keywords like "royal", "street", "cyberpunk", "vintage", or "film".
      </p>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., royal"
        className="w-full p-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-brand-purple outline-none transition-all duration-300"
      />
      <button
        onClick={onGenerate}
        disabled={isDisabled}
        className="w-full flex items-center justify-center p-4 text-lg font-bold bg-brand-purple text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
        Generate Magic
      </button>
    </div>
  );
};

export default PromptInput;
