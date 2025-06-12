import { createContext, useContext, useReducer, useMemo, useCallback } from 'react';

const initialState = {
  img3d: null,
  text3d: null,
  textimg3d: null,
  unico3d: null,
  multiimg3d: null,
  boceto3d: null,
};

function predictionReducer(state, action) {
  switch (action.type) {
    case 'SET_PREDICTION':
      return { ...state, [action.payload.type]: action.payload.result };
    case 'CLEAR_PREDICTION':
      return { ...state, [action.payload.type]: null };
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
  
  return {
    prediction_img3d_result: context.img3d,
    prediction_text3d_result: context.text3d,
    prediction_textimg3d_result: context.textimg3d,
    prediction_unico3d_result: context.unico3d,
    prediction_multiimg3d_result: context.multiimg3d,
    prediction_boceto3d_result: context.boceto3d,
    dispatch: context.dispatch,
    clearResult: context.clearResult,
  };
};