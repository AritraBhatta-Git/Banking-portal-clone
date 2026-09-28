import type {
  SpendingCategory,
  Transaction,
  TransactionDirection,
  TransactionStatus,
} from "@/types/banking";
import { isoDaysFromToday } from "@/lib/formatters";

export type AccountKey = "checking" | "savings" | "credit";

export interface RawTx {
  d: number;
  acct: AccountKey;
  desc: string;
  merchant: string;
  cat: SpendingCategory;
  amt: number;
  dir: TransactionDirection;
  type: string;
  status?: TransactionStatus;
  method?: string;
}

export const OPENING_BALANCES: Record<string, Record<AccountKey, number>> = {
  olson2428: { checking: 9210.0, savings: 17100.0, credit: 842.31 },
  Jojo_01: { checking: 7842.1, savings: 18250.0, credit: 968.42 },
  jojo_02: { checking: 4215.55, savings: 26480.9, credit: 612.3 },
};

// ---------------------------------------------------------------------------
// Gary Olson (olson2428) — primary demo user
// Target closing balances: checking ~$16,653.22 | savings ~$19,557.18 | credit ~$1,369.31
// ---------------------------------------------------------------------------
const OLSON_RAW: RawTx[] = [
  // ~70 days ago
  { d: 72, acct: "checking", desc: "PINNACLE STAFFING DIRECT DEPOSIT", merchant: "PINNACLE STAFFING", cat: "Income", amt: 3820.50, dir: "credit", type: "Direct Deposit", method: "Direct deposit" },
  { d: 70, acct: "checking", desc: "RIDGEWOOD PROPERTY MGMT RENT", merchant: "RIDGEWOOD PROPERTY MGMT", cat: "Housing", amt: 1750.00, dir: "debit", type: "ACH Payment", method: "ACH debit" },
  { d: 69, acct: "credit", desc: "HARVEST MARKET PURCHASE", merchant: "HARVEST MARKET", cat: "Food", amt: 63.48, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 68, acct: "checking", desc: "HARVEST MARKET PURCHASE", merchant: "HARVEST MARKET", cat: "Food", amt: 91.14, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 67, acct: "credit", desc: "JETBLUE AIRFARE PURCHASE", merchant: "JETBLUE AIRWAYS", cat: "Transportation", amt: 314.00, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 66, acct: "checking", desc: "CAROLINAS POWER UTILITY PAYMENT", merchant: "CAROLINAS POWER", cat: "Utilities", amt: 124.60, dir: "debit", type: "Utility Payment", method: "Online bill pay" },
  { d: 65, acct: "savings", desc: "MONTHLY INTEREST CREDIT", merchant: "Bank of America", cat: "Interest", amt: 22.18, dir: "credit", type: "Interest", status: "Completed", method: "Automatic" },
  { d: 64, acct: "checking", desc: "SUMMIT COFFEE CO PURCHASE", merchant: "SUMMIT COFFEE CO", cat: "Food", amt: 7.25, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 63, acct: "credit", desc: "SUMMIT COFFEE CO PURCHASE", merchant: "SUMMIT COFFEE CO", cat: "Food", amt: 5.90, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 62, acct: "checking", desc: "STREAMLINE SUBSCRIPTION", merchant: "STREAMLINE", cat: "Subscriptions", amt: 17.99, dir: "debit", type: "Recurring Payment", method: "Debit card" },
  { d: 61, acct: "credit", desc: "STREAMLINE SUBSCRIPTION", merchant: "STREAMLINE", cat: "Subscriptions", amt: 15.99, dir: "debit", type: "Recurring Payment", method: "Credit card" },
  { d: 60, acct: "checking", desc: "CROSSTOWN FUEL PURCHASE", merchant: "CROSSTOWN FUEL", cat: "Transportation", amt: 52.30, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 59, acct: "credit", desc: "THE COPPER FORK RESTAURANT", merchant: "THE COPPER FORK", cat: "Food", amt: 74.80, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 58, acct: "checking", desc: "PINNACLE STAFFING DIRECT DEPOSIT", merchant: "PINNACLE STAFFING", cat: "Income", amt: 3820.50, dir: "credit", type: "Direct Deposit", method: "Direct deposit" },
  { d: 56, acct: "checking", desc: "TRANSFER TO PREMIER SAVINGS", merchant: "Bank of America", cat: "Transfers", amt: 600.00, dir: "debit", type: "Internal Transfer", status: "Completed", method: "Online transfer" },
  { d: 56, acct: "savings", desc: "TRANSFER FROM EVERYDAY CHECKING", merchant: "Bank of America", cat: "Transfers", amt: 600.00, dir: "credit", type: "Internal Transfer", status: "Completed", method: "Online transfer" },
  { d: 54, acct: "checking", desc: "GREENLEAF GROCERS PURCHASE", merchant: "GREENLEAF GROCERS", cat: "Food", amt: 68.92, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 52, acct: "checking", desc: "CITY WATER UTILITY PAYMENT", merchant: "CITY WATER", cat: "Utilities", amt: 48.30, dir: "debit", type: "Utility Payment", method: "Online bill pay" },
  { d: 51, acct: "credit", desc: "AMAZON MARKETPLACE PURCHASE", merchant: "AMAZON MARKETPLACE", cat: "Shopping", amt: 104.97, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 50, acct: "checking", desc: "THE COPPER FORK RESTAURANT", merchant: "THE COPPER FORK", cat: "Food", amt: 42.60, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 48, acct: "checking", desc: "LAKEVIEW MALL PURCHASE", merchant: "LAKEVIEW MALL", cat: "Shopping", amt: 89.50, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 47, acct: "credit", desc: "AMAZON MARKETPLACE REFUND", merchant: "AMAZON MARKETPLACE", cat: "Shopping", amt: 104.97, dir: "credit", type: "Refund", method: "Credit card" },
  { d: 46, acct: "checking", desc: "RIDESHARE EXPRESS TRIP", merchant: "RIDESHARE EXPRESS", cat: "Transportation", amt: 26.40, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 45, acct: "credit", desc: "CROSSTOWN FUEL PURCHASE", merchant: "CROSSTOWN FUEL", cat: "Transportation", amt: 55.80, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 44, acct: "checking", desc: "PINNACLE STAFFING DIRECT DEPOSIT", merchant: "PINNACLE STAFFING", cat: "Income", amt: 3820.50, dir: "credit", type: "Direct Deposit", method: "Direct deposit" },
  { d: 44, acct: "checking", desc: "ATM WITHDRAWAL 1247 RIDGEWOOD DR", merchant: "ATM 1247", cat: "Other", amt: 120.00, dir: "debit", type: "ATM Withdrawal", method: "ATM" },
  { d: 42, acct: "checking", desc: "BEATWAVE MUSIC SUBSCRIPTION", merchant: "BEATWAVE MUSIC", cat: "Subscriptions", amt: 11.99, dir: "debit", type: "Recurring Payment", method: "Debit card" },
  { d: 40, acct: "checking", desc: "HARVEST MARKET PURCHASE", merchant: "HARVEST MARKET", cat: "Food", amt: 97.44, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 40, acct: "credit", desc: "PRESTIGE HOME DECOR PURCHASE", merchant: "PRESTIGE HOME DECOR", cat: "Shopping", amt: 349.99, dir: "debit", type: "Purchase", status: "Declined", method: "Credit card" },
  { d: 38, acct: "checking", desc: "LAKEVIEW MALL REFUND", merchant: "LAKEVIEW MALL", cat: "Shopping", amt: 89.50, dir: "credit", type: "Refund", method: "Debit card" },
  { d: 38, acct: "credit", desc: "BEATWAVE MUSIC SUBSCRIPTION", merchant: "BEATWAVE MUSIC", cat: "Subscriptions", amt: 11.99, dir: "debit", type: "Recurring Payment", method: "Credit card" },
  { d: 36, acct: "checking", desc: "CAROLINAS POWER UTILITY PAYMENT", merchant: "CAROLINAS POWER", cat: "Utilities", amt: 116.44, dir: "debit", type: "Utility Payment", method: "Online bill pay" },
  { d: 35, acct: "savings", desc: "MONTHLY INTEREST CREDIT", merchant: "Bank of America", cat: "Interest", amt: 22.86, dir: "credit", type: "Interest", status: "Completed", method: "Automatic" },
  { d: 34, acct: "checking", desc: "SUMMIT COFFEE CO PURCHASE", merchant: "SUMMIT COFFEE CO", cat: "Food", amt: 8.10, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 33, acct: "savings", desc: "MOBILE DEPOSIT CHECK 7721", merchant: "Mobile Deposit", cat: "Other", amt: 350.00, dir: "credit", type: "Deposit", status: "Completed", method: "Mobile deposit" },
  { d: 32, acct: "checking", desc: "CREDIT CARD PAYMENT", merchant: "Bank of America", cat: "Payments", amt: 500.00, dir: "debit", type: "Card Payment", status: "Completed", method: "Online payment" },
  { d: 32, acct: "credit", desc: "PAYMENT RECEIVED EVERYDAY CHECKING", merchant: "Bank of America", cat: "Payments", amt: 500.00, dir: "credit", type: "Card Payment", status: "Completed", method: "Online payment" },
  { d: 30, acct: "checking", desc: "PINNACLE STAFFING DIRECT DEPOSIT", merchant: "PINNACLE STAFFING", cat: "Income", amt: 3820.50, dir: "credit", type: "Direct Deposit", method: "Direct deposit" },
  { d: 29, acct: "checking", desc: "RIDGEWOOD PROPERTY MGMT RENT", merchant: "RIDGEWOOD PROPERTY MGMT", cat: "Housing", amt: 1750.00, dir: "debit", type: "ACH Payment", method: "ACH debit" },
  { d: 28, acct: "checking", desc: "HARVEST MARKET PURCHASE", merchant: "HARVEST MARKET", cat: "Food", amt: 83.72, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 26, acct: "checking", desc: "STREAMLINE SUBSCRIPTION", merchant: "STREAMLINE", cat: "Subscriptions", amt: 17.99, dir: "debit", type: "Recurring Payment", method: "Debit card" },
  { d: 24, acct: "checking", desc: "CROSSTOWN FUEL PURCHASE", merchant: "CROSSTOWN FUEL", cat: "Transportation", amt: 58.60, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 23, acct: "credit", desc: "JETBLUE BAGGAGE FEE", merchant: "JETBLUE AIRWAYS", cat: "Transportation", amt: 35.00, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 22, acct: "checking", desc: "MOBILE PAYMENT SENT", merchant: "Mobile Payment", cat: "Transfers", amt: 75.00, dir: "debit", type: "Mobile Payment", method: "Mobile payment" },
  { d: 20, acct: "checking", desc: "GREENLEAF GROCERS PURCHASE", merchant: "GREENLEAF GROCERS", cat: "Food", amt: 77.36, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 19, acct: "credit", desc: "AMAZON MARKETPLACE PURCHASE", merchant: "AMAZON MARKETPLACE", cat: "Shopping", amt: 79.95, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 18, acct: "checking", desc: "THE COPPER FORK RESTAURANT", merchant: "THE COPPER FORK", cat: "Food", amt: 51.20, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 16, acct: "checking", desc: "PINNACLE STAFFING DIRECT DEPOSIT", merchant: "PINNACLE STAFFING", cat: "Income", amt: 3820.50, dir: "credit", type: "Direct Deposit", method: "Direct deposit" },
  { d: 15, acct: "checking", desc: "CITY WATER UTILITY PAYMENT", merchant: "CITY WATER", cat: "Utilities", amt: 45.22, dir: "debit", type: "Utility Payment", method: "Online bill pay" },
  { d: 14, acct: "checking", desc: "ATM WITHDRAWAL 1247 RIDGEWOOD DR", merchant: "ATM 1247", cat: "Other", amt: 80.00, dir: "debit", type: "ATM Withdrawal", method: "ATM" },
  { d: 14, acct: "credit", desc: "THE COPPER FORK RESTAURANT", merchant: "THE COPPER FORK", cat: "Food", amt: 62.40, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 13, acct: "checking", desc: "LAKEVIEW MALL PURCHASE", merchant: "LAKEVIEW MALL", cat: "Shopping", amt: 145.80, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 12, acct: "checking", desc: "RIDESHARE EXPRESS TRIP", merchant: "RIDESHARE EXPRESS", cat: "Transportation", amt: 22.50, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 11, acct: "checking", desc: "SUMMIT COFFEE CO PURCHASE", merchant: "SUMMIT COFFEE CO", cat: "Food", amt: 6.40, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 10, acct: "checking", desc: "MONTHLY MAINTENANCE FEE WAIVED CREDIT", merchant: "Bank of America", cat: "Fees", amt: 12.00, dir: "credit", type: "Fee Waiver", method: "Automatic" },
  { d: 10, acct: "credit", desc: "SPECTRUM INTERNET BILL", merchant: "SPECTRUM INTERNET", cat: "Utilities", amt: 89.99, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 9, acct: "checking", desc: "HARVEST MARKET PURCHASE", merchant: "HARVEST MARKET", cat: "Food", amt: 94.18, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 8, acct: "checking", desc: "BEATWAVE MUSIC SUBSCRIPTION", merchant: "BEATWAVE MUSIC", cat: "Subscriptions", amt: 11.99, dir: "debit", type: "Recurring Payment", method: "Debit card" },
  { d: 7, acct: "checking", desc: "CAROLINAS POWER UTILITY PAYMENT", merchant: "CAROLINAS POWER", cat: "Utilities", amt: 131.82, dir: "debit", type: "Utility Payment", method: "Online bill pay" },
  { d: 7, acct: "credit", desc: "HARVEST MARKET PURCHASE", merchant: "HARVEST MARKET", cat: "Food", amt: 44.27, dir: "debit", type: "Purchase", status: "Pending", method: "Credit card" },
  { d: 6, acct: "checking", desc: "TRANSFER TO PREMIER SAVINGS", merchant: "Bank of America", cat: "Transfers", amt: 600.00, dir: "debit", type: "Internal Transfer", status: "Completed", method: "Online transfer" },
  { d: 6, acct: "savings", desc: "TRANSFER FROM EVERYDAY CHECKING", merchant: "Bank of America", cat: "Transfers", amt: 600.00, dir: "credit", type: "Internal Transfer", status: "Completed", method: "Online transfer" },
  { d: 5, acct: "checking", desc: "SUMMIT COFFEE CO PURCHASE", merchant: "SUMMIT COFFEE CO", cat: "Food", amt: 7.80, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 5, acct: "savings", desc: "MONTHLY INTEREST CREDIT", merchant: "Bank of America", cat: "Interest", amt: 23.54, dir: "credit", type: "Interest", status: "Completed", method: "Automatic" },
  { d: 4, acct: "checking", desc: "CROSSTOWN FUEL PURCHASE", merchant: "CROSSTOWN FUEL", cat: "Transportation", amt: 50.10, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 3, acct: "checking", desc: "GREENLEAF GROCERS PURCHASE", merchant: "GREENLEAF GROCERS", cat: "Food", amt: 72.64, dir: "debit", type: "Purchase", status: "Pending", method: "Debit card" },
  { d: 2, acct: "credit", desc: "SUMMIT COFFEE CO PURCHASE", merchant: "SUMMIT COFFEE CO", cat: "Food", amt: 8.95, dir: "debit", type: "Purchase", status: "Pending", method: "Credit card" },
  { d: 1, acct: "checking", desc: "HARVEST MARKET PURCHASE", merchant: "HARVEST MARKET", cat: "Food", amt: 71.08, dir: "debit", type: "Purchase", status: "Pending", method: "Debit card" },
  { d: 0, acct: "checking", desc: "SUMMIT COFFEE CO PURCHASE", merchant: "SUMMIT COFFEE CO", cat: "Food", amt: 9.45, dir: "debit", type: "Purchase", status: "Pending", method: "Debit card" },
  { d: -4, acct: "checking", desc: "STREAMLINE SUBSCRIPTION", merchant: "STREAMLINE", cat: "Subscriptions", amt: 17.99, dir: "debit", type: "Recurring Payment", status: "Scheduled", method: "Debit card" },
];

