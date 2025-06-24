import { createContext, useContext, useReducer, useMemo, useCallback } from 'react';

const initialState = {
  predictions: {}, 
};

function predictionReducer(state, action) {
  switch (action.type) {
    case 'SET_PREDICTION':
      return {
        ...state,
        predictions: {
          ...state.predictions,
          [action.payload.type]: action.payload.result,
        },
      };

    case 'CLEAR_PREDICTION':
      const newPredictions = { ...state.predictions };
      delete newPredictions[action.payload.type];
      return {
        ...state,
        predictions: newPredictions,
      };

    case 'CLEAR_ALL':
      return initialState;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const PredictionContext = createContext(undefined);

export const PredictionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(predictionReducer, initialState);

  const clearResult = useCallback((type) => {
    if (type) {
        dispatch({ type: 'CLEAR_PREDICTION', payload: { type } });
    } else {
        dispatch({ type: 'CLEAR_ALL' });
    }
  }, []);

  const value = useMemo(() => ({
    ...state, 
    dispatch,
    clearResult,
  }), [state, clearResult]);

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

export const usePredictionResult = (predictionType) => {
    const { predictions } = usePredictions();
    return predictions[predictionType] || null;
}