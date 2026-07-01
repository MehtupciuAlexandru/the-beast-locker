import gql from 'graphql-tag';

export const coleteShippingShopApiExtensions = gql`
    type ColeteCheckoutQuote {
        deliveryType: String!
        priceWithTax: Float!
        priceWithoutTax: Float
        courierName: String
        serviceName: String
        serviceId: Int
        activationId: String
        shippingPointId: Int
        shippingPointName: String
        shippingPointType: String
        shippingPointAddress: String
        shippingPointLat: Float
        shippingPointLng: Float
        shippingPointCounty: String
        distanceKm: Float
    }

    input ColeteCheckoutSelectionInput {
        deliveryType: String!
        priceWithTax: Float!
        priceWithoutTax: Float
        courierName: String
        serviceName: String
        serviceId: Int
        activationId: String
        shippingPointId: Int
        shippingPointName: String
        shippingPointType: String
        shippingPointAddress: String
        shippingPointLat: Float
        shippingPointLng: Float
        shippingPointCounty: String
        shippingPointDistanceKm: Float
    }

    input ColeteAddressValidationInput {
        fullName: String!
        phoneNumber: String!
        streetLine1: String!
        streetLine2: String
        city: String!
        province: String!
        postalCode: String!
        countryCode: String!
    }

    type ColeteAddressValidationResult {
        valid: Boolean!
        message: String
        city: String
        county: String
        countyCode: String
        street: String
        phoneNumber: String
    }

    extend type Query {
        coleteCheckoutAddressQuote: ColeteCheckoutQuote!
        coleteCheckoutShippingPoints: [ColeteCheckoutQuote!]!
        validateColeteAddress(input: ColeteAddressValidationInput!): ColeteAddressValidationResult!
    }

    extend type Mutation {
        setColeteCheckoutSelection(input: ColeteCheckoutSelectionInput!): Order!
    }
`;
