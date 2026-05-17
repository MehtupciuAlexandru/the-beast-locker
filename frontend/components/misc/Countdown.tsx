"use client";

import { useEffect, useState } from "react";

export default function CountdownSection() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const targetDate = new Date("2026-07-26T10:00:00").getTime();

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000)
            });
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, []);

    const renderCircleDots = (value: number, totalDots: number, maxExpected: number) => {
        const activeDots = Math.min(totalDots, Math.round((value / maxExpected) * totalDots));

        return Array.from({ length: totalDots }).map((_, i) => {
            const angle = (i * 360) / totalDots;
            const isActive = i < activeDots;
            const isLastActive = i === activeDots - 1 && activeDots > 0;

            return (
                <circle
                    key={i}
                    cx="50"
                    cy="8"
                    r={totalDots === 16 ? "2.2" : "1.2"}
                    transform={`rotate(${angle}, 50, 50)`}
                    className={`transition-all duration-300 ${
                        isActive
                            ? isLastActive
                                ? "fill-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]"
                                : "fill-cyan-400"
                            : "fill-neutral-900"
                    }`}
                />
            );
        });
    };

    return (
        <section className="w-full bg-black text-white py-20 flex flex-col items-center justify-center select-none font-sans">
            <h2 className="text-center text-xs sm:text-sm font-light tracking-[0.6em] text-neutral-400 uppercase mb-16">
                COUNTDOWN
            </h2>

            <div className="grid grid-cols-2 md:flex md:flex-row gap-10 md:gap-16 justify-center items-center max-w-4xl mx-auto px-4">

                <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                            {renderCircleDots(timeLeft.days, 40, 99)}
                        </svg>
                        <span className="text-3xl sm:text-4xl font-mono font-normal tracking-tight">
                            {String(timeLeft.days).padStart(2, "0")}
                        </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-light tracking-[0.25em] text-neutral-400 uppercase mt-4">
                        DAYS
                    </span>
                </div>

                <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                            {renderCircleDots(timeLeft.hours, 16, 24)}
                        </svg>
                        <span className="text-3xl sm:text-4xl font-mono font-normal tracking-tight">
                            {String(timeLeft.hours).padStart(2, "0")}
                        </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-light tracking-[0.25em] text-neutral-400 uppercase mt-4">
                        HOURS
                    </span>
                </div>

                <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                            {renderCircleDots(timeLeft.minutes, 50, 60)}
                        </svg>
                        <span className="text-3xl sm:text-4xl font-mono font-normal tracking-tight">
                            {String(timeLeft.minutes).padStart(2, "0")}
                        </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-light tracking-[0.25em] text-neutral-400 uppercase mt-4">
                        MINUTES
                    </span>
                </div>

                <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                            {renderCircleDots(timeLeft.seconds, 50, 60)}
                        </svg>
                        <span className="text-3xl sm:text-4xl font-mono font-normal tracking-tight">
                            {String(timeLeft.seconds).padStart(2, "0")}
                        </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-light tracking-[0.25em] text-neutral-400 uppercase mt-4">
                        SECONDS
                    </span>
                </div>

            </div>
        </section>
    );
}