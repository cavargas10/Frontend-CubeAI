import { createContext, useState, useContext, useMemo, useCallback } from 'react';

const PredictionContext = createContext(undefined);

export const PredictionProvider = ({ children }) => {
  const [prediction_img3d_result, setPrediction_img3d_result_state] = useState(null);
  const [prediction_text3d_result, setPrediction_text3d_result_state] = useState(null);
  const [prediction_textimg3d_result, setPrediction_textimg3d_result_state] = useState(null);
  const [prediction_unico3d_result, setPrediction_unico3d_result_state] = useState(null);
  const [prediction_multiimg3d_result, setPrediction_multiimg3d_result_state] = useState(null);
  const [prediction_boceto3d_result, setPrediction_boceto3d_result_state] = useState(null);
  const setPrediction_img3d_result = useCallback((result) => setPrediction_img3d_result_state(result), []);
  const setPrediction_text3d_result = useCallback((result) => setPrediction_text3d_result_state(result), []);
  const setPrediction_textimg3d_result = useCallback((result) => setPrediction_textimg3d_result_state(result), []);
  const setPrediction_unico3d_result = useCallback((result) => setPrediction_unico3d_result_state(result), []);
  const setPrediction_multiimg3d_result = useCallback((result) => setPrediction_multiimg3d_result_state(result), []);
  const setPrediction_boceto3d_result = useCallback((result) => setPrediction_boceto3d_result_state(result), []);

  const clearResult = useCallback((type) => {
    switch (type) {
      case 'img3d': setPrediction_img3d_result_state(null); break;
      case 'text3d': setPrediction_text3d_result_state(null); break;
      case 'textimg3d': setPrediction_textimg3d_result_state(null); break;
      case 'unico3d': setPrediction_unico3d_result_state(null); break;
      case 'multiimg3d': setPrediction_multiimg3d_result_state(null); break;
      case 'boceto3d': setPrediction_boceto3d_result_state(null); break;
      default:
        setPrediction_img3d_result_state(null);
        setPrediction_text3d_result_state(null);
        setPrediction_textimg3d_result_state(null);
        setPrediction_unico3d_result_state(null);
        setPrediction_multiimg3d_result_state(null);
        setPrediction_boceto3d_result_state(null);
        break;
    }
  }, []);

  const value = useMemo(() => ({
    prediction_img3d_result,
    prediction_text3d_result,
    prediction_textimg3d_result,
    prediction_unico3d_result,
    prediction_multiimg3d_result,
    prediction_boceto3d_result,
    setPrediction_img3d_result,
    setPrediction_text3d_result,
    setPrediction_textimg3d_result,
    setPrediction_unico3d_result,
    setPrediction_multiimg3d_result,
    setPrediction_boceto3d_result,
    clearResult,
  }), [
    prediction_img3d_result, prediction_text3d_result, prediction_textimg3d_result,
    prediction_unico3d_result, prediction_multiimg3d_result, prediction_boceto3d_result,
    setPrediction_img3d_result, setPrediction_text3d_result, setPrediction_textimg3d_result,
    setPrediction_unico3d_result, setPrediction_multiimg3d_result, setPrediction_boceto3d_result,
    clearResult,
  ]);

  return (
    <PredictionContext.Provider value={value}>
      {children}
    </PredictionContext.Provider>
  );
};

export const usePredictions = () => {
  const context = useContext(PredictionContext);
  if (context === undefined) {
    throw new Error('usePredictions must be used within a PredictionProvider');
  }
  return context;
};