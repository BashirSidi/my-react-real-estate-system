/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAgreement
// ====================================================

export interface GetAgreement_agreement {
  title_en: string;
  title_th: string;
  title_jp: string;
  title_kr: string;
  content_en: string;
  content_th: string;
  content_jp: string;
  content_kr: string;
  is_default: boolean;
}

export interface GetAgreement {
  agreement: GetAgreement_agreement | null;
}

export interface GetAgreementVariables {
  id?: number | null;
  site_id?: number | null;
}
