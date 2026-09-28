import type { Payee } from "@/types/banking";

export function buildPayees(userId: string): Payee[] {
  if (userId === "olson2428") {
    return [
      {
        id: `${userId}-payee-1`,
        userId,
        name: "Carolinas Power",
        maskedAccount: "•••• 8821",
        address: "PO Box 6600, Charlotte, NC 28201",
        category: "Utilities",
        email: "billing@carolinaspower.example",
      },
      {
        id: `${userId}-payee-2`,
        userId,
        name: "City Water",
        maskedAccount: "•••• 4430",
        address: "PO Box 1100, Charlotte, NC 28202",
        category: "Utilities",
        email: "pay@citywater.example",
      },
      {
        id: `${userId}-payee-3`,
        userId,
        name: "Spectrum Internet",
        maskedAccount: "•••• 7714",
        address: "400 Spectrum Blvd, Charlotte, NC 28203",
        category: "Utilities",
        email: "accounts@spectrum.example",
      },
      {
        id: `${userId}-payee-4`,
        userId,
        name: "Ridgewood Property Mgmt",
        maskedAccount: "•••• 1247",
        address: "1247 Ridgewood Drive Office, Charlotte, NC 28211",
        category: "Rent",
        email: "leasing@ridgewoodproperties.example",
      },
      {
        id: `${userId}-payee-5`,
        userId,
        name: "Shield Auto Insurance",
        maskedAccount: "•••• 9934",
        address: "PO Box 500, Raleigh, NC 27601",
        category: "Insurance",
        email: "premiums@shieldauto.example",
      },
    ];
  }
  if (userId === "Jojo_01") {
    return [
      {
        id: `${userId}-payee-1`,
        userId,
        name: "Northstar Electric",
        maskedAccount: "•••• 5521",
        address: "PO Box 4410, Charlotte, NC 28201",
        category: "Utilities",
        email: "billing@northstar-electric.example",
      },
      {
        id: `${userId}-payee-2`,
        userId,
        name: "Metro Water",
        maskedAccount: "•••• 8830",
        address: "PO Box 902, Charlotte, NC 28202",
        category: "Utilities",
        email: "pay@metrowater.example",
      },
      {
        id: `${userId}-payee-3`,
        userId,
        name: "Civic Internet",
        maskedAccount: "•••• 1174",
        address: "500 Exchange Ave, Charlotte, NC 28203",
        category: "Utilities",
        email: "accounts@civicinternet.example",
      },
      {
        id: `${userId}-payee-4`,
        userId,
        name: "Evergreen Mobile",
        maskedAccount: "•••• 6647",
        address: "1200 Signal Way, Charlotte, NC 28204",
        category: "Phone",
        email: "care@evergreenmobile.example",
      },
      {
        id: `${userId}-payee-5`,
        userId,
        name: "Pioneer Insurance",
        maskedAccount: "•••• 3395",
        address: "PO Box 77, Raleigh, NC 27601",
        category: "Insurance",
        email: "premiums@pioneerinsurance.example",
      },
    ];
  }
  return [
    {
      id: `${userId}-payee-1`,
      userId,
      name: "Northstar Electric",
      maskedAccount: "•••• 2210",
      address: "PO Box 4410, Seattle, WA 98101",
      category: "Utilities",
      email: "billing@northstar-electric.example",
    },
    {
      id: `${userId}-payee-2`,
      userId,
      name: "Metro Water",
      maskedAccount: "•••• 4417",
      address: "PO Box 902, Seattle, WA 98104",
      category: "Utilities",
      email: "pay@metrowater.example",
    },
    {
      id: `${userId}-payee-3`,
      userId,
      name: "Civic Internet",
      maskedAccount: "•••• 9902",
      address: "500 Exchange Ave, Seattle, WA 98109",
      category: "Utilities",
      email: "accounts@civicinternet.example",
    },
    {
      id: `${userId}-payee-4`,
      userId,
      name: "Harborview Residences",
      maskedAccount: "•••• 7788",
      address: "91 Bayview Terrace Office, Seattle, WA 98109",
      category: "Rent",
      email: "leasing@harborviewresidences.example",
    },
  ];
}
