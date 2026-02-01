import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const VoiceInput = ({ onDataDetected }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // ✅ THIS IS THE "STOP AND APPLY" FEATURE
  // When 'listening' changes to false (you stop speaking), this runs automatically.
  useEffect(() => {
    if (!listening && transcript) {
      console.log("🛑 Speaking stopped. Applying changes...");
      processVoiceData(transcript);
    }
  }, [listening, transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span className="text-xs text-red-500">Browser doesn't support speech.</span>;
  }

  const handleStart = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
    // The useEffect above handles the actual data processing
  };

  const processVoiceData = (text) => {
    const textLower = text.toLowerCase();
    
    // 1. Extract number
    const numberMatch = textLower.match(/\d+/);
    const number = numberMatch ? parseInt(numberMatch[0]) : null;

    let category = null;
    let field = null;
    let value = number;

    // --- LOGIC MAPPING ---
    
    // Transportation
    if (textLower.includes('car') || textLower.includes('drive')) {
      category = 'transportation';
      if (textLower.includes('diesel')) { field = 'carType'; value = 'diesel'; }
      else if (textLower.includes('electric')) { field = 'carType'; value = 'electric'; }
      else if (textLower.includes('petrol')) { field = 'carType'; value = 'petrol'; }
      else if (number !== null) { field = 'carKm'; }
    }
    else if (textLower.includes('bike')) {
      category = 'transportation';
      if (number !== null) field = 'bikeKm';
    }
    else if (textLower.includes('flight') || textLower.includes('plane')) {
      category = 'transportation';
      if (number !== null) field = number > 4 ? 'flightLongHaul' : 'flightShortHaul';
    }
    else if (textLower.includes('public') || textLower.includes('bus') || textLower.includes('train')) {
      category = 'transportation';
      if (number !== null) field = 'publicTransportKm';
    }

    // Home Energy
    else if (textLower.includes('electricity') || textLower.includes('units')) {
      category = 'homeEnergy';
      if (number !== null) field = 'electricityKwh';
    }
    else if (textLower.includes('gas')) {
      category = 'homeEnergy';
      if (number !== null) field = 'naturalGasKwh';
    }
    else if (textLower.includes('solar')) {
      category = 'homeEnergy';
      field = 'renewableEnergy';
      value = !textLower.includes('no');
    }

    // Food
    else if (textLower.includes('meat') || textLower.includes('beef')) {
      category = 'food';
      field = 'meatFrequency';
      if (textLower.includes('daily')) value = 'daily';
      else if (textLower.includes('never')) value = 'never';
      else value = 'weekly';
    }
    else if (textLower.includes('dairy')) {
      category = 'food';
      field = 'dairyFrequency';
      if (textLower.includes('daily')) value = 'daily';
      else value = 'weekly';
    }

    // Shopping & Waste
    else if (textLower.includes('clothes')) {
      category = 'shopping';
      if (number !== null) field = 'clothingItemsPerMonth';
    }
    else if (textLower.includes('recycle')) {
      category = 'waste';
      field = 'recycling';
      value = !textLower.includes('no');
    }
    else if (textLower.includes('plastic')) {
      category = 'waste';
      field = 'plasticUsage';
      if (textLower.includes('high')) value = 'high';
      else if (textLower.includes('low')) value = 'low';
      else value = 'medium';
    }

    // APPLY
    if (category && field && value !== undefined) {
      onDataDetected(category, field, value);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 mb-8 transition-all">
      <div className="flex items-center gap-4">
        {!listening ? (
          <button
            type="button"
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <span className="text-xl">🎙️</span>
            <span className="font-medium">Tap to Speak</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStop}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all animate-pulse shadow-md"
          >
            <span className="text-xl">⏹️</span>
            <span className="font-medium">Stop & Apply</span>
          </button>
        )}
      </div>

      <div className="mt-4 min-h-[1.5rem] w-full text-center">
        {transcript ? (
          <p className="text-lg text-gray-700 dark:text-gray-200 font-medium">
            "{transcript}"
          </p>
        ) : (
          <p className="text-sm text-gray-400">
            Microphone is off
          </p>
        )}
      </div>
    </div>
  );
};

export default VoiceInput;