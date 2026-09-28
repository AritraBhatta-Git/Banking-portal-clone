import type { UserProfile } from "@/types/banking";

export interface DemoUser {
  userId: string;
  password: string;
}

/** Demo-only credentials. Frontend prototype — never use real credentials. */
export const DEMO_USERS: DemoUser[] = [
  { userId: "olson2428", password: "Gary242899" },
  { userId: "Jojo_01", password: "test@123" },
  { userId: "jojo_02", password: "test@123" },
];

export const PROFILES: Record<string, UserProfile> = {
  olson2428: {
    userId: "olson2428",
    displayName: "Gary Olson",
    firstName: "Gary",
    email: "gary.olson@example.demo",
    phone: "(704) 555-0183",
    addressLine1: "1247 Ridgewood Drive",
    addressLine2: "Suite 4A",
    city: "Charlotte",
    state: "NC",
    zip: "28211",
    preferredContact: "Email",
    memberSince: "January 2017",
  },
  Jojo_01: {
    userId: "Jojo_01",
    displayName: "Jojo Van Carter",
    firstName: "Jojo",
    email: "jojo.carter@example.demo",
    phone: "(555) 014-2288",
    addressLine1: "482 Alder Court",
    addressLine2: "Apt 6B",
    city: "Charlotte",
    state: "NC",
    zip: "28204",
    preferredContact: "Email",
    memberSince: "March 2019",
  },
  jojo_02: {
    userId: "jojo_02",
    displayName: "Jojo Alexander",
    firstName: "Jojo",
    email: "jojo.alexander@example.demo",
    phone: "(555) 019-7741",
    addressLine1: "91 Bayview Terrace",
    addressLine2: "Unit 12",
    city: "Seattle",
    state: "WA",
    zip: "98109",
    preferredContact: "Phone",
    memberSince: "August 2021",
  },
};
