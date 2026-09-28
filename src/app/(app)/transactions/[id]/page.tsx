import { TransactionDetailView } from "@/components/transactions/detail";

export const metadata = { title: "Transaction Details — Bank of America" };

export default async function TransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TransactionDetailView transactionId={id} />;
}