// ---------------------------------------------------------------------------
// Jojo Van Carter (Jojo_01)
// ---------------------------------------------------------------------------
const USER1_RAW: RawTx[] = [
  { d: 70, acct: "checking", desc: "ACME PAYROLL DIRECT DEPOSIT", merchant: "ACME PAYROLL", cat: "Income", amt: 3120.45, dir: "credit", type: "Direct Deposit", method: "Direct deposit" },
  { d: 68, acct: "checking", desc: "MAPLEWOOD PROPERTY MGMT RENT", merchant: "MAPLEWOOD PROPERTY MGMT", cat: "Housing", amt: 1850.0, dir: "debit", type: "ACH Payment", method: "ACH debit" },
  { d: 67, acct: "credit", desc: "METRO MARKET PURCHASE", merchant: "METRO MARKET", cat: "Food", amt: 54.12, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 66, acct: "checking", desc: "METRO MARKET PURCHASE", merchant: "METRO MARKET", cat: "Food", amt: 86.24, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 65, acct: "credit", desc: "SKYWAY AIRLINES TICKET", merchant: "SKYWAY AIRLINES", cat: "Transportation", amt: 286.0, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 64, acct: "checking", desc: "CITY ELECTRIC UTILITY PAYMENT", merchant: "CITY ELECTRIC", cat: "Utilities", amt: 112.8, dir: "debit", type: "Utility Payment", method: "Online bill pay" },
  { d: 63, acct: "savings", desc: "MONTHLY INTEREST CREDIT", merchant: "Bank of America", cat: "Interest", amt: 18.42, dir: "credit", type: "Interest", status: "Completed", method: "Automatic" },
  { d: 62, acct: "checking", desc: "COFFEE HOUSE PURCHASE", merchant: "COFFEE HOUSE", cat: "Food", amt: 6.45, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 61, acct: "credit", desc: "COFFEE HOUSE PURCHASE", merchant: "COFFEE HOUSE", cat: "Food", amt: 4.75, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 60, acct: "checking", desc: "STREAMFLIX SUBSCRIPTION", merchant: "STREAMFLIX", cat: "Subscriptions", amt: 15.99, dir: "debit", type: "Recurring Payment", method: "Debit card" },
  { d: 59, acct: "credit", desc: "STREAMFLIX SUBSCRIPTION", merchant: "STREAMFLIX", cat: "Subscriptions", amt: 15.99, dir: "debit", type: "Recurring Payment", method: "Credit card" },
  { d: 58, acct: "checking", desc: "METRO FUEL PURCHASE", merchant: "METRO FUEL", cat: "Transportation", amt: 48.1, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 57, acct: "credit", desc: "BASIL STREET KITCHEN", merchant: "BASIL STREET KITCHEN", cat: "Food", amt: 62.4, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 56, acct: "checking", desc: "ACME PAYROLL DIRECT DEPOSIT", merchant: "ACME PAYROLL", cat: "Income", amt: 3120.45, dir: "credit", type: "Direct Deposit", method: "Direct deposit" },
  { d: 54, acct: "checking", desc: "TRANSFER TO PREMIER SAVINGS", merchant: "Bank of America", cat: "Transfers", amt: 500.0, dir: "debit", type: "Internal Transfer", status: "Completed", method: "Online transfer" },
  { d: 54, acct: "savings", desc: "TRANSFER FROM EVERYDAY CHECKING", merchant: "Bank of America", cat: "Transfers", amt: 500.0, dir: "credit", type: "Internal Transfer", status: "Completed", method: "Online transfer" },
  { d: 52, acct: "checking", desc: "FRESH FIELD GROCERS PURCHASE", merchant: "FRESH FIELD GROCERS", cat: "Food", amt: 64.37, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 50, acct: "checking", desc: "METRO WATER UTILITY PAYMENT", merchant: "METRO WATER", cat: "Utilities", amt: 42.15, dir: "debit", type: "Utility Payment", method: "Online bill pay" },
  { d: 50, acct: "credit", desc: "ONLINE RETAIL PURCHASE", merchant: "ONLINE RETAIL", cat: "Shopping", amt: 89.99, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 48, acct: "checking", desc: "BASIL STREET KITCHEN", merchant: "BASIL STREET KITCHEN", cat: "Food", amt: 38.9, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 46, acct: "checking", desc: "ONLINE RETAIL PURCHASE", merchant: "ONLINE RETAIL", cat: "Shopping", amt: 74.99, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 45, acct: "credit", desc: "ONLINE RETAIL REFUND", merchant: "ONLINE RETAIL", cat: "Shopping", amt: 89.99, dir: "credit", type: "Refund", method: "Credit card" },
  { d: 44, acct: "checking", desc: "RIDESHARE NOW TRIP", merchant: "RIDESHARE NOW", cat: "Transportation", amt: 22.75, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 43, acct: "credit", desc: "METRO FUEL PURCHASE", merchant: "METRO FUEL", cat: "Transportation", amt: 48.1, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 42, acct: "checking", desc: "ACME PAYROLL DIRECT DEPOSIT", merchant: "ACME PAYROLL", cat: "Income", amt: 3120.45, dir: "credit", type: "Direct Deposit", method: "Direct deposit" },
  { d: 42, acct: "checking", desc: "ATM WITHDRAWAL 4415 ALDER CT", merchant: "ATM 4415", cat: "Other", amt: 100.0, dir: "debit", type: "ATM Withdrawal", method: "ATM" },
  { d: 40, acct: "checking", desc: "TUNESTREAM MUSIC SUBSCRIPTION", merchant: "TUNESTREAM", cat: "Subscriptions", amt: 10.99, dir: "debit", type: "Recurring Payment", method: "Debit card" },
  { d: 38, acct: "checking", desc: "METRO MARKET PURCHASE", merchant: "METRO MARKET", cat: "Food", amt: 92.61, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 38, acct: "credit", desc: "LUXE HOME STORE PURCHASE", merchant: "LUXE HOME STORE", cat: "Shopping", amt: 499.99, dir: "debit", type: "Purchase", status: "Declined", method: "Credit card" },
  { d: 36, acct: "checking", desc: "ONLINE RETAIL REFUND", merchant: "ONLINE RETAIL", cat: "Shopping", amt: 74.99, dir: "credit", type: "Refund", method: "Debit card" },
  { d: 36, acct: "credit", desc: "TUNESTREAM MUSIC SUBSCRIPTION", merchant: "TUNESTREAM", cat: "Subscriptions", amt: 10.99, dir: "debit", type: "Recurring Payment", method: "Credit card" },
  { d: 34, acct: "checking", desc: "CITY ELECTRIC UTILITY PAYMENT", merchant: "CITY ELECTRIC", cat: "Utilities", amt: 108.22, dir: "debit", type: "Utility Payment", method: "Online bill pay" },
  { d: 33, acct: "savings", desc: "MONTHLY INTEREST CREDIT", merchant: "Bank of America", cat: "Interest", amt: 19.1, dir: "credit", type: "Interest", status: "Completed", method: "Automatic" },
  { d: 32, acct: "checking", desc: "COFFEE HOUSE PURCHASE", merchant: "COFFEE HOUSE", cat: "Food", amt: 7.2, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 31, acct: "savings", desc: "MOBILE DEPOSIT CHECK 1042", merchant: "Mobile Deposit", cat: "Other", amt: 250.0, dir: "credit", type: "Deposit", status: "Completed", method: "Mobile deposit" },
  { d: 30, acct: "checking", desc: "CREDIT CARD PAYMENT", merchant: "Bank of America", cat: "Payments", amt: 400.0, dir: "debit", type: "Card Payment", status: "Completed", method: "Online payment" },
  { d: 30, acct: "credit", desc: "PAYMENT RECEIVED EVERYDAY CHECKING", merchant: "Bank of America", cat: "Payments", amt: 400.0, dir: "credit", type: "Card Payment", status: "Completed", method: "Online payment" },
  { d: 28, acct: "checking", desc: "ACME PAYROLL DIRECT DEPOSIT", merchant: "ACME PAYROLL", cat: "Income", amt: 3120.45, dir: "credit", type: "Direct Deposit", method: "Direct deposit" },
  { d: 27, acct: "checking", desc: "MAPLEWOOD PROPERTY MGMT RENT", merchant: "MAPLEWOOD PROPERTY MGMT", cat: "Housing", amt: 1850.0, dir: "debit", type: "ACH Payment", method: "ACH debit" },
  { d: 26, acct: "checking", desc: "METRO MARKET PURCHASE", merchant: "METRO MARKET", cat: "Food", amt: 78.45, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 24, acct: "checking", desc: "STREAMFLIX SUBSCRIPTION", merchant: "STREAMFLIX", cat: "Subscriptions", amt: 15.99, dir: "debit", type: "Recurring Payment", method: "Debit card" },
  { d: 22, acct: "checking", desc: "METRO FUEL PURCHASE", merchant: "METRO FUEL", cat: "Transportation", amt: 51.33, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 21, acct: "credit", desc: "SKYWAY AIRLINES BAGGAGE FEE", merchant: "SKYWAY AIRLINES", cat: "Transportation", amt: 122.5, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 20, acct: "checking", desc: "MOBILE PAYMENT SENT", merchant: "Mobile Payment", cat: "Transfers", amt: 60.0, dir: "debit", type: "Mobile Payment", method: "Mobile payment" },
  { d: 18, acct: "checking", desc: "FRESH FIELD GROCERS PURCHASE", merchant: "FRESH FIELD GROCERS", cat: "Food", amt: 71.08, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 17, acct: "credit", desc: "ONLINE RETAIL PURCHASE", merchant: "ONLINE RETAIL", cat: "Shopping", amt: 64.3, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 16, acct: "checking", desc: "BASIL STREET KITCHEN", merchant: "BASIL STREET KITCHEN", cat: "Food", amt: 44.25, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 14, acct: "checking", desc: "ACME PAYROLL DIRECT DEPOSIT", merchant: "ACME PAYROLL", cat: "Income", amt: 3120.45, dir: "credit", type: "Direct Deposit", method: "Direct deposit" },
  { d: 13, acct: "checking", desc: "METRO WATER UTILITY PAYMENT", merchant: "METRO WATER", cat: "Utilities", amt: 39.88, dir: "debit", type: "Utility Payment", method: "Online bill pay" },
  { d: 12, acct: "checking", desc: "ATM WITHDRAWAL 4415 ALDER CT", merchant: "ATM 4415", cat: "Other", amt: 60.0, dir: "debit", type: "ATM Withdrawal", method: "ATM" },
  { d: 12, acct: "credit", desc: "BASIL STREET KITCHEN", merchant: "BASIL STREET KITCHEN", cat: "Food", amt: 51.75, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 11, acct: "checking", desc: "ONLINE RETAIL PURCHASE", merchant: "ONLINE RETAIL", cat: "Shopping", amt: 129.4, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 10, acct: "checking", desc: "RIDESHARE NOW TRIP", merchant: "RIDESHARE NOW", cat: "Transportation", amt: 19.6, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 9, acct: "checking", desc: "COFFEE HOUSE PURCHASE", merchant: "COFFEE HOUSE", cat: "Food", amt: 5.85, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 8, acct: "checking", desc: "MONTHLY MAINTENANCE FEE", merchant: "Bank of America", cat: "Fees", amt: 12.0, dir: "debit", type: "Fee", method: "Automatic" },
  { d: 8, acct: "credit", desc: "CIVIC INTERNET BILL", merchant: "CIVIC INTERNET", cat: "Utilities", amt: 79.99, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 7, acct: "checking", desc: "METRO MARKET PURCHASE", merchant: "METRO MARKET", cat: "Food", amt: 88.02, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 6, acct: "checking", desc: "TUNESTREAM MUSIC SUBSCRIPTION", merchant: "TUNESTREAM", cat: "Subscriptions", amt: 10.99, dir: "debit", type: "Recurring Payment", method: "Debit card" },
  { d: 5, acct: "checking", desc: "CITY ELECTRIC UTILITY PAYMENT", merchant: "CITY ELECTRIC", cat: "Utilities", amt: 118.64, dir: "debit", type: "Utility Payment", method: "Online bill pay" },
  { d: 5, acct: "credit", desc: "METRO MARKET PURCHASE", merchant: "METRO MARKET", cat: "Food", amt: 39.64, dir: "debit", type: "Purchase", status: "Pending", method: "Credit card" },
  { d: 4, acct: "checking", desc: "TRANSFER TO PREMIER SAVINGS", merchant: "Bank of America", cat: "Transfers", amt: 500.0, dir: "debit", type: "Internal Transfer", status: "Completed", method: "Online transfer" },
  { d: 4, acct: "savings", desc: "TRANSFER FROM EVERYDAY CHECKING", merchant: "Bank of America", cat: "Transfers", amt: 500.0, dir: "credit", type: "Internal Transfer", status: "Completed", method: "Online transfer" },
  { d: 3, acct: "checking", desc: "COFFEE HOUSE PURCHASE", merchant: "COFFEE HOUSE", cat: "Food", amt: 6.1, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 3, acct: "savings", desc: "MONTHLY INTEREST CREDIT", merchant: "Bank of America", cat: "Interest", amt: 19.66, dir: "credit", type: "Interest", status: "Completed", method: "Automatic" },
  { d: 2, acct: "checking", desc: "METRO FUEL PURCHASE", merchant: "METRO FUEL", cat: "Transportation", amt: 46.9, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 1, acct: "checking", desc: "METRO MARKET PURCHASE", merchant: "METRO MARKET", cat: "Food", amt: 67.53, dir: "debit", type: "Purchase", status: "Pending", method: "Debit card" },
  { d: 1, acct: "credit", desc: "COFFEE HOUSE PURCHASE", merchant: "COFFEE HOUSE", cat: "Food", amt: 7.45, dir: "debit", type: "Purchase", status: "Pending", method: "Credit card" },
  { d: 0, acct: "checking", desc: "COFFEE HOUSE PURCHASE", merchant: "COFFEE HOUSE", cat: "Food", amt: 8.35, dir: "debit", type: "Purchase", status: "Pending", method: "Debit card" },
  { d: -2, acct: "checking", desc: "STREAMFLIX SUBSCRIPTION", merchant: "STREAMFLIX", cat: "Subscriptions", amt: 15.99, dir: "debit", type: "Recurring Payment", status: "Scheduled", method: "Debit card" },
];

