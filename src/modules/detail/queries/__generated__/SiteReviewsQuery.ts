/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { QuotationStatus } from "./../../../../typings/graphql.types";

// ====================================================
// GraphQL query operation: SiteReviewsQuery
// ====================================================

export interface SiteReviewsQuery_sites_edges_url_3d {
  floor: number;
  url: string;
}

export interface SiteReviewsQuery_sites_edges_reviews {
  total: number;
  average_rating: number;
}

export interface SiteReviewsQuery_sites_edges_quotation_items {
  id: number;
}

export interface SiteReviewsQuery_sites_edges_quotation {
  id: number;
  uuid: string;
  status: QuotationStatus;
  move_in_date: any;
  items: (SiteReviewsQuery_sites_edges_quotation_items | null)[];
}

export interface SiteReviewsQuery_sites_edges_features {
  name_en: string;
}

export interface SiteReviewsQuery_sites_edges_address_district {
  name_en: string;
}

export interface SiteReviewsQuery_sites_edges_address {
  district: SiteReviewsQuery_sites_edges_address_district | null;
}

export interface SiteReviewsQuery_sites_edges {
  id: number;
  name: string | null;
  google_reviews_widget_id: string | null;
  url_3d: SiteReviewsQuery_sites_edges_url_3d[] | null;
  reviews: SiteReviewsQuery_sites_edges_reviews;
  quotation: SiteReviewsQuery_sites_edges_quotation | null;
  is_featured: boolean;
  features: SiteReviewsQuery_sites_edges_features[];
  address: SiteReviewsQuery_sites_edges_address | null;
}

export interface SiteReviewsQuery_sites {
  edges: SiteReviewsQuery_sites_edges[];
}

export interface SiteReviewsQuery {
  sites: SiteReviewsQuery_sites;
}

export interface SiteReviewsQueryVariables {
  siteId: number;
  quotationId?: string | null;
  reqQuotations: boolean;
}
