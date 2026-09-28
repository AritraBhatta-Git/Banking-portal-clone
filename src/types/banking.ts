export type AccountType = "checking" | "savings" | "credit";

export type TransactionStatus =
  | "Posted"
  | "Pending"
  | "Completed"
  | "Scheduled"
  | "Declined";

export type TransactionDirection = "debit" | "credit";

export type SpendingCategory =
  | "Housing"
  | "Food"
  | "Shopping"
  | "Transportation"
  | "Utilities"
  | "Entertainment"
  | "Subscriptions"
  | "Income"
  | "Transfers"
  | "Fees"
  | "Interest"
  | "Payments"
  | "Health"
  | "Other";

export const SPEND_CATEGORIES: SpendingCategory[] = [
  "Housing",
  "Food",
  "Shopping",
  "Transportation",
  "Utilities",
  "Entertainment",
  "Subscriptions",
  "Health",
  "Other",
];

export interface UserProfile {
  userId: string;
  displayName: string;
  firstName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  preferredContact: "Email" | "Phone" | "Mail";
  memberSince: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  maskedNumber: string;
  /** Full account number — present in demo data but must never be displayed in normal UI */
  fullAccountNumber?: string;
  currentBalance: number;
  availableBalance: number;
  openedDate: string;
  status: "Open" | "Closed";
  routingNumber?: string;
  apy?: number;
  interestEarnedYtd?: number;
  creditLimit?: number;
  minimumPayment?: number;
  paymentDueDate?: string;
  apr?: number;
  rewardsPoints?: number;
  lastActivityDate: string;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  date: string;
  description: string;
  merchant: string;
  category: SpendingCategory;
  amount: number;
  direction: TransactionDirection;
  type: string;
  status: TransactionStatus;
  balanceAfter: number;
  reference: string;
  method: string;
}

export interface Payee {
  id: string;
  userId: string;
  name: string;
  maskedAccount: string;
  address: string;
  category: string;
  email: string;
}

export type PaymentStatus = "Scheduled" | "Completed" | "Canceled";

export interface Payment {
  id: string;
  userId: string;
  kind: "Transfer" | "Bill Pay";
  payeeName: string;
  fromAccountId: string;
  toAccountId?: string;
  amount: number;
  date: string;
  frequency: "One time" | "Weekly" | "Monthly";
  memo: string;
  status: PaymentStatus;
  confirmationNumber: string;
}

export type AlertCategory =
  | "Security"
  | "Transaction"
  | "Payment"
  | "Account"
  | "General";

export interface AlertItem {
  id: string;
  userId: string;
  category: AlertCategory;
  title: string;
  message: string;
  date: string;
  read: boolean;
  severity: "info" | "warning" | "critical";
}

export interface StatementDoc {
  id: string;
  userId: string;
  accountId: string;
  periodStart: string;
  periodEnd: string;
  openingBalance: number;
  closingBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  statementDate: string;
  pages: number;
}

export interface CardItem {
  id: string;
  userId: string;
  accountId: string;
  accountName: string;
  holderName: string;
  network: string;
  maskedNumber: string;
  expiry: string;
  cvv: string;
  status: "Active" | "Locked" | "Replacement requested";
  locked: boolean;
  digitalWallet: boolean;
  contactless: boolean;
  spendingLimitMonthly: number;
  alertsEnabled: boolean;
}

export interface TrustedDevice {
  id: string;
  name: string;
  lastUsed: string;
  current: boolean;
}

export interface LoginEvent {
  id: string;
  date: string;
  device: string;
  location: string;
  status: "Success" | "Failed";
}

export interface SecuritySettings {
  twoStepEnabled: boolean;
  passwordLastChanged: string;
  trustedDevices: TrustedDevice[];
  recentLogins: LoginEvent[];
}

export interface Budget {
  category: SpendingCategory;
  limit: number;
}

export interface UserDataset {
  profile: UserProfile;
  accounts: Account[];
  transactions: Transaction[];
  payees: Payee[];
  payments: Payment[];
  alerts: AlertItem[];
  statements: StatementDoc[];
  cards: CardItem[];
  security: SecuritySettings;
  budgets: Budget[];
}

export interface Confirmation {
  confirmationNumber: string;
  kind: "Transfer" | "Bill Pay";
  amount: number;
  fromLabel: string;
  toLabel: string;
  date: string;
  frequency: string;
  memo: string;
  status: PaymentStatus;
}
