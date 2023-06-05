/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlatformFeatureType } from "./../../../../../typings/graphql.types";

// ====================================================
// GraphQL fragment: SiteAmenitiesDetailsFragment
// ====================================================

export interface SiteAmenitiesDetailsFragment_features {
  id: number;
  icon: string | null;
  type: PlatformFeatureType;
  name_en: string;
  name_th: string;
  name_jp: string;
  name_kr: string;
}

export interface SiteAmenitiesDetailsFragment {
  features: SiteAmenitiesDetailsFragment_features[];
}
