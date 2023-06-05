/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EntityIdFilter, SiteStatusFilter, PlatformFeatureType } from "./../../../../typings/graphql.types";

// ====================================================
// GraphQL query operation: SimilarStorageQuery
// ====================================================

export interface SimilarStorageQuery_sites_edges_address_country {
  name_en: string;
  name_th: string;
  name_jp: string;
  name_kr: string;
}

export interface SimilarStorageQuery_sites_edges_address_city {
  name_en: string;
  name_th: string;
  name_jp: string;
  name_kr: string;
}

export interface SimilarStorageQuery_sites_edges_address_district {
  name_en: string;
  name_th: string;
  name_jp: string;
  name_kr: string;
  id: number;
}

export interface SimilarStorageQuery_sites_edges_address {
  lat: number;
  lng: number;
  country: SimilarStorageQuery_sites_edges_address_country;
  city: SimilarStorageQuery_sites_edges_address_city;
  district: SimilarStorageQuery_sites_edges_address_district | null;
}

export interface SimilarStorageQuery_sites_edges_features {
  id: number;
  icon: string | null;
  type: PlatformFeatureType;
  name_en: string;
  name_th: string;
  name_jp: string;
  name_kr: string;
}

export interface SimilarStorageQuery_sites_edges {
  id: number;
  name_en: string | null;
  name_th: string | null;
  name_jp: string | null;
  name_kr: string | null;
  description_en: string | null;
  description_jp: string | null;
  description_th: string | null;
  description_kr: string | null;
  images: string[] | null;
  address: SimilarStorageQuery_sites_edges_address | null;
  features: SimilarStorageQuery_sites_edges_features[];
}

export interface SimilarStorageQuery_sites_page_info {
  has_more: boolean | null;
  total: number;
  limit: number;
}

export interface SimilarStorageQuery_sites {
  edges: SimilarStorageQuery_sites_edges[];
  page_info: SimilarStorageQuery_sites_page_info;
}

export interface SimilarStorageQuery {
  sites: SimilarStorageQuery_sites;
}

export interface SimilarStorageQueryVariables {
  districtId?: EntityIdFilter | null;
  countryId?: EntityIdFilter | null;
  cityId?: EntityIdFilter | null;
  status?: SiteStatusFilter | null;
  limit: number;
  skip: number;
}
