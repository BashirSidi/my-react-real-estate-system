import gql from 'graphql-tag';

export const PLATFORM_SPACE_TYPES_QUERY = gql`
query PlatformSpaceTypes($country: FixedCountry!, $districtIds: [Int!]) {
  space_types(pagination: {
    limit: 50,
    skip: 0
  }, where: {
    country:{
      _eq: $country
    }
  }) {
    edges {
      id
      icon
      size_from
      size_to
      is_locker
      gif
      gif_large
      unit
      name_en
      name_th
      name_jp
      name_kr
      description_en
      description_th
      description_jp
      description_kr
      image
      country {
        name_en
        name_th
        name_jp
        name_kr
      }
      features{
        id
        name_en
        name_th
        name_jp
        name_kr
        category{
            id
            name_en
            name_th
            name_jp
            name_kr
        }
      }
      spaces(
        where:{
          district_ids:{
            _in: $districtIds
          }
        }
      ){
        edges{
          id
          prices{
            price_per_month
            currency
            currency_sign
          }
        }
      }
    } 
  }
}
`;

export const CREATE_QUOTATION_MUTATION = gql`
  mutation createQuotation($payload: QuotationPayload!) {
    createQuotation (payload: $payload) {
      success
    }
  }
`;