// ---------------------------------------------------------------------------
// Jojo Alexander (jojo_02)
// ---------------------------------------------------------------------------
const USER2_RAW: RawTx[] = [
  { d: 69, acct: "checking", desc: "NORTHBAY CONSULTING PAYROLL", merchant: "NORTHBAY CONSULTING", cat: "Income", amt: 2640.75, dir: "credit", type: "Direct Deposit", method: "Direct deposit" },
  { d: 67, acct: "checking", desc: "HARBORVIEW RESIDENCES RENT", merchant: "HARBORVIEW RESIDENCES", cat: "Housing", amt: 1420.0, dir: "debit", type: "ACH Payment", method: "ACH debit" },
  { d: 66, acct: "checking", desc: "CORNER GROCERY PURCHASE", merchant: "CORNER GROCERY", cat: "Food", amt: 58.73, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 66, acct: "credit", desc: "CORNER GROCERY PURCHASE", merchant: "CORNER GROCERY", cat: "Food", amt: 42.18, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 63, acct: "checking", desc: "NORTHSTAR ELECTRIC UTILITY PAYMENT", merchant: "NORTHSTAR ELECTRIC", cat: "Utilities", amt: 96.4, dir: "debit", type: "Utility Payment", method: "Online bill pay" },
  { d: 62, acct: "credit", desc: "SKYWAY AIRLINES TICKET", merchant: "SKYWAY AIRLINES", cat: "Transportation", amt: 412.6, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 62, acct: "savings", desc: "MONTHLY INTEREST CREDIT", merchant: "Bank of America", cat: "Interest", amt: 24.18, dir: "credit", type: "Interest", status: "Completed", method: "Automatic" },
  { d: 61, acct: "checking", desc: "BLUEBIRD CAFE PURCHASE", merchant: "BLUEBIRD CAFE", cat: "Food", amt: 8.9, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 59, acct: "checking", desc: "FLIXNEST SUBSCRIPTION", merchant: "FLIXNEST", cat: "Subscriptions", amt: 12.49, dir: "debit", type: "Recurring Payment", method: "Debit card" },
  { d: 58, acct: "credit", desc: "FLIXNEST SUBSCRIPTION", merchant: "FLIXNEST", cat: "Subscriptions", amt: 12.49, dir: "debit", type: "Recurring Payment", method: "Credit card" },
  { d: 57, acct: "checking", desc: "TRANSIT AUTHORITY PASS", merchant: "TRANSIT AUTHORITY", cat: "Transportation", amt: 32.0, dir: "debit", type: "Recurring Payment", method: "Debit card" },
  { d: 55, acct: "checking", desc: "NORTHBAY CONSULTING PAYROLL", merchant: "NORTHBAY CONSULTING", cat: "Income", amt: 2640.75, dir: "credit", type: "Direct Deposit", method: "Direct deposit" },
  { d: 54, acct: "credit", desc: "ONLINE RETAIL PURCHASE", merchant: "ONLINE RETAIL", cat: "Shopping", amt: 67.85, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 53, acct: "checking", desc: "TRANSFER TO HIGH-YIELD SAVINGS", merchant: "Bank of America", cat: "Transfers", amt: 300.0, dir: "debit", type: "Internal Transfer", status: "Completed", method: "Online transfer" },
  { d: 53, acct: "savings", desc: "TRANSFER FROM CORE CHECKING", merchant: "Bank of America", cat: "Transfers", amt: 300.0, dir: "credit", type: "Internal Transfer", status: "Completed", method: "Online transfer" },
  { d: 51, acct: "checking", desc: "CORNER GROCERY PURCHASE", merchant: "CORNER GROCERY", cat: "Food", amt: 74.19, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 49, acct: "checking", desc: "CIVIC INTERNET BILL", merchant: "CIVIC INTERNET", cat: "Utilities", amt: 64.99, dir: "debit", type: "Utility Payment", method: "Online bill pay" },
  { d: 48, acct: "credit", desc: "BLUEBIRD CAFE PURCHASE", merchant: "BLUEBIRD CAFE", cat: "Food", amt: 13.4, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 47, acct: "checking", desc: "CLOUDGYM MEMBERSHIP", merchant: "CLOUDGYM", cat: "Health", amt: 29.0, dir: "debit", type: "Recurring Payment", method: "Debit card" },
  { d: 45, acct: "checking", desc: "VOLTCITY CHARGING SESSION", merchant: "VOLTCITY CHARGING", cat: "Transportation", amt: 18.6, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 44, acct: "checking", desc: "ATM WITHDRAWAL 2210 BAY ST", merchant: "ATM 2210", cat: "Other", amt: 80.0, dir: "debit", type: "ATM Withdrawal", method: "ATM" },
  { d: 42, acct: "credit", desc: "ONLINE RETAIL REFUND", merchant: "ONLINE RETAIL", cat: "Shopping", amt: 67.85, dir: "credit", type: "Refund", method: "Credit card" },
  { d: 41, acct: "checking", desc: "NORTHBAY CONSULTING PAYROLL", merchant: "NORTHBAY CONSULTING", cat: "Income", amt: 2640.75, dir: "credit", type: "Direct Deposit", method: "Direct deposit" },
  { d: 40, acct: "credit", desc: "DEPOT HARDWARE PURCHASE", merchant: "DEPOT HARDWARE", cat: "Shopping", amt: 88.12, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 39, acct: "checking", desc: "BLUEBIRD CAFE PURCHASE", merchant: "BLUEBIRD CAFE", cat: "Food", amt: 11.25, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 37, acct: "checking", desc: "CORNER GROCERY PURCHASE", merchant: "CORNER GROCERY", cat: "Food", amt: 66.08, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 35, acct: "checking", desc: "NORTHSTAR ELECTRIC UTILITY PAYMENT", merchant: "NORTHSTAR ELECTRIC", cat: "Utilities", amt: 88.75, dir: "debit", type: "Utility Payment", method: "Online bill pay" },
  { d: 34, acct: "credit", desc: "CIVIC INTERNET BILL", merchant: "CIVIC INTERNET", cat: "Utilities", amt: 64.99, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 33, acct: "checking", desc: "ONLINE RETAIL PURCHASE", merchant: "ONLINE RETAIL", cat: "Shopping", amt: 54.25, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 32, acct: "savings", desc: "MONTHLY INTEREST CREDIT", merchant: "Bank of America", cat: "Interest", amt: 25.02, dir: "credit", type: "Interest", status: "Completed", method: "Automatic" },
  { d: 31, acct: "checking", desc: "CORNER GROCERY REFUND", merchant: "CORNER GROCERY", cat: "Food", amt: 12.4, dir: "credit", type: "Refund", method: "Debit card" },
  { d: 30, acct: "credit", desc: "GADGET WORLD PURCHASE", merchant: "GADGET WORLD", cat: "Shopping", amt: 899.0, dir: "debit", type: "Purchase", status: "Declined", method: "Credit card" },
  { d: 29, acct: "checking", desc: "TRANSIT AUTHORITY PASS", merchant: "TRANSIT AUTHORITY", cat: "Transportation", amt: 32.0, dir: "debit", type: "Recurring Payment", method: "Debit card" },
  { d: 28, acct: "checking", desc: "CREDIT CARD PAYMENT", merchant: "Bank of America", cat: "Payments", amt: 250.0, dir: "debit", type: "Card Payment", status: "Completed", method: "Online payment" },
  { d: 28, acct: "credit", desc: "PAYMENT RECEIVED CORE CHECKING", merchant: "Bank of America", cat: "Payments", amt: 250.0, dir: "credit", type: "Card Payment", status: "Completed", method: "Online payment" },
  { d: 27, acct: "checking", desc: "NORTHBAY CONSULTING PAYROLL", merchant: "NORTHBAY CONSULTING", cat: "Income", amt: 2640.75, dir: "credit", type: "Direct Deposit", method: "Direct deposit" },
  { d: 26, acct: "checking", desc: "HARBORVIEW RESIDENCES RENT", merchant: "HARBORVIEW RESIDENCES", cat: "Housing", amt: 1420.0, dir: "debit", type: "ACH Payment", method: "ACH debit" },
  { d: 26, acct: "credit", desc: "CORNER GROCERY PURCHASE", merchant: "CORNER GROCERY", cat: "Food", amt: 36.54, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 24, acct: "checking", desc: "FLIXNEST SUBSCRIPTION", merchant: "FLIXNEST", cat: "Subscriptions", amt: 12.49, dir: "debit", type: "Recurring Payment", method: "Debit card" },
  { d: 22, acct: "checking", desc: "CORNER GROCERY PURCHASE", merchant: "CORNER GROCERY", cat: "Food", amt: 81.52, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 21, acct: "savings", desc: "MOBILE DEPOSIT CHECK 2211", merchant: "Mobile Deposit", cat: "Other", amt: 480.0, dir: "credit", type: "Deposit", status: "Completed", method: "Mobile deposit" },
  { d: 20, acct: "checking", desc: "BLUEBIRD CAFE PURCHASE", merchant: "BLUEBIRD CAFE", cat: "Food", amt: 9.6, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 19, acct: "credit", desc: "SKYWAY AIRLINES SEAT UPGRADE", merchant: "SKYWAY AIRLINES", cat: "Transportation", amt: 96.2, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 18, acct: "checking", desc: "VOLTCITY CHARGING SESSION", merchant: "VOLTCITY CHARGING", cat: "Transportation", amt: 21.4, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 16, acct: "checking", desc: "CLOUDGYM MEMBERSHIP", merchant: "CLOUDGYM", cat: "Health", amt: 29.0, dir: "debit", type: "Recurring Payment", method: "Debit card" },
  { d: 15, acct: "checking", desc: "METRO WATER UTILITY PAYMENT", merchant: "METRO WATER", cat: "Utilities", amt: 36.22, dir: "debit", type: "Utility Payment", method: "Online bill pay" },
  { d: 14, acct: "credit", desc: "CLOUDGYM MEMBERSHIP", merchant: "CLOUDGYM", cat: "Health", amt: 29.0, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 13, acct: "checking", desc: "NORTHBAY CONSULTING PAYROLL", merchant: "NORTHBAY CONSULTING", cat: "Income", amt: 2640.75, dir: "credit", type: "Direct Deposit", method: "Direct deposit" },
  { d: 12, acct: "checking", desc: "CORNER GROCERY PURCHASE", merchant: "CORNER GROCERY", cat: "Food", amt: 69.94, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 11, acct: "credit", desc: "ONLINE RETAIL PURCHASE", merchant: "ONLINE RETAIL", cat: "Shopping", amt: 45.6, dir: "debit", type: "Purchase", method: "Credit card" },
  { d: 10, acct: "checking", desc: "ONLINE RETAIL PURCHASE", merchant: "ONLINE RETAIL", cat: "Shopping", amt: 112.75, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 9, acct: "checking", desc: "ATM WITHDRAWAL 2210 BAY ST", merchant: "ATM 2210", cat: "Other", amt: 40.0, dir: "debit", type: "ATM Withdrawal", method: "ATM" },
  { d: 7, acct: "checking", desc: "CIVIC INTERNET BILL", merchant: "CIVIC INTERNET", cat: "Utilities", amt: 64.99, dir: "debit", type: "Utility Payment", method: "Online bill pay" },
  { d: 6, acct: "checking", desc: "TRANSIT AUTHORITY PASS", merchant: "TRANSIT AUTHORITY", cat: "Transportation", amt: 32.0, dir: "debit", type: "Recurring Payment", method: "Debit card" },
  { d: 6, acct: "credit", desc: "BLUEBIRD CAFE PURCHASE", merchant: "BLUEBIRD CAFE", cat: "Food", amt: 10.15, dir: "debit", type: "Purchase", status: "Pending", method: "Credit card" },
  { d: 5, acct: "checking", desc: "TRANSFER TO HIGH-YIELD SAVINGS", merchant: "Bank of America", cat: "Transfers", amt: 300.0, dir: "debit", type: "Internal Transfer", status: "Completed", method: "Online transfer" },
  { d: 5, acct: "savings", desc: "TRANSFER FROM CORE CHECKING", merchant: "Bank of America", cat: "Transfers", amt: 300.0, dir: "credit", type: "Internal Transfer", status: "Completed", method: "Online transfer" },
  { d: 4, acct: "checking", desc: "BLUEBIRD CAFE PURCHASE", merchant: "BLUEBIRD CAFE", cat: "Food", amt: 7.8, dir: "debit", type: "Purchase", method: "Debit card" },
  { d: 2, acct: "checking", desc: "CORNER GROCERY PURCHASE", merchant: "CORNER GROCERY", cat: "Food", amt: 77.31, dir: "debit", type: "Purchase", status: "Pending", method: "Debit card" },
  { d: 2, acct: "savings", desc: "MONTHLY INTEREST CREDIT", merchant: "Bank of America", cat: "Interest", amt: 25.44, dir: "credit", type: "Interest", status: "Completed", method: "Automatic" },
  { d: 1, acct: "credit", desc: "CORNER GROCERY PURCHASE", merchant: "CORNER GROCERY", cat: "Food", amt: 28.77, dir: "debit", type: "Purchase", status: "Pending", method: "Credit card" },
  { d: 0, acct: "checking", desc: "VOLTCITY CHARGING SESSION", merchant: "VOLTCITY CHARGING", cat: "Transportation", amt: 16.9, dir: "debit", type: "Purchase", status: "Pending", method: "Debit card" },
  { d: -3, acct: "checking", desc: "FLIXNEST SUBSCRIPTION", merchant: "FLIXNEST", cat: "Subscriptions", amt: 12.49, dir: "debit", type: "Recurring Payment", status: "Scheduled", method: "Debit card" },
];

