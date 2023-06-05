import {
  PlatformFeatureType,
  PriceType, SpaceSizeUnit, SpaceStatus, StockManagementType,
} from 'typings/graphql.types';

export interface ILocalizedNames {
  id: number;
  name_en: string;
  name_th: string;
  name_jp: string;
  name_kr: string;
}

export interface ISiteAddress {
  lat: number;
  lng: number;
  city: ILocalizedNames;
  district: ILocalizedNames;
}

export interface ISpacePrice {
  currency_sign: string;
  price_per_month: number | null;
  type: PriceType;
  currency: string;
}

export interface ISpace {
  id: number;
  size: number;
  size_unit: SpaceSizeUnit;
  length: number;
  width: number;
  height: number;
  available_units: number | null;
  space_type?: ISpaceType;
  features: ILocalizedNames[];
  stock_available_until?: string;
  prices: ISpacePrice[];
  status: SpaceStatus;
}

export interface ISpaces {
  edges: ISpace[];
}

export interface ISite {
  id: number;
  name_en: string | null;
  name_th: string | null;
  name_kr: string | null;
  name_jp: string | null;
  description_en: string | null;
  description_th: string | null;
  description_jp: string | null;
  description_kr: string | null;
  images: string[] | null;
  is_featured: boolean;
  features?: IFeatures[];
  address: ISiteAddress | null;
  spaces: ISpaces;
  total_active_spaces: number;
  stock_management_type: StockManagementType;
}

export interface ISpaceType {
  id: number;
  icon: string | null;
  name_en: string;
  is_locker?: boolean;
  name_th: string;
  name_jp: string;
  name_kr: string;
  gif: string;
  description_en: string;
  description_jp: string;
  description_th: string;
  description_kr: string;
  unit: SpaceSizeUnit;
  size_from: number;
  size_to: number;
  size?: number;
}

export interface IFeatures {
  id: number;
  icon: string | null;
  type: PlatformFeatureType,
  name_en: string;
  name_th: string;
  name_jp: string;
  name_kr: string;
}

export interface IMapSite {
  id: number;
  name_en: string;
  name_th: string;
  name_kr: string;
  name_jp: string;
  images: string[];
  address: ISiteAddress;
  pricePerMonth: number;
  currencySign: string;
}

export interface ITrackingPayloadBooking {
  bookingId: string;
  bookingStatus: string;
  spaceId: string;
  spaceSize: string;
  promoPublic: string;
  promoCode: string;
  siteName: string;
  siteId: string;
  insuranceName: string;
  insuranceAmount: string;
  currency: string;
  userId: string;
  customerName: string;
  customerPhone: number|string;
  customerEmail: string;
  baseAmount: string;
  subTotalAmount: string;
  depositAmount: string;
  totalAmount: string;
  discountAmount: string;
  country: string;
  quotationId: string;
  platform: string;
}

export interface ITrackingEstimator {
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  language: string;
  country: string;
  platform: string;
  districtName: string;
  city: string;
  boxSize?: number;
  totalBoxes: number;
  recommendedPlan: number | string;
  roomType?: string;
  objectsType?: string;
  boxType?: string | number;
}

export interface ITrackingHome {
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  userId: number;
  currency: string;
  status: string;
  siteName: string;
  country: string;
}

export interface ITrackingHost {
  country: string;
  platform: string;
  language: string;
  customerPhone: string;
  customerEmail: string;
  customerName: string;
  userId: number;
}

export interface ITrackingSearch {
  discountAmount?: number;
  totalAmount?: number;
  depositAmount?: number;
  subTotalAmount?: number;
  baseAmount?: number;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  insuranceAmount?: number;
  siteId?: string;
  platform?: string;
  userId: number;
  currency: string;
  status: string;
  spaceSize?: string;
  siteName: string;
  country: string;
  type: string;
}

export interface ITrackingSignOut {
  platform: string;
  language: string;
  identity: string;
  customerPhone: string;
  country: string;
  customerEmail: string;
  userId: number;
  customerName: string;
}
