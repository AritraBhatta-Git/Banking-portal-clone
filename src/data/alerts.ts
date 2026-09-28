import type { AlertItem } from "@/types/banking";
import { isoDaysFromToday } from "@/lib/formatters";

export function buildAlerts(userId: string): AlertItem[] {
  if (userId === "olson2428") {
    return [
      {
        id: `${userId}-al-1`,
        userId,
        category: "Security",
        title: "New sign-in detected",
        message:
          "We noticed a sign-in to your account from Windows 11 PC · Chrome in Charlotte, NC. If this was you, no action is needed.",
        date: isoDaysFromToday(0),
        read: false,
        severity: "info",
      },
      {
        id: `${userId}-al-2`,
        userId,
        category: "Transaction",
        title: "Pending purchase at HARVEST MARKET",
        message:
          "A debit card purchase of $71.08 at HARVEST MARKET is pending and should post within 1–2 business days.",
        date: isoDaysFromToday(-1),
        read: false,
        severity: "info",
      },
      {
        id: `${userId}-al-3`,
        userId,
        category: "Payment",
        title: "Upcoming payment: Spectrum Internet",
        message:
          "Your scheduled payment of $89.99 to Spectrum Internet will be delivered from Everyday Checking in 2 days.",
        date: isoDaysFromToday(-2),
        read: false,
        severity: "info",
      },
      {
        id: `${userId}-al-4`,
        userId,
        category: "General",
        title: "Spending insights ready",
        message:
          "Your monthly category insights are ready. Review where your money went and set budgets for next month.",
        date: isoDaysFromToday(-3),
        read: false,
        severity: "info",
      },
      {
        id: `${userId}-al-5`,
        userId,
        category: "Account",
        title: "September statement available",
        message:
          "Your Everyday Checking statement for the previous cycle is available under Statements & Documents.",
        date: isoDaysFromToday(-6),
        read: true,
        severity: "info",
      },
      {
        id: `${userId}-al-6`,
        userId,
        category: "Transaction",
        title: "Direct deposit posted",
        message: "PINNACLE STAFFING deposited $3,820.50 into Everyday Checking.",
        date: isoDaysFromToday(-8),
        read: true,
        severity: "info",
      },
      {
        id: `${userId}-al-7`,
        userId,
        category: "Security",
        title: "Failed sign-in attempt blocked",
        message:
          "An unrecognized device attempted to access your account from Atlanta, GA. Two-step verification blocked the attempt.",
        date: isoDaysFromToday(-5),
        read: true,
        severity: "warning",
      },
      {
        id: `${userId}-al-8`,
        userId,
        category: "Account",
        title: "Interest credited to Premier Savings",
        message: "Monthly interest of $23.54 was credited to your Premier Savings account.",
        date: isoDaysFromToday(-20),
        read: true,
        severity: "info",
      },
    ];
  }
  if (userId === "Jojo_01") {
    return [
      {
        id: `${userId}-al-1`,
        userId,
        category: "Security",
        title: "New sign-in recognized",
        message:
          "We noticed a sign-in to your demo profile from Windows · Chrome in Charlotte, NC. If this was you, no action is needed.",
        date: isoDaysFromToday(0),
        read: false,
        severity: "info",
      },
      {
        id: `${userId}-al-2`,
        userId,
        category: "Transaction",
        title: "Pending purchase at METRO MARKET",
        message:
          "A debit card purchase of $67.53 at METRO MARKET is pending and should post within 1–2 business days.",
        date: isoDaysFromToday(-1),
        read: false,
        severity: "info",
      },
      {
        id: `${userId}-al-3`,
        userId,
        category: "Payment",
        title: "Upcoming payment: Civic Internet",
        message:
          "Your scheduled payment of $79.99 to Civic Internet will be delivered from Everyday Checking in 3 days.",
        date: isoDaysFromToday(-2),
        read: false,
        severity: "info",
      },
      {
        id: `${userId}-al-4`,
        userId,
        category: "General",
        title: "Try Spending & Budgeting",
        message:
          "Your monthly category insights are ready. Review where your money went and set demo budgets for next month.",
        date: isoDaysFromToday(-3),
        read: false,
        severity: "info",
      },
      {
        id: `${userId}-al-5`,
        userId,
        category: "Account",
        title: "September statement is ready",
        message:
          "Your Everyday Checking statement for the previous cycle is available under Statements & Documents.",
        date: isoDaysFromToday(-6),
        read: true,
        severity: "info",
      },
      {
        id: `${userId}-al-6`,
        userId,
        category: "Transaction",
        title: "Direct deposit posted",
        message: "ACME PAYROLL deposited $3,120.45 into Everyday Checking.",
        date: isoDaysFromToday(-8),
        read: true,
        severity: "info",
      },
      {
        id: `${userId}-al-7`,
        userId,
        category: "Security",
        title: "Passcode changed successfully",
        message:
          "Your demo passcode was updated. If you did not make this change, contact the demo support desk.",
        date: isoDaysFromToday(-12),
        read: true,
        severity: "warning",
      },
      {
        id: `${userId}-al-8`,
        userId,
        category: "Account",
        title: "Interest credited to Premier Savings",
        message: "Monthly interest of $19.66 was credited to your Premier Savings account.",
        date: isoDaysFromToday(-20),
        read: true,
        severity: "info",
      },
    ];
  }
  return [
    {
      id: `${userId}-al-1`,
      userId,
      category: "Security",
      title: "Two-step verification is off",
      message:
        "Add an extra layer of protection to your demo profile by enabling two-step verification in Security settings.",
      date: isoDaysFromToday(0),
      read: false,
      severity: "warning",
    },
    {
      id: `${userId}-al-2`,
      userId,
      category: "Transaction",
      title: "Card purchase declined",
      message:
        "A purchase of $899.00 at GADGET WORLD with your Travel Rewards Credit Card was declined. Review the transaction for details.",
      date: isoDaysFromToday(-1),
      read: false,
      severity: "critical",
    },
    {
      id: `${userId}-al-3`,
      userId,
      category: "Payment",
      title: "Upcoming payment: Northstar Electric",
      message:
        "Your scheduled payment of $92.00 to Northstar Electric will be delivered from Core Checking in 4 days.",
      date: isoDaysFromToday(-2),
      read: false,
      severity: "info",
    },
    {
      id: `${userId}-al-4`,
      userId,
      category: "Account",
      title: "Statement is ready",
      message:
        "Your Core Checking and High-Yield Savings statements for the previous cycle are available to view or download.",
      date: isoDaysFromToday(-5),
      read: false,
      severity: "info",
    },
    {
      id: `${userId}-al-5`,
      userId,
      category: "Transaction",
      title: "Payroll deposited",
      message: "NORTHBAY CONSULTING deposited $2,640.75 into Core Checking.",
      date: isoDaysFromToday(-7),
      read: true,
      severity: "info",
    },
    {
      id: `${userId}-al-6`,
      userId,
      category: "Payment",
      title: "Scheduled payment canceled",
      message:
        "Your one-time payment of $85.00 to Evergreen Mobile was canceled at your request.",
      date: isoDaysFromToday(-11),
      read: true,
      severity: "info",
    },
    {
      id: `${userId}-al-7`,
      userId,
      category: "General",
      title: "Rewards balance updated",
      message:
        "You now have 11,240 demo rewards points on your Travel Rewards Credit Card.",
      date: isoDaysFromToday(-16),
      read: true,
      severity: "info",
    },
  ];
}
