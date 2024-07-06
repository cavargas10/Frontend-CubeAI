import React from "react";

export const CardDash = ({ predictionResult }) => {
  return (
    <div>
      {predictionResult && (
        <div>
          <h3>Resultado de la predicción:</h3>
          {predictionResult.preprocess && (
            <div>
              <h4>Preprocess:</h4>
              <img src={predictionResult.preprocess} alt="Preprocessed" />
            </div>
          )}
          {predictionResult.generate_mvs && (
            <div>
              <h4>Generate MVS:</h4>
              <img src={predictionResult.generate_mvs} alt="Generated MVS" />
            </div>
          )}
          {predictionResult.make3d && (
            <div>
              <h4>Descargas:</h4>
              <button>
                <a href={predictionResult.make3d[0]} download="make3d.obj">
                  Download OBJ
                </a>
              </button>
              <button>
                <a href={predictionResult.make3d[1]} download="make3d.glb">
                  Download GLB
                </a>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
