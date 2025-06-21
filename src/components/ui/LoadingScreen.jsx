import { useState, useEffect } from 'react';
import logo from '../../assets/logo.webp';

export const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const intervals = [
      { p: 40, t: 100 },
      { p: 75, t: 250 },
      { p: 95, t: 500 },
    ];
    
    let currentProgress = 0;
    let timeout;

    const runProgress = (index) => {
      if (index >= intervals.length) return;
      
      const interval = intervals[index];
      timeout = setTimeout(() => {
        currentProgress = interval.p;
        setProgress(currentProgress);
        runProgress(index + 1);
      }, interval.t);
    };
    
    runProgress(0);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-center items-center bg-white dark:bg-principal transition-opacity duration-300">
      <div className="flex flex-col items-center">
        <img 
          src={logo} 
          alt="Instant3D Logo" 
          className="w-48 h-48 drop-shadow-[0_0_25px_rgba(169,117,255,0.4)] mb-4"
        />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-azul-gradient to-morado-gradient text-transparent bg-clip-text mb-6">
          Instant3D
        </h1>
        
        <div className="w-64 bg-gray-200 dark:bg-linea/20 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-azul-gradient to-morado-gradient h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-3 text-lg font-mono text-gray-700 dark:text-gray-300">
          {progress}%
        </p>
      </div>
    </div>
  );
};