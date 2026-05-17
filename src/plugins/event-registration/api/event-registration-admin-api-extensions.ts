import gql from 'graphql-tag';

export const eventRegistrationAdminApiExtensions = gql`
    extend type Query {
        exportEventRegistrationsCsv: String!
    }
`;