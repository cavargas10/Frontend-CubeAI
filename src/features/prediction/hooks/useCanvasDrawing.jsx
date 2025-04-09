import { useState, useRef, useCallback, useMemo } from "react";

export const useCanvasDrawing = (canvasConfig) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [drawingState, setDrawingState] = useState({ tool: "pencil", isDrawing: false });
  const initializeCanvas = useCallback((node) => {
    if (node !== null) {
      canvasRef.current = node;
      const ctx = node.getContext("2d", { alpha: false });
      ctxRef.current = ctx;
      ctx.strokeStyle = canvasConfig.pencilConfig.strokeStyle;
      ctx.lineWidth = canvasConfig.pencilConfig.lineWidth;
      ctx.lineCap = canvasConfig.pencilConfig.lineCap;
      ctx.fillStyle = "#FFFFFF"; 
      ctx.fillRect(0, 0, canvasConfig.width, canvasConfig.height);
    }
  }, [canvasConfig]);

  const getCanvasCoordinates = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasConfig.width / rect.width;
    const scaleY = canvasConfig.height / rect.height;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    if (clientX === undefined || clientY === undefined) return { x: 0, y: 0 };
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  }, [canvasConfig]);

  const startDrawing = useCallback((e) => {
    if (e.touches) e.preventDefault();
    const coords = getCanvasCoordinates(e);
    setDrawingState((prev) => ({ ...prev, isDrawing: true }));
    if (ctxRef.current) {
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(coords.x, coords.y);
      if (drawingState.tool === "pencil") {
        ctxRef.current.strokeStyle = canvasConfig.pencilConfig.strokeStyle;
        ctxRef.current.lineWidth = canvasConfig.pencilConfig.lineWidth;
      }
    }
  }, [getCanvasCoordinates, drawingState.tool, canvasConfig]);

  const stopDrawing = useCallback((e) => {
    if (e.changedTouches) e.preventDefault();
    setDrawingState((prev) => ({ ...prev, isDrawing: false }));
    if (ctxRef.current) {
      ctxRef.current.beginPath();
    }
  }, []);

  const handleDraw = useCallback(
    (e) => {
      if (!drawingState.isDrawing || !ctxRef.current) return;
      if (e.touches) e.preventDefault();
      const coords = getCanvasCoordinates(e);
      const ctx = ctxRef.current;

      if (drawingState.tool === "pencil") {
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
      } else if (drawingState.tool === "eraser") {
        const size = canvasConfig.eraserSize;
        ctx.fillStyle = "#FFFFFF"; 
        ctx.fillRect(coords.x - size / 2, coords.y - size / 2, size, size);
      }
    },
    [drawingState.isDrawing, drawingState.tool, getCanvasCoordinates, canvasConfig.eraserSize]
  );

  const clearCanvas = useCallback(() => {
    if (ctxRef.current) {
      ctxRef.current.fillStyle = "#FFFFFF";
      ctxRef.current.fillRect(0, 0, canvasConfig.width, canvasConfig.height);
      ctxRef.current.strokeStyle = canvasConfig.pencilConfig.strokeStyle;
      ctxRef.current.lineWidth = canvasConfig.pencilConfig.lineWidth;
      ctxRef.current.lineCap = canvasConfig.pencilConfig.lineCap;
    }
  }, [canvasConfig]);

  const isCanvasEmpty = useCallback(() => {
    if (!ctxRef.current) return true;
    const imageData = ctxRef.current.getImageData(0, 0, canvasConfig.width, canvasConfig.height);
    return ![...imageData.data].some((channel) => channel < 255);
  }, [canvasConfig]);

  return {
    canvasRef,
    ctxRef,
    drawingState,
    setDrawingState,
    initializeCanvas,
    startDrawing,
    stopDrawing,
    handleDraw,
    clearCanvas,
    isCanvasEmpty,
  };
};