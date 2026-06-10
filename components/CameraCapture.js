"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
export function CameraCapture({ onCapture, onCancel, busy = false }) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [loading, setLoading] = useState(false);
    const [starting, setStarting] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [permissionError, setPermissionError] = useState("");
    const stopCamera = useCallback(() => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setStream(null);
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setHasStarted(false);
        setLoading(false);
        setStarting(false);
    }, []);
    const startCamera = useCallback(async () => {
        setPermissionError("");
        setStarting(true);
        setLoading(true);
        try {
            const nextStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { ideal: "environment" }
                },
                audio: false
            });
            streamRef.current = nextStream;
            setStream(nextStream);
            setHasStarted(true);
        }
        catch {
            setPermissionError("Camera access was denied or unavailable. Please allow camera permissions and try again.");
        }
        finally {
            setLoading(false);
            setStarting(false);
        }
    }, []);
    useEffect(() => {
        if (typeof window !== "undefined" && !window.isSecureContext) {
            setPermissionError("Camera requires HTTPS or localhost on mobile. Open this page over HTTPS or use a secure tunnel like ngrok, then try again.");
        }
        void startCamera();
        return () => {
            stopCamera();
        };
    }, [startCamera, stopCamera]);
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !stream)
            return;
        video.srcObject = stream;
        const playPromise = video.play();
        if (playPromise) {
            playPromise.catch(() => {
                // Some mobile browsers briefly reject autoplay until the stream settles.
            });
        }
    }, [stream]);
    function captureFrame() {
        const video = videoRef.current;
        if (!video)
            return;
        const canvas = document.createElement("canvas");
        const maxDimension = 1600;
        const scale = Math.min(1, maxDimension / Math.max(video.videoWidth, video.videoHeight));
        canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
        canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
        const context = canvas.getContext("2d");
        if (!context)
            return;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
            if (!blob)
                return;
            const file = new File([blob], `business-card-${Date.now()}.jpg`, {
                type: "image/jpeg"
            });
            onCapture(file);
        }, "image/jpeg", 0.82);
    }
    return (_jsxs("section", { className: "premium-shell rounded-[28px] p-3 sm:p-4", children: [_jsx("div", { className: "scanner-orb scanner-orb--a" }), _jsx("div", { className: "scanner-orb scanner-orb--b" }), _jsx("div", { className: "relative rounded-[24px] border border-black/5 bg-white/65 p-4 shadow-glass backdrop-blur-xl sm:p-5", children: _jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.18em] text-aqua-deep", children: "Camera" }), _jsx("h3", { className: "text-3xl font-semibold tracking-tight text-ink sm:text-[2.15rem]", children: "Scan the card" }), _jsx("p", { className: "max-w-2xl text-sm leading-6 text-slate sm:text-[0.95rem]", children: "Point the card inside the frame and capture it when it looks clear." })] }), _jsx("div", { className: "flex flex-wrap items-center gap-2", children: _jsxs("button", { type: "button", onClick: () => {
                                    stopCamera();
                                    onCancel();
                                }, className: "inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/75 px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-aqua/60 hover:bg-white", children: [_jsx(RefreshCw, { className: "h-4 w-4" }), "Restart"] }) })] }) }), _jsxs("div", { className: "relative mt-4 overflow-hidden rounded-[28px] border border-black/10 bg-ink shadow-[0_24px_70px_rgba(7,16,19,0.16)]", children: [_jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(51,214,210,0.18),transparent_42%),linear-gradient(180deg,rgba(7,16,19,0.06),rgba(7,16,19,0.34))]" }), _jsxs("div", { className: "relative aspect-[4/5] min-h-[24rem] sm:aspect-[16/10] sm:min-h-[32rem]", children: [_jsx("video", { ref: videoRef, playsInline: true, muted: true, autoPlay: true, className: "absolute inset-0 h-full w-full bg-black object-cover" }), _jsxs("div", { className: "pointer-events-none absolute inset-0", children: [_jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsxs("div", { className: "relative h-[78%] w-[84%] rounded-[2rem] border-2 border-white/65 shadow-[0_0_0_9999px_rgba(7,16,19,0.2)] sm:h-[74%] sm:w-[68%]", children: [_jsx("div", { className: "absolute left-4 top-4 h-10 w-10 border-l-4 border-t-4 border-aqua" }), _jsx("div", { className: "absolute right-4 top-4 h-10 w-10 border-r-4 border-t-4 border-aqua" }), _jsx("div", { className: "absolute bottom-4 left-4 h-10 w-10 border-b-4 border-l-4 border-aqua" }), _jsx("div", { className: "absolute bottom-4 right-4 h-10 w-10 border-b-4 border-r-4 border-aqua" }), _jsx("div", { className: "absolute inset-x-0 top-1/2 -translate-y-1/2", children: _jsx("div", { className: "mx-auto h-0.5 w-[70%] rounded-full bg-gradient-to-r from-transparent via-aqua to-transparent opacity-80" }) })] }) }), _jsx("div", { className: "absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6", children: _jsx("div", { className: "rounded-[1.25rem] border border-white/12 bg-black/28 px-4 py-3 text-center text-sm font-semibold tracking-wide text-white/95 backdrop-blur", children: "Place the card inside the frame" }) })] }), permissionError ? (_jsx("div", { className: "absolute inset-0 grid place-items-center bg-black/75 p-6 text-center text-white", children: _jsxs("div", { className: "max-w-md", children: [_jsx("p", { className: "text-lg font-medium", children: permissionError }), _jsx("button", { type: "button", onClick: startCamera, disabled: starting, className: "mt-4 inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-aqua disabled:cursor-not-allowed disabled:opacity-70", children: starting ? "Opening..." : "Try again" })] }) })) : !hasStarted ? (_jsx("div", { className: "absolute inset-0 grid place-items-center bg-black/75 p-6 text-center text-white", children: _jsxs("div", { className: "max-w-md", children: [_jsx("p", { className: "text-lg font-medium", children: "Allow camera access to start scanning." }), _jsx("button", { type: "button", onClick: startCamera, disabled: starting, className: "mt-4 inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-aqua disabled:cursor-not-allowed disabled:opacity-70", children: starting ? "Opening..." : "Allow camera access" })] }) })) : loading ? (_jsx("div", { className: "absolute inset-0 grid place-items-center bg-black/70 text-white/70", children: "Opening camera..." })) : null] })] }), _jsxs("div", { className: "mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [_jsx("p", { className: "text-sm text-slate", children: "Keep the card inside the frame, then tap capture." }), _jsx("button", { type: "button", onClick: captureFrame, disabled: !hasStarted || loading || Boolean(permissionError) || busy, className: "inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-ink via-aqua-deep to-aqua px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(0,140,149,0.28)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60", children: busy ? "Processing..." : "Capture image" })] })] }));
}
