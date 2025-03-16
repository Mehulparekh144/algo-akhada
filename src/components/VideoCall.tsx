"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import type { PresenceChannel } from "pusher-js";

interface VideoCallProps {
	channelRef: React.RefObject<PresenceChannel | null>;
	currentUserId: string;
	otherUserId: string;
}

export default function VideoCall({
	channelRef,
	currentUserId,
	otherUserId,
}: VideoCallProps) {
	const [localStream, setLocalStream] = useState<MediaStream | null>(null);
	const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
	const [isAudioEnabled, setIsAudioEnabled] = useState(true);
	const [isVideoEnabled, setIsVideoEnabled] = useState(true);

	const localVideoRef = useRef<HTMLVideoElement>(null);
	const remoteVideoRef = useRef<HTMLVideoElement>(null);
	const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

	// Initialize WebRTC peer connection
	useEffect(() => {
		const initializePeerConnection = () => {
			const configuration = {
				iceServers: [
					{ urls: "stun:stun.l.google.com:19302" },
					{ urls: "stun:stun1.l.google.com:19302" },
				],
			};

			const pc = new RTCPeerConnection(configuration);
			peerConnectionRef.current = pc;

			// Add local tracks to the connection
			if (localStream) {
				for (const track of localStream.getTracks()) {
					pc.addTrack(track, localStream);
				}
			}

			// Handle incoming remote tracks
			pc.ontrack = (event) => {
				setRemoteStream(event.streams[0]);
			};

			// Handle ICE candidates
			pc.onicecandidate = (event) => {
				if (event.candidate) {
					channelRef.current?.trigger("client-ice-candidate", {
						candidate: event.candidate,
						userId: currentUserId,
					});
				}
			};

			return pc;
		};

		if (localStream && channelRef.current) {
			initializePeerConnection();
		}

		return () => {
			peerConnectionRef.current?.close();
		};
	}, [localStream, channelRef, currentUserId]);

	// Initialize media stream
	useEffect(() => {
		const initializeMedia = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: true,
					audio: true,
				});
				setLocalStream(stream);
				if (localVideoRef.current) {
					localVideoRef.current.srcObject = stream;
				}
			} catch (error) {
				console.error("Error accessing media devices:", error);
			}
		};

		initializeMedia();

		return () => {
			for (const track of localStream?.getTracks() ?? []) {
				track.stop();
			}
		};
	}, [localStream]);

	// Set up signaling with Pusher
	useEffect(() => {
		if (!channelRef.current) return;

		const handleOffer = async (data: {
			offer: RTCSessionDescriptionInit;
			userId: string;
		}) => {
			if (data.userId !== otherUserId || !peerConnectionRef.current) return;

			try {
				await peerConnectionRef.current.setRemoteDescription(
					new RTCSessionDescription(data.offer),
				);
				const answer = await peerConnectionRef.current.createAnswer();
				await peerConnectionRef.current.setLocalDescription(answer);

				channelRef.current?.trigger("client-answer", {
					answer,
					userId: currentUserId,
				});
			} catch (error) {
				console.error("Error handling offer:", error);
			}
		};

		const handleAnswer = async (data: {
			answer: RTCSessionDescriptionInit;
			userId: string;
		}) => {
			if (data.userId !== otherUserId || !peerConnectionRef.current) return;

			try {
				await peerConnectionRef.current.setRemoteDescription(
					new RTCSessionDescription(data.answer),
				);
			} catch (error) {
				console.error("Error handling answer:", error);
			}
		};

		const handleIceCandidate = async (data: {
			candidate: RTCIceCandidateInit;
			userId: string;
		}) => {
			if (data.userId !== otherUserId || !peerConnectionRef.current) return;

			try {
				await peerConnectionRef.current.addIceCandidate(
					new RTCIceCandidate(data.candidate),
				);
			} catch (error) {
				console.error("Error handling ICE candidate:", error);
			}
		};

		channelRef.current.bind("client-offer", handleOffer);
		channelRef.current.bind("client-answer", handleAnswer);
		channelRef.current.bind("client-ice-candidate", handleIceCandidate);

		// Initiate call if we're the first user
		const initiateCall = async () => {
			if (!peerConnectionRef.current) return;

			try {
				const offer = await peerConnectionRef.current.createOffer();
				await peerConnectionRef.current.setLocalDescription(offer);

				channelRef.current?.trigger("client-offer", {
					offer,
					userId: currentUserId,
				});
			} catch (error) {
				console.error("Error creating offer:", error);
			}
		};

		if (currentUserId < otherUserId) {
			initiateCall();
		}

		return () => {
			channelRef.current?.unbind("client-offer", handleOffer);
			channelRef.current?.unbind("client-answer", handleAnswer);
			channelRef.current?.unbind("client-ice-candidate", handleIceCandidate);
		};
	}, [channelRef, currentUserId, otherUserId]);

	// Handle media controls
	const toggleAudio = () => {
		if (localStream) {
			for (const track of localStream.getAudioTracks()) {
				track.enabled = !isAudioEnabled;
			}
			setIsAudioEnabled(!isAudioEnabled);
		}
	};

	const toggleVideo = () => {
		if (localStream) {
			for (const track of localStream.getVideoTracks()) {
				track.enabled = !isVideoEnabled;
			}
			setIsVideoEnabled(!isVideoEnabled);
		}
	};

	return (
		<Card className="p-4 w-full max-w-4xl mx-auto">
			<div className="grid grid-cols-2 gap-4">
				<div className="relative">
					<video
						ref={localVideoRef}
						autoPlay
						playsInline
						muted
						className="w-full rounded-lg bg-muted"
					/>
					<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
						<Button
							size="icon"
							variant={isAudioEnabled ? "outline" : "destructive"}
							onClick={toggleAudio}
							className="rounded-full"
						>
							{isAudioEnabled ? (
								<Mic className="h-4 w-4" />
							) : (
								<MicOff className="h-4 w-4" />
							)}
						</Button>
						<Button
							size="icon"
							variant={isVideoEnabled ? "outline" : "destructive"}
							onClick={toggleVideo}
							className="rounded-full"
						>
							{isVideoEnabled ? (
								<Video className="h-4 w-4" />
							) : (
								<VideoOff className="h-4 w-4" />
							)}
						</Button>
					</div>
				</div>
				<div>
					<video
						ref={remoteVideoRef}
						autoPlay
						playsInline
						muted
						className="w-full rounded-lg bg-muted"
					/>
				</div>
			</div>
		</Card>
	);
}
