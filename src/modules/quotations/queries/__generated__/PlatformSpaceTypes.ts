/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FixedCountry, SpaceSizeUnit } from "./../../../../typings/graphql.types";

// ====================================================
// GraphQL query operation: PlatformSpaceTypes
// ====================================================

export interface PlatformSpaceTypes_space_types_edges_country {
  name_en: string;
  name_th: string;
  name_jp: string;
  name_kr: string;
}

export interface PlatformSpaceTypes_space_types_edges_features_category {
  id: number;
  name_en: string;
  name_th: string;
  name_jp: string;
  name_kr: string;
}

export interface PlatformSpaceTypes_space_types_edges_features {
  id: number;
  name_en: string;
  name_th: string;
  name_jp: string;
  name_kr: string;
  category: PlatformSpaceTypes_space_types_edges_features_category;
}

export interface PlatformSpaceTypes_space_types_edges_spaces_edges_prices {
  price_per_month: number | null;
  currency: string;
  currency_sign: string;
}

export interface PlatformSpaceTypes_space_types_edges_spaces_edges {
  id: number;
  prices: PlatformSpaceTypes_space_types_edges_spaces_edges_prices[];
}

export interface PlatformSpaceTypes_space_types_edges_spaces {
  edges: PlatformSpaceTypes_space_types_edges_spaces_edges[];
}

export interface PlatformSpaceTypes_space_types_edges {
  id: number;
  icon: string | null;
  size_from: number;
  size_to: number;
  is_locker: boolean | null;
  gif: string | null;
  gif_large: string | null;
  unit: SpaceSizeUnit;
  name_en: string;
  name_th: string;
  name_jp: string;
  name_kr: string;
  description_en: string | null;
  description_th: string | null;
  description_jp: string | null;
  description_kr: string | null;
  image: string | null;
  country: PlatformSpaceTypes_space_types_edges_country;
  features: PlatformSpaceTypes_space_types_edges_features[] | null;
  spaces: PlatformSpaceTypes_space_types_edges_spaces | null;
}

export interface PlatformSpaceTypes_space_types {
  edges: PlatformSpaceTypes_space_types_edges[];
}

export interface PlatformSpaceTypes {
  space_types: PlatformSpaceTypes_space_types;
}

export interface PlatformSpaceTypesVariables {
  country: FixedCountry;
  districtIds?: number[] | null;
}
