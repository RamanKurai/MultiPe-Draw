"use client";

import initDraw from "@/app/draw";
import React, { useEffect, useRef } from "react";

const Maincanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      initDraw(canvasRef.current);
    }
  }, []);

  return <canvas ref={canvasRef} width={2000} height={2000}></canvas>;
};

export default Maincanvas;
