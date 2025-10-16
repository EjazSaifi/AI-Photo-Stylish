
import React, { useState, useCallback, useEffect } from 'react';
import { GeneratedData } from './types';
import { editImageWithPrompt, generateSuggestions } from './services/geminiService';
import { blobToBase64 } from './utils/fileUtils';
import ImageUploader from './components/ImageUploader';
import PromptInput from './components/PromptInput';
import ResultsDisplay from './components/ResultsDisplay';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (originalImage) {
      const objectUrl = URL.createObjectURL(originalImage);
      setOriginalImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setOriginalImagePreview(null);
  }, [originalImage]);

  const handleGenerate = useCallback(async (currentPrompt: string) => {
    if (!originalImage || !currentPrompt) {
      setError('Please upload an image and provide a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setGeneratedData(null);

    try {
      const base64Image = await blobToBase64(originalImage);
      const mimeType = originalImage.type;

      const [editedImageResult, suggestionsResult] = await Promise.all([
        editImageWithPrompt(base64Image, mimeType, currentPrompt),
        generateSuggestions(currentPrompt),
      ]);

      setGeneratedImage(editedImageResult);
      setGeneratedData(suggestionsResult);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage]);

  const onGenerateClick = () => {
    handleGenerate(prompt);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
    handleGenerate(suggestion);
  };

  const handleReset = () => {
    setOriginalImage(null);
    setOriginalImagePreview(null);
    setPrompt('');
    setGeneratedImage(null);
    setGeneratedData(null);
    setIsLoading(false);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-brand-dark text-brand-light font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
            AI Photo Stylist
          </h1>
          <p className="mt-2 text-lg text-gray-300">
            Transform your photos with a single word.
          </p>
        </header>

        <main className="bg-brand-gray/30 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm border border-white/10">
          {!generatedImage && !isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ImageUploader onImageUpload={setOriginalImage} previewUrl={originalImagePreview} />
              <PromptInput
                prompt={prompt}
                setPrompt={setPrompt}
                onGenerate={onGenerateClick}
                isDisabled={!originalImage || !prompt}
              />
            </div>
          )}

          {isLoading && <Loader />}

          {error && (
            <div className="text-center p-4 my-4 bg-red-900/50 text-red-300 border border-red-700 rounded-lg">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {generatedImage && generatedData && !isLoading && (
            <ResultsDisplay
              originalImage={originalImagePreview!}
              generatedImage={generatedImage}
              data={generatedData}
              onSuggestionClick={handleSuggestionClick}
              onReset={handleReset}
            />
          )}
        </main>
        
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Powered by Google Gemini. Built for stunning visual transformations.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
