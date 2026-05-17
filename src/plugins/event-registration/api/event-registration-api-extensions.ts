import gql from 'graphql-tag';

export const eventRegistrationApiExtensions = gql`
    input SubmitEventRegistrationInput {
        eventName: String!
        fullName: String!
        sportsClub: String
        phoneNumber: String!
        email: String!
        gdprConsent: Boolean!
    }

    type EventRegistrationSuccess {
        success: Boolean!
    }

    type EventRegistrationError {
        message: String!
        code: String!
    }

    union SubmitEventRegistrationResult = EventRegistrationSuccess | EventRegistrationError

    extend type Mutation {
        submitEventRegistration(input: SubmitEventRegistrationInput!): SubmitEventRegistrationResult!
    }
`;