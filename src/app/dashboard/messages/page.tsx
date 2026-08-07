import ChatInterface from "@/components/ChatInterface";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function MessagesPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Coordinate blood donations and chat with your matches.</p>
      </div>

      <ChatInterface />
    </div>
  );
}
