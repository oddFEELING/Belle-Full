/*
!!! important !!!

Never import from other files into this file.
This prevents circular dependencies.

🌹 Cheers.
*/

import { v, Infer } from "convex/values";

export const BrandRole = v.union(
  v.literal("PRIMARY_OWNER"),
  v.literal("SECONDARY_OWNER"),
);
export type BrandRole = Infer<typeof BrandRole>;

export const WeekDay = v.union(
  v.literal("Monday"),
  v.literal("Tuesday"),
  v.literal("Wednesday"),
  v.literal("Thursday"),
  v.literal("Friday"),
  v.literal("Saturday"),
  v.literal("Sunday"),
);
export type WeekDay = Infer<typeof WeekDay>;

export const RestaurantStatus = v.union(
  v.literal("DRAFT"),
  v.literal("PENDING_APPROVAL"),
  v.literal("ACTIVE"),
  v.literal("SUSPENDED"),
  v.literal("CLOSED"),
);
export type RestaurantStatus = Infer<typeof RestaurantStatus>;

export const DietaryTag = v.union(
  v.literal("Vegan"),
  v.literal("Vegetarian"),
  v.literal("Halal"),
  v.literal("GlutenFree"),
  v.literal("DiaryFree"),
  v.literal("NutFree"),
  v.literal("Spicy"),
  v.literal("Pescetarian"),
  v.literal("Paleo"),
  v.literal("Keto"),
  v.literal("GlutenFreeVegetarian"),
  v.literal("DiaryFreeVegetarian"),
  v.literal("NutFreeVegetarian"),
  v.literal("GlutenFreeVegan"),
  v.literal("DiaryFreeVegan"),
  v.literal("NutFreeVegan"),
);
export type DietaryTag = Infer<typeof DietaryTag>;
export enum DietaryTagEnum {
  KETO = "Keto",
  SPICY = "Spicy",
  PALEO = "Paleo",
  VEGAN = "Vegan",
  HALAL = "Halal",
  DIARY_FREE = "DiaryFree",
  NUT_FREE = "NutFree",
  GLUTEN_FREE = "GlutenFree",
  VEGETARIAN = "Vegetarian",
  PESCETARIAN = "Pescetarian",
  DIARY_FREE_VEGAN = "DiaryFreeVegan",
  NUT_FREE_VEGAN = "NutFreeVegan",
  GLUTEN_FREE_VEGAN = "GlutenFreeVegan",
  DIARY_FREE_VEGETARIAN = "DiaryFreeVegetarian",
  NUT_FREE_VEGETARIAN = "NutFreeVegetarian",
  GLUTEN_FREE_VEGETARIAN = "GlutenFreeVegetarian",
}

export const CuisineTag = v.union(
  v.literal("Nigerian"),
  v.literal("Ghanian"),
  v.literal("Ethopian"),
  v.literal("Kenyan"),
  v.literal("Eritrean"),
  v.literal("Somali"),
  v.literal("Senegalese"),
  v.literal("SouthAfrican"),
  v.literal("Moroccan"),
  v.literal("Tunisian"),
  v.literal("Algerian"),
  v.literal("Egyptian"),
  v.literal("Ugandan"),
  v.literal("Rwandan"),
  v.literal("Tanzanian"),
  v.literal("Malawian"),
  v.literal("Zambian"),
  v.literal("Zimbabwean"),
  v.literal("Namibian"),
  v.literal("Botswana"),
);
export type CuisineTag = Infer<typeof CuisineTag>;

export const Allergen = v.union(
  v.literal("Celery"),
  v.literal("CerealsContainingGluten"),
  v.literal("Crustaceans"),
  v.literal("Eggs"),
  v.literal("Fish"),
  v.literal("Lupin"),
  v.literal("Milk"),
  v.literal("Holluscs"),
  v.literal("Mustard"),
  v.literal("Peanuts"),
  v.literal("Sesame"),
  v.literal("Soybeans"),
  v.literal("SulphorDioxideAndSulphites"),
  v.literal("TreeNuts"),
  v.literal("Wheat"),
  v.literal("Other"),
);
export type Allergen = Infer<typeof Allergen>;

export enum AllergenEnum {
  CELERY = "Celery",
  CEREALS_CONTAINING_GLUTEN = "CerealsContainingGluten",
  CRUSTACEANS = "Crustaceans",
  EGGS = "Eggs",
  FISH = "Fish",
  LUPIN = "Lupin",
  MILK = "Milk",
  HOLLUSCS = "Holluscs",
  MUSTARD = "Mustard",
  PEANUTS = "Peanuts",
  SESAME = "Sesame",
  SOYBEANS = "Soybeans",
  SULPHOR_DIOXIDE_AND_SULPHITES = "SulphorDioxideAndSulphites",
  TREE_NUTS = "TreeNuts",
  WHEAT = "Wheat",
  OTHER = "Other",
}

export const AddressType = v.union(
  v.literal("Restaurant"),
  v.literal("Customer"),
);
export type AddressType = Infer<typeof AddressType>;

export const Currency = v.union(
  v.literal("GBP"),
  v.literal("USD"),
  v.literal("NGN"),
  v.literal("KES"),
  v.literal("ZAR"),
  v.literal("TZS"),
  v.literal("UGX"),
  v.literal("RWF"),
);
export type Currency = Infer<typeof Currency>;

export const FulfilmentType = v.union(
  v.literal("DELIVERY"),
  v.literal("PICKUP"),
);
export type FulfilmentType = Infer<typeof FulfilmentType>;

export const OrderStatus = v.union(
  v.literal("PENDING"),
  v.literal("ACCEPTED"),
  v.literal("IN_PREPARATION"),
  v.literal("READY_FOR_PICKUP"),
  v.literal("OUT_FOR_DELIVERY"),
  v.literal("DELIVERED"),
  v.literal("CANCELLED"),
  v.literal("PENDING_REFUND"),
  v.literal("REFUNDED"),
);
export type OrderStatus = Infer<typeof OrderStatus>;

export const RestaurantLegalDocuments = v.union(
  v.literal("FOOD_BUSINESS_REGISTRATION_CONFIRMATION"),
  v.literal("FOOD_HYGIENE_CERTIFICATE"),
  v.literal("FOOD_SAFETY_MANAGEMENT"),
  v.literal("ALLERGEN_COMPLIANCE"),
  v.literal("PREMISIS_LICENSE"),
  v.literal("ALCOHOL_LIQUOR_LICENSE"),
);
export type RestaurantLegalDocuments = Infer<typeof RestaurantLegalDocuments>;

export const DocumentType = v.union(
  v.literal("IMAGE"),
  v.literal("PDF"),
  v.literal("VIDEO"),
  v.literal("AUDIO"),
  v.literal("OTHER"),
);
export type DocumentType = Infer<typeof DocumentType>;

export const ReviewableItemStatus = v.union(
  v.literal("IN_REVIEW"),
  v.literal("ACTION_REQUIRED"),
  v.literal("APPROVED"),
  v.literal("REJECTED"),
);
export type ReviewableItemStatus = Infer<typeof ReviewableItemStatus>;
