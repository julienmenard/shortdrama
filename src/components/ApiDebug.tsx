import React, { useEffect, useState } from 'react';
import { Bug, X, Maximize2, Minimize2 } from 'lucide-react';

interface ApiCall {
  timestamp: number;
  url: string;
  method: string;
  response?: any;
}

const ApiDebug: React.FC = () => {
  const [apiCalls, setApiCalls] = useState<ApiCall[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    // Override fetch to capture API calls
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = args[0] as string;
      const options = args[1] as RequestInit;
      
      if (url.includes('galaxy')) {
        const call: ApiCall = {
          timestamp: Date.now(),
          url,
          method: options?.method || 'GET'
        };
        
        try {
          const response = await originalFetch(...args);
          const clone = response.clone();
          const data = await clone.json();
          call.response = data;
          setApiCalls(prev => [...prev, call]);
          return response;
        } catch (error) {
          console.error('API Debug Error:', error);
          return originalFetch(...args);
        }
      }
      
      return originalFetch(...args);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  if (apiCalls.length === 0) return null;

  const renderApiCalls = () => (
    <div className="space-y-4">
      {apiCalls.map((call, index) => (
        <div key={index} className="border border-pink-600/30 rounded-lg p-4 bg-gray-900/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-pink-500 text-xs font-mono">
              {new Date(call.timestamp).toLocaleTimeString()}
            </span>
            <span className="text-white text-xs font-mono px-2 py-1 bg-pink-600 rounded-full">
              {call.method}
            </span>
          </div>
          <p className="text-white text-xs font-mono break-all mb-2">
            {call.url}
          </p>
          <pre className="text-gray-400 text-xs overflow-x-auto bg-black/30 p-2 rounded">
            {JSON.stringify(call.response, null, 2)}
          </pre>
        </div>
      ))}
    </div>
  );

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 bg-black z-50 overflow-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-pink-600/30 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Bug className="w-5 h-5 text-pink-500 mr-2" />
            <span className="text-white font-mono">API Calls ({apiCalls.length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFullScreen(false)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Minimize2 className="w-5 h-5 text-gray-400" />
            </button>
            <button
              onClick={() => {
                setIsFullScreen(false);
                setIsExpanded(false);
              }}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
        <div className="p-4">
          {renderApiCalls()}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-mono text-sm flex items-center transition-colors"
        >
          <Bug className="w-4 h-4 mr-2 text-pink-500" />
          API Calls ({apiCalls.length})
        </button>
        {isExpanded && (
          <button
            onClick={() => setIsFullScreen(true)}
            className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {isExpanded && !isFullScreen && (
        <div className="mt-2 bg-gray-900 border border-pink-600/30 rounded-lg p-4 max-h-[calc(100vh-8rem)] overflow-auto w-[32rem] shadow-xl">
          {renderApiCalls()}
        </div>
      )}
    </div>
  );
};

export default ApiDebug;