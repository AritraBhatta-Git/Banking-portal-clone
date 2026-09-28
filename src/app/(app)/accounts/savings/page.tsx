import { AccountDetail } from "@/components/accounts/account-detail";

export const metadata = { title: "Savings Account — Bank of America" };

export default function SavingsPage() {
  return <AccountDetail type="savings" />;
}
