import { useState, useEffect, useRef } from "react";
import { Modal } from "flowbite-react";
import { Queue, Gear, Hourglass } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

const QueueVisualizer = ({ position, total }) => {
  const items = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-2 my-4">
      {items.map(item => (
        <Queue
          key={item}
          size={28}
          weight={item === position ? "fill" : "regular"}
          className={`transition-all duration-300 ${item === position ? "text-morado-gradient" : "text-gray-400"}`}
        />
      ))}
    </div>
  );
};

const ProcessingSpinner = () => (
    <div className="relative w-20 h-20 my-4">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-azul-gradient animate-spin"></div>
        <div className="absolute inset-0 rounded-full border-4 border-b-transparent border-morado-gradient animate-spin [animation-direction:reverse] [animation-duration:1.5s]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <Gear size={32} className="text-gray-500 animate-spin [animation-duration:3s]" />
        </div>
    </div>
);

export const ProgressModal = ({ show, jobStatus }) => {
  const { t, i18n } = useTranslation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const intervalRef = useRef(null);
  const jobType = jobStatus?.job_type || "default";
  const stepsKey = `loading_steps.${jobType}`;
  const steps = i18n.getResource(i18n.language, 'translation', stepsKey) || [];

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
        setCurrentStepIndex(prevIndex => {
          if (Array.isArray(steps) && prevIndex < steps.length - 1) {
            return prevIndex + 1;
          }
          clearCurrentInterval();
          return prevIndex;
        });
      }, 10000);
    } else {
      clearCurrentInterval();
      setCurrentStepIndex(0);
    }

    return () => clearCurrentInterval();
    
  }, [show, jobStatus?.status, steps]);

  const getTitle = () => {
    switch (jobStatus?.status) {
      case "queued":
        return t('progress_modal.queued_title');
      case "processing":
        return t('progress_modal.processing_title');
      default:
        return t('progress_modal.initiating_title');
    }
  };

  const getMessage = () => {
    switch (jobStatus?.status) {
      case "queued":
        return t('progress_modal.queued_message', { position: jobStatus.position_in_queue, total: jobStatus.queue_size });
      case "processing":
        if (Array.isArray(steps) && steps[currentStepIndex]) {
            return steps[currentStepIndex];
        }
        return t('progress_modal.processing_message_default');
      default:
        return t('progress_modal.initiating_message');
    }
  };

  return (
    <Modal
      show={show}
      size="md"
      popup={true}
      onClose={() => {}}
      theme={{
        root: { base: "fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm" },
        content: { base: "relative w-full max-w-sm m-auto", inner: "relative rounded-none bg-transparent" },
      }}
    >
      <Modal.Body className="p-0 bg-transparent">
        <div className="text-center bg-white dark:bg-principal rounded-2xl py-8 px-6 border-2 border-gray-200 dark:border-linea/50 shadow-2xl shadow-azul-gradient/10">
          <div className="flex flex-col items-center">
            
            {!jobStatus && <Hourglass size={40} className="text-gray-400 mb-4 animate-pulse" />}
            {jobStatus?.status === "queued" && <QueueVisualizer position={jobStatus.position_in_queue} total={jobStatus.queue_size} />}
            {jobStatus?.status === "processing" && <ProcessingSpinner />}

            <h3 key={getTitle()} className="mb-2 text-lg font-semibold text-gray-800 dark:text-white animate-[fadeIn_0.5s_ease-in-out]">
              {getTitle()}
            </h3>
            <p key={getMessage()} className="text-sm text-gray-500 dark:text-gray-400 animate-[fadeIn_0.5s_ease-in-out_0.2s]">
              {getMessage()}
            </p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};