import { AccountDetail } from "@/components/accounts/account-detail";

export const metadata = { title: "Checking Account — Bank of America" };

export default function CheckingPage() {
  return <AccountDetail type="checking" />;
}
