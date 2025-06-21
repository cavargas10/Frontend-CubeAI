import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { getJobStatus } from '../services/predictionApi';
import { useTranslation } from 'react-i18next';

export const useAsyncGeneration = (jobId, jobType) => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [jobStatus, setJobStatus] = useState(null);
  const [result, setResult] = useState(null);
  const [pollingError, setPollingError] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const pollingIntervalRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      setIsPolling(false);
    }
  }, []);

  const reset = useCallback(() => {
    stopPolling();
    setJobStatus(null);
    setResult(null);
    setPollingError(null);
    setIsPolling(false);
  }, [stopPolling]);

  useEffect(() => {
    if (!jobId || !jobType || !user) {
      reset();
      return;
    }

    const poll = async () => {
      try {
        const token = await user.getIdToken();
        const status = await getJobStatus(token, jobId);
        
        setJobStatus({ ...status, job_type: jobType });

        if (status.status === 'completed') {
          setResult(status.result);
          stopPolling();
        } else if (status.status === 'failed') {
          setPollingError(status.error || t('errors.generic_generation_failed'));
          stopPolling();
        }
      } catch (err) {
        setPollingError(err.message || t('errors.generic_polling_failed'));
        stopPolling();
      }
    };

    reset();
    setIsPolling(true);
    poll();
    pollingIntervalRef.current = setInterval(poll, 5000); 

    return () => {
      stopPolling();
    };
  }, [jobId, jobType, user, t, reset, stopPolling]);

  return { jobStatus, result, pollingError, isPolling, reset };
};