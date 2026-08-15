"use client"

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '~/components/ui/button';
import { createSocketClient } from '@repo/socket/client';

const page = () => {
    const roomId = useParams().roomId;
    const [connected, setConnected] = useState(false);
    const [socketId, setSocketId] = useState<string | null>(null);

    useEffect(() => {
        const socket = createSocketClient(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000");

        socket.on("connect", () => {
            setConnected(true);
            setSocketId(socket.id ?? null);
        });

        socket.on("disconnect", () => {
            setConnected(false);
            setSocketId(null);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            <h1>Join Room {roomId}</h1>
            <p>{connected ? `Connected (${socketId})` : "Disconnected"}</p>
            <Button>Join</Button>
        </div>
    )
}

export default page