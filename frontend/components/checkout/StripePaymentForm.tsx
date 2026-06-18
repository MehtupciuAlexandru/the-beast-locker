"use client";

import { FormEvent, useState } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

type StripePaymentFormProps = {
    clientSecret: string;
};

export default function StripePaymentForm({ clientSecret }: StripePaymentFormProps) {
    if (!stripePromise) {
        return (
            <p className="text-xs text-red-600">
                Lipsește cheia publică Stripe.
            </p>
        );
    }

    return (
        <Elements
            key={clientSecret}
            stripe={stripePromise}
            options={{
                clientSecret,
                appearance: {
                    theme: "stripe",
                },
                locale: "ro",
            }}
        >
            <StripePaymentInnerForm />
        </Elements>
    );
}

function StripePaymentInnerForm() {
    const stripe = useStripe();
    const elements = useElements();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setIsSubmitting(true);
        setErrorMessage(null);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/confirmation`,
            },
        });

        if (error) {
            setErrorMessage(error.message || "Plata nu a putut fi finalizată.");
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <PaymentElement />

            {errorMessage && (
                <p className="text-xs text-red-600">
                    {errorMessage}
                </p>
            )}

            <button
                type="submit"
                disabled={!stripe || !elements || isSubmitting}
                className="w-full h-[46px] bg-black text-white text-[11px] font-Inter18Semibold uppercase tracking-[0.08em] hover:bg-[#1c1c1e] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? "Se procesează..." : "Confirmă plata"}
            </button>
        </form>
    );
}