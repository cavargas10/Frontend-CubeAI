import React from "react";
import { DownloadSimple } from "@phosphor-icons/react";

export const BtnObj = ({ predictionResult, error }) => {
  return (
    <div className="border-t-2 border-linea ">
      {error && <p style={{ color: "red" }}>{error}</p>}
      {predictionResult && (
        <div className="">
          {predictionResult.obj_model && (
            <div className="">
              <div className="flex items-center justify-around w-[200px] mt-4 px-4 py-2 text-white rounded-md shadow-md bg-gradient-to-r from-azul-gradient to-morado-gradient hover:from-morado-gradient hover:to-azul-gradient ">
                <DownloadSimple size={32} color="white" />
                <a
                  href={predictionResult.obj_model}
                  download="model.obj"
                  className="text-xl"
                >
                  OBJ
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
