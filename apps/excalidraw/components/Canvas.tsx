"use client"
import React, { useEffect, useRef } from 'react'
import initDraw from '../draw';

function Canvas({roomId , socket } : {
    roomId : string
    socket : WebSocket
}) {
        const canvasRef = useRef<HTMLCanvasElement>(null);

        useEffect(() => {
        if (canvasRef.current) {
        const canvas = canvasRef.current;
        initDraw(canvas , roomId , socket)
        }
    }, [canvasRef]);
  return (
    <div>
        <canvas ref={canvasRef} width={2000} height={2000}></canvas>
    </div>
  )
}

export default Canvas
