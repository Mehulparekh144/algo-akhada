"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Problem } from "@prisma/client";
import { User } from "better-auth";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import noHints from "@/assets/images/nohints.png";
import { completeBooking } from "./actions";
import Pusher from "pusher-js";
import { env } from "@/env";

interface ActiveSessionProps {
  bookingId: string;
  isUser1: boolean;
  user1: User;
  user2: User;
  problem1: Problem;
  problem2: Problem;
}

enum Phase {
  phase1 = "phase1",
  phase2 = "phase2",
}

export default function ActiveSession({
  bookingId,
  user1,
  user2,
  problem1,
  problem2,
  isUser1,
}: ActiveSessionProps) {
  const [activePhase, setActivePhase] = useState<Phase>(Phase.phase1);
  const [timeLeft, setTimeLeft] = useState<number>(30 * 60);
  const [timeActive, setTimeActive] = useState<boolean>(true);

  useEffect(() => {
    const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
      forceTLS: true,
      authEndpoint: "/api/pusher-auth",
      auth: {
        params: {
          bookingId,
        },
      },
    });

    const channel = pusher.subscribe(`presence-booking-${bookingId}`);

    channel.bind("timer-update", (data: { timeLeft: number }) => {
      setTimeLeft(data.timeLeft);
    });

    channel.bind("phase-change", (data: { phase: { phase: Phase } }) => {
      console.log("Phase change", data.phase.phase);
      setActivePhase(data.phase.phase);

      if (data.phase.phase === Phase.phase2) {
        setTimeLeft(30 * 60);
      }
    });

    channel.bind("end-session", async () => {
      await completeBooking(bookingId);
      window.location.href = `/booking/${bookingId}/feedback`;
    });

    const getSessionState = () => {
      const sessionState = localStorage.getItem(`sessionState_${bookingId}`);
      if (sessionState) {
        const state = JSON.parse(sessionState);
        setActivePhase(state.activePhase);
        setTimeLeft(state.timeLeft);
      }
    };

    getSessionState();

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`presence-booking-${bookingId}`);
      pusher.disconnect();
    };
  }, [bookingId]);

  useEffect(() => {
    localStorage.setItem(
      `sessionState_${bookingId}`,
      JSON.stringify({ activePhase, timeLeft })
    );
  }, [activePhase, timeLeft, bookingId]);

  const switchPhase = async () => {
    await fetch("/api/pusher-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: `presence-booking-${bookingId}`,
        event: activePhase === Phase.phase1 ? "phase-change" : "end-session",
        data: {
          phase: activePhase === Phase.phase1 ? { phase: Phase.phase2 } : {},
        },
      }),
    });

    if (activePhase === Phase.phase1) {
      setActivePhase(Phase.phase2);
      setTimeLeft(30 * 60);
    } else {
      await completeBooking(bookingId);
      window.location.href = `/booking/${bookingId}/feedback`;
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeActive && timeLeft > 0) {
      timer = setInterval(() => {
        const newTimeLeft = timeLeft - 1;
        setTimeLeft(newTimeLeft);

        if (newTimeLeft % 5 === 0) {
          fetch("/api/pusher-event", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              channel: `presence-booking-${bookingId}`,
              event: "timer-update",
              data: {
                timeLeft: newTimeLeft,
              },
            }),
          }).catch(console.error);
        }
      }, 1000);
    } else if (timeLeft === 0) {
      switchPhase();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeActive, timeLeft]);

  function openInNewWindow() {
    const windowFeatures =
      "fullscreen=yes,resizable=yes,scrollbars=yes,toolbar=no,location=no,menubar=no,status=no";
    if (activePhase === Phase.phase1 && isUser1) {
      window.open(problem1.link || "google.com", "_blank", windowFeatures);
    } else if (activePhase === Phase.phase2 && !isUser1) {
      window.open(problem2.link || "google.com", "_blank", windowFeatures);
    }
  }

  // Format time for display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  useEffect(() => {
    // openInNewWindow();
  }, [activePhase, isUser1, problem1, problem2]);

  let content;

  if (isUser1) {
    if (activePhase === Phase.phase1) {
      content = (
        <div className="space-y-3 text-center text-pretty max-w-2xl">
          <h1 className="font-semibold text-2xl">
            {user1.name}, You are solving{" "}
            <span className="text-primary">{problem1.title}</span>{" "}
          </h1>
          <div>
            <p className="text-muted-foreground text-base">
              Your problem has been opened in a new window
            </p>
            <p className="text-muted-foreground text-sm">
              If it hasn't opened, you can
              <span
                className="font-semibold underline cursor-pointer"
                onClick={openInNewWindow}
              >
                &nbsp;click&nbsp;
              </span>
              here to open it
            </p>
          </div>
        </div>
      );
    } else {
      content = (
        <div className="space-y-3  text-pretty max-w-2xl">
          <h2 className="font-semibold text-2xl text-center">
            {user2.name} is solving{" "}
            <span className="text-primary">{problem2.title}</span>{" "}
          </h2>
          <Separator />
          <Card className="bg-secondary">
            <CardHeader>
              <h2 className="text-xl font-semibold">Hints</h2>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside">
                {problem2.hints.map((hint, idx) => (
                  <li key={idx}>{hint}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      );
    }
  } else {
    if (activePhase === Phase.phase2) {
      content = (
        <div className="space-y-3 text-center text-pretty max-w-2xl">
          <h1 className="font-semibold text-2xl">
            {user2.name}, You are solving{" "}
            <span className="text-primary">{problem2.title}</span>{" "}
          </h1>
          <div>
            <p className="text-muted-foreground text-base">
              Your problem has been opened in a new window
            </p>
            <p className="text-muted-foreground text-sm">
              If it hasn't opened, you can
              <span
                className="font-semibold underline cursor-pointer"
                onClick={openInNewWindow}
              >
                &nbsp;click&nbsp;
              </span>
              here to open it
            </p>
          </div>
        </div>
      );
    } else {
      content = (
        <div className="space-y-3  text-pretty max-w-2xl">
          <h2 className="font-semibold text-2xl text-center">
            {user1.name} is solving{" "}
            <span className="text-primary">{problem1.title}</span>{" "}
          </h2>
          <Separator />
          <Card className="bg-secondary">
            <CardHeader>
              <h2 className="text-xl font-semibold">Hints</h2>
            </CardHeader>
            <CardContent>
              {problem1.hints.length === 0 ? (
                <div className="flex flex-col items-center space-y-2 justify-center">
                  <img src={noHints.src} alt="No hints available" />
                  <p className="text-2xl font-semibold">No Hints</p>
                </div>
              ) : (
                <ol className="list-decimal list-inside">
                  {problem1.hints.map((hint, idx) => {
                    const sanitizedHint = DOMPurify.sanitize(hint);
                    return (
                      <li
                        key={idx}
                        dangerouslySetInnerHTML={{ __html: sanitizedHint }}
                      />
                    );
                  })}
                </ol>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen border-2 flex flex-col items-center justify-center gap-4">
      <div className="text-4xl shadow-sm px-4 py-2 rounded-md font-bold">
        {formatTime(timeLeft)}
      </div>
      {content}

      <Button onClick={switchPhase}>End Session</Button>
    </div>
  );
}
