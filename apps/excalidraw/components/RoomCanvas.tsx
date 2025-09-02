"use client";
import { useEffect, useState } from "react"
import { WS_URL } from "../config";
import Canvas from "./Canvas";

export default function RoomCanvas({roomId} : {
    roomId: string
}) {
    const [socket , setSocket] = useState<WebSocket | null>(null) 

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtZXU2cTNqcTAwMDJ5MGc0cG9mdTcwbWYiLCJpYXQiOjE3NTYzMTE4Njh9.6JTfJSptb2wVlkxGO8f2iRyaXcW_oC52w9fuoMZtmHU`)
        ws.onopen = () => {
            setSocket(ws)
        const data = JSON.stringify({
            type : "join_room",
            roomId
        })
        console.log(data)
        ws.send(data)
        }
    }, [])
    if (!socket) {
      return <div>
            Connecting to server....
        </div>
    }    
   return <div>
    <Canvas roomId={roomId} socket={socket} />
   </div>
}