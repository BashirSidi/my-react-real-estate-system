/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SitesFilter, Pagination, SpaceSizeUnit } from "./../../../../../../../typings/graphql.types";

// ====================================================
// GraphQL query operation: getDarkStorageQuery
// ====================================================

export interface getDarkStorageQuery_sites_edges_spaces_edges_prices {
  price_per_month: number | null;
  currency: string;
  currency_sign: string;
}

export interface getDarkStorageQuery_sites_edges_spaces_edges {
  id: number;
  name: string | null;
  size: number;
  size_unit: SpaceSizeUnit;
  width: number;
  height: number;
  length: number;
  images: string[] | null;
  prices: getDarkStorageQuery_sites_edges_spaces_edges_prices[];
}

export interface getDarkStorageQuery_sites_edges_spaces {
  edges: getDarkStorageQuery_sites_edges_spaces_edges[];
}

export interface getDarkStorageQuery_sites_edges {
  id: number;
  name: string | null;
  name_en: string | null;
  name_th: string | null;
  name_jp: string | null;
  name_kr: string | null;
  description: string | null;
  spaces: getDarkStorageQuery_sites_edges_spaces;
}

export interface getDarkStorageQuery_sites {
  edges: getDarkStorageQuery_sites_edges[];
}

export interface getDarkStorageQuery {
  sites: getDarkStorageQuery_sites;
}

export interface getDarkStorageQueryVariables {
  where?: SitesFilter | null;
  pagination: Pagination;
  spacesLimit: number;
}
