// src/features/prediction/context/PredictionContext.jsx

import { createContext, useContext, useReducer, useMemo, useCallback } from 'react';

// 1. Define el estado inicial
const initialState = {
  img3d: null,
  text3d: null,
  textimg3d: null,
  unico3d: null,
  multiimg3d: null,
  boceto3d: null,
};

// 2. Crea el reducer
function predictionReducer(state, action) {
  switch (action.type) {
    case 'SET_PREDICTION':
      // action.payload será { type: 'img3d', result: {...} }
      return { ...state, [action.payload.type]: action.payload.result };
    case 'CLEAR_PREDICTION':
      // action.payload será { type: 'img3d' }
      return { ...state, [action.payload.type]: null };
    case 'CLEAR_ALL':
      return initialState;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const PredictionContext = createContext(undefined);

export const PredictionProvider = ({ children }) => {
  // 3. Usa useReducer en lugar de múltiples useState
  const [state, dispatch] = useReducer(predictionReducer, initialState);

  // 4. Crea una función para limpiar un tipo específico de resultado
  const clearResult = useCallback((type) => {
    if (type) {
        dispatch({ type: 'CLEAR_PREDICTION', payload: { type } });
    } else {
        dispatch({ type: 'CLEAR_ALL' });
    }
  }, []);

  // 5. Construye el valor del contexto con el estado y el dispatch
  const value = useMemo(() => ({
    ...state, // Expone cada estado individualmente: prediction_img3d, etc.
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
  
  // 6. Renombramos para mantener la consistencia con tu código anterior
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