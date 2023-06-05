import gql from 'graphql-tag';

const AGREEMENT_QUERY = gql`
  query GetAgreement($id: Int , $site_id: Int) {
    agreement(id: $id, site_id: $site_id)
    {
      title_en
      title_th
      title_jp
      title_kr
      content_en
      content_th
      content_jp
      content_kr
      is_default
    }
  }
`;

export {
  AGREEMENT_QUERY,
};
