import { CreditCard, ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function PaymentsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Fetch transactions
  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  });

  // For demo purposes, assume starting balance of 500 if no ADD_FUNDS transactions exist.
  // We'll simulate a base balance.
  let balance = 500; 
  let hasAddFunds = false;

  transactions.forEach(t => {
    if (t.type === "CONTACT_UNLOCK") {
      balance -= t.amount;
    } else if (t.type === "ADD_FUNDS") {
      balance += t.amount;
      hasAddFunds = true;
    }
  });

  // If no add funds transaction exists, we'll pretend there was one initially for the demo
  const displayTransactions = [...transactions];
  if (!hasAddFunds) {
    displayTransactions.push({
      id: "demo-base-funds",
      userId: session.user.id,
      amount: 500,
      currency: "INR",
      status: "COMPLETED",
      providerOrderId: null,
      type: "ADD_FUNDS",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
    });
  }

  // Sort them so the mock one goes to the bottom
  displayTransactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments & Wallet</h1>
        <p className="text-gray-500 mt-1">Manage your transactions and contact unlock fees</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start mb-8">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">Current Balance</span>
          </div>
          <h2 className="text-4xl font-bold mb-2">₹{balance.toFixed(2)}</h2>
          <p className="text-gray-400 text-sm">Available for unlocking contacts</p>
          <button className="w-full mt-6 bg-white text-black font-bold py-2.5 rounded-xl hover:bg-gray-100 transition-colors">Add Funds</button>
        </div>

        <div className="md:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 text-lg mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {displayTransactions.length > 0 ? displayTransactions.map((txn) => {
              const isDebit = txn.type === 'CONTACT_UNLOCK';
              return (
                <div key={txn.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:bg-gray-50/50 transition-colors cursor-default">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!isDebit ? 'bg-green-50 text-green-600' : 'bg-red-50 text-primary-red'}`}>
                      {!isDebit ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {txn.type === 'CONTACT_UNLOCK' ? 'Contact Unlock' : txn.type === 'ADD_FUNDS' ? 'Added to Wallet' : txn.type}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">{formatDate(txn.createdAt)}</p>
                    </div>
                  </div>
                  <div className={`font-bold ${!isDebit ? 'text-green-600' : 'text-gray-900'}`}>
                    {!isDebit ? '+' : '-'}₹{txn.amount.toFixed(2)}
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-8 text-gray-500 text-sm">No recent transactions.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
