"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { submitEventRegistration } from "@/lib/api/eventRegistration";

export default function ValhallaRegistrationPage() {
    const router = useRouter();

    const [eventName, setEventName] = useState("Beast Arena");
    const [fullName, setFullName] = useState("");
    const [sportsClub, setSportsClub] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [gdprConsent, setGdprConsent] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError("");

        if (!gdprConsent) {
            setError("You must agree to the data processing terms before submitting.");
            return;
        }

        try {
            setIsSubmitting(true);

            await submitEventRegistration({
                eventName,
                fullName,
                sportsClub,
                phoneNumber,
                email,
                gdprConsent,
            });

            router.push("/valhalla-registration/thank-you");
        } catch (err: any) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-black px-4 py-10 text-white">
            <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 text-black shadow-2xl sm:p-8">
                <div className="mb-8 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
                        Beast Team MMA
                    </p>
                    <h1 className="mt-3 text-3xl font-black uppercase tracking-tight">
                        Valhalla Registration
                    </h1>
                    <p className="mt-3 text-sm text-gray-500">
                        Complete the form below to register for the event.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest">
                            Event Name
                        </label>
                        <input
                            value={eventName}
                            onChange={(event) => setEventName(event.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest">
                            Full Name
                        </label>
                        <input
                            value={fullName}
                            onChange={(event) => setFullName(event.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest">
                            Sports Club
                        </label>
                        <input
                            value={sportsClub}
                            onChange={(event) => setSportsClub(event.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest">
                            Phone Number
                        </label>
                        <input
                            value={phoneNumber}
                            onChange={(event) => setPhoneNumber(event.target.value)}
                            required
                            inputMode="tel"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest">
                            Email
                        </label>
                        <input
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                            type="email"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                        />
                    </div>

                    <label className="flex gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={gdprConsent}
                            onChange={(event) => setGdprConsent(event.target.checked)}
                            className="mt-1 h-4 w-4"
                        />
                        <span>
                            I agree that Beast Team MMA SRL may process my personal data
                            for registration and communication related to the selected
                            competition/event.
                        </span>
                    </label>

                    {error && (
                        <div className="rounded-lg bg-red-50 p-4 text-sm font-medium text-red-700">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-black px-6 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </form>
            </div>
        </main>
    );
}