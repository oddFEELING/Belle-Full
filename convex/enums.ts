/*
!!! important !!!

Never import from other files into this file.
This prevents circular dependencies.

🌹 Cheers.
*/

import { v } from "convex/values";

export const BrandRole = v.union(
  v.literal("PRIMARY_OWNER"),
  v.literal("SECONDARY_OWNER"),
);

export const WeekDay = v.union(
  v.literal("Monday"),
  v.literal("Tuesday"),
  v.literal("Wednesday"),
  v.literal("Thursday"),
  v.literal("Friday"),
  v.literal("Saturday"),
  v.literal("Sunday"),
);

export const RestaurantStatus = v.union(
  v.literal("DRAFT"),
  v.literal("PENDING_APPROVAL"),
  v.literal("ACTIVE"),
  v.literal("SUSPENDED"),
  v.literal("CLOSED"),
);

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
);

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

export const AddressType = v.union(
  v.literal("Restaurant"),
  v.literal("Customer"),
);

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

export const FulfilmentType = v.union(
  v.literal("DELIVERY"),
  v.literal("PICKUP"),
);

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

export const RestaurantLegalDocuments = v.union(
  v.literal("FOOD_BUSINESS_REGISTRATION_CONFIRMATION"),
  v.literal("FOOD_HYGIENE_CERTIFICATE"),
  v.literal("FOOD_SAFETY_MANAGEMENT"),
  v.literal("ALLERGEN_COMPLIANCE"),
  v.literal("PREMISIS_LICENSE"),
  v.literal("ALCOHOL_LIQUOR_LICENSE"),
);

export const ReastaurantDocumentType = v.union(
  v.literal("IMAGE"),
  v.literal("PDF"),
  v.literal("VIDEO"),
  v.literal("AUDIO"),
  v.literal("OTHER"),
);
