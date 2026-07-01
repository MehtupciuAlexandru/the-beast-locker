import gql from 'graphql-tag';

export const coleteShippingAdminApiExtensions = gql`
    type ColeteAwbGenerationResult {
        success: Boolean!
        message: String
        awb: String
        uniqueId: String
        courierName: String
        serviceName: String
        estimatedPickupDate: String
        order: Order
    }

    extend type Mutation {
        generateColeteAwb(orderId: ID!): ColeteAwbGenerationResult!
    }
`;
