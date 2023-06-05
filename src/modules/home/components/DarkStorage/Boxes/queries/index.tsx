import gql from 'graphql-tag';

const GET_DARK_STORAGE_QUERY = gql`
query getDarkStorageQuery($where: SitesFilter, $pagination: Pagination!, $spacesLimit: Int!) {
  sites(pagination: $pagination  where: $where) {
    edges {
      id
      name
      name_en
      name_th
      name_jp
      name_kr
      description
      spaces(
        where: {status: {_eq: ACTIVE} }
        sort_by: {price: asc }
        pagination: {limit: $spacesLimit, skip:0}
      ) {
        edges {
          id
          name
          size
          size_unit
          width
          height
          length
          images
          prices {
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

export {
  GET_DARK_STORAGE_QUERY,
};