const RAW_BY_USER: Record<string, RawTx[]> = {
  olson2428: OLSON_RAW,
  Jojo_01: USER1_RAW,
  jojo_02: USER2_RAW,
};

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

export function buildTransactions(userId: string): {
  transactions: Transaction[];
  closing: Record<AccountKey, number>;
} {
  const raw = RAW_BY_USER[userId] ?? [];
  const opening = OPENING_BALANCES[userId] ?? { checking: 0, savings: 0, credit: 0 };
  const indexed = raw.map((r, i) => ({ r, i, date: isoDaysFromToday(r.d) }));
  indexed.sort((a, b) => (a.date === b.date ? a.i - b.i : a.date < b.date ? -1 : 1));

  const running: Record<AccountKey, number> = { ...opening };
  const transactions: Transaction[] = indexed.map(({ r, i, date }) => {
    const posted =
      r.status === undefined || r.status === "Posted" || r.status === "Completed";
    let balanceAfter = round2(running[r.acct]);
    if (posted) {
      const delta =
        r.acct === "credit"
          ? r.dir === "debit"
            ? r.amt
            : -r.amt
          : r.dir === "credit"
            ? r.amt
            : -r.amt;
      running[r.acct] = round2(running[r.acct] + delta);
      balanceAfter = running[r.acct];
    }
    return {
      id: `${userId}-tx-${String(i + 1).padStart(3, "0")}`,
      userId,
      accountId: `${userId}-${r.acct}`,
      date,
      description: r.desc,
      merchant: r.merchant,
      category: r.cat,
      amount: r.amt,
      direction: r.dir,
      type: r.type,
      status: r.status ?? "Posted",
      balanceAfter,
      reference: `REF-${userId.slice(0, 3).toUpperCase()}${String(482130 + i * 7)}`,
      method: r.method ?? "Debit card",
    };
  });

  transactions.sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1));
  return { transactions, closing: running };
}
