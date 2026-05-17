const API_URL = process.env.NEXT_PUBLIC_API_URL;

type SubmitEventRegistrationInput = {
    eventName: string;
    fullName: string;
    sportsClub?: string;
    phoneNumber: string;
    email: string;
    gdprConsent: boolean;
};

export async function submitEventRegistration(input: SubmitEventRegistrationInput) {
    if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not defined");
    }

    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: `
                mutation SubmitEventRegistration($input: SubmitEventRegistrationInput!) {
                    submitEventRegistration(input: $input) {
                        __typename
                        ... on EventRegistrationSuccess {
                            success
                        }
                        ... on EventRegistrationError {
                            message
                            code
                        }
                    }
                }
            `,
            variables: {
                input,
            },
        }),
    });

    if (!res.ok) {
        throw new Error(`Failed to submit registration: ${res.status}`);
    }

    const json = await res.json();

    if (json.errors) {
        throw new Error(json.errors[0].message);
    }

    const result = json.data?.submitEventRegistration;

    if (!result) {
        throw new Error("No response from server");
    }

    if (result.__typename !== "EventRegistrationSuccess") {
        throw new Error(result.message || "Registration failed");
    }

    return result;
}