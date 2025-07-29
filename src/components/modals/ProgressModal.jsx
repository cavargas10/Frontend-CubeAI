import { useState, useEffect, useRef } from "react";
import { Modal } from "flowbite-react";
import { Queue, Hourglass } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { BrandedSpinner } from "../ui/BrandedSpinner";

const QueueVisualizer = ({ position, total }) => {
  return (
    <div className="flex items-center justify-center gap-2 my-4">
      <Queue size={40} className="text-gray-400 animate-pulse" />
    </div>
  );
};

export const ProgressModal = ({ show, jobStatus }) => {
  const { t, i18n } = useTranslation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const intervalRef = useRef(null);
  const jobType = jobStatus?.job_type || "default";
  const stepsKey = `loading_steps.${jobType}`;
  const steps =
    i18n.getResource(i18n.language, "translation", stepsKey) ||
    i18n.getResource(i18n.language, "translation", "loading_steps.default");

  const progressPercentage =
    Array.isArray(steps) && steps.length > 0
      ? ((currentStepIndex + 1) / steps.length) * 100
      : 0;

  useEffect(() => {
    const clearCurrentInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    if (show && jobStatus?.status === "processing") {
      clearCurrentInterval();
      setCurrentStepIndex(0);

      intervalRef.current = setInterval(() => {
        setCurrentStepIndex((prevIndex) => {
          if (Array.isArray(steps) && prevIndex < steps.length - 1) {
            return prevIndex + 1;
          }
          clearCurrentInterval();
          return prevIndex;
        });
      }, 8000);
    } else {
      clearCurrentInterval();
      setCurrentStepIndex(0);
    }

    return () => clearCurrentInterval();
  }, [show, jobStatus?.status, steps]);

  const getTitle = () => {
    switch (jobStatus?.status) {
      case "queued":
        return t("progress_modal.queued_title");
      case "processing":
        return t("progress_modal.processing_title");
      default:
        return t("progress_modal.initiating_title");
    }
  };

  const getMessage = () => {
    switch (jobStatus?.status) {
      case "queued":
        return t("progress_modal.queued_message");
      case "processing":
        if (Array.isArray(steps) && steps[currentStepIndex]) {
          return steps[currentStepIndex];
        }
        return t("progress_modal.processing_message_default");
      default:
        return t("progress_modal.initiating_message");
    }
  };

  return (
    <Modal
      show={show}
      size="md"
      popup={true}
      onClose={() => {}}
      theme={{
        root: {
          base: "fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm",
        },
        content: {
          base: "relative w-full max-w-sm m-auto",
          inner: "relative rounded-none bg-transparent",
        },
      }}
    >
      <Modal.Body className="p-0 bg-transparent">
        <div className="text-center bg-white dark:bg-principal rounded-2xl py-8 px-6 border-2 border-gray-200 dark:border-linea/50 shadow-2xl shadow-azul-gradient/10">
          <div className="flex flex-col items-center">
            {jobStatus?.status === "queued" ? (
              <QueueVisualizer />
            ) : jobStatus?.status === "processing" ? (
              <div className="my-4">
                <BrandedSpinner size="sm" />
              </div>
            ) : (
              <Hourglass
                size={40}
                className="text-gray-400 mb-4 animate-pulse"
              />
            )}

            <h3
              key={getTitle()}
              className="mb-2 text-lg font-semibold text-gray-800 dark:text-white animate-[fadeIn_0.5s_ease-in-out]"
            >
              {getTitle()}
            </h3>
            <p
              key={getMessage()}
              className="text-sm text-gray-500 dark:text-gray-400 animate-[fadeIn_0.5s_ease-in-out_0.2s] h-10 flex items-center justify-center text-center"
            >
              {getMessage()}
            </p>
            {jobStatus?.status === "processing" &&
              Array.isArray(steps) &&
              steps.length > 0 && (
                <div className="w-full bg-gray-200 dark:bg-linea/30 rounded-full h-2.5 mt-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-azul-gradient to-morado-gradient h-2.5 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};