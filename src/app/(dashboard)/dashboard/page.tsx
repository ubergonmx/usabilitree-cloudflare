import { SignOutButton } from "../_header/signout";

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <SignOutButton />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-lg font-semibold">Welcome back!</h2>
        <p className="text-sm text-gray-500">You are now logged in.</p>
      </div>
    </div>
  );
}
