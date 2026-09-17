import { useEffect, useState } from "react";
import { Mail, Phone, Star, Wallet } from "lucide-react";
import RiderLayout from "../../layouts/RiderLayout";
import WalletBar from "../../components/WalletBar";
import { useAuth } from "../../context/AuthContext";
import { riderApi } from "../../api/cabx";
import { apiError, formatDate, shortAddress } from "../../lib/format";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [stats, setStats] = useState({ completedRides: 0, rating: 0 });
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    riderApi
      .profile()
      .then((res) => {
        setStats(res.data.stats);
        setUser(res.data.user);
        setForm({ name: res.data.user.name, phone: res.data.user.phone });
      })
      .catch((err) => setError(apiError(err)));
  }, [setUser]);

  const save = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const { data } = await riderApi.updateProfile(form);
      setUser(data.user);
      setMessage("Profile updated");
    } catch (err) {
      setError(apiError(err));
    }
  };

  return (
    <RiderLayout activePage="Profile">
      <div className="mb-7">
        <h1 className="text-3xl font-black">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your rider account and linked wallet.</p>
      </div>
      <WalletBar />
      <div className="max-w-4xl space-y-6">
        <section className="rounded-3xl border border-gray-200 bg-white p-7 dark:border-[#2A2A2A] dark:bg-[#171717]">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F5C518] text-2xl font-black text-black">
              {user?.name?.[0]?.toUpperCase() || "R"}
            </div>
            <div>
              <h2 className="text-2xl font-black">{user?.name}</h2>
              <p className="text-sm text-gray-500">
                Rider · Member since {formatDate(user?.createdAt)}
              </p>
              <p className="mt-2 flex items-center gap-1 text-sm">
                <Star size={14} className="fill-current" />{" "}
                {Number(stats.rating || user?.rating || 0).toFixed(1)} · {stats.completedRides} completed rides
              </p>
            </div>
          </div>
        </section>
        <section className="rounded-3xl border border-gray-200 bg-white p-7 dark:border-[#2A2A2A] dark:bg-[#171717]">
          <h2 className="font-bold">Personal information</h2>
          <form onSubmit={save} className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">
              Name
              <input
                className="mt-2 w-full rounded-xl border border-gray-200 bg-transparent p-3 dark:border-[#333]"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label className="text-sm font-medium">
              Phone
              <input
                className="mt-2 w-full rounded-xl border border-gray-200 bg-transparent p-3 dark:border-[#333]"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </label>
            <div className="rounded-2xl bg-gray-50 p-4 dark:bg-[#1e1e1e]">
              <Mail size={17} />
              <p className="mt-3 text-xs text-gray-500">Email</p>
              <b className="text-sm">{user?.email}</b>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4 dark:bg-[#1e1e1e]">
              <Wallet size={17} />
              <p className="mt-3 text-xs text-gray-500">Wallet</p>
              <b className="text-sm">{shortAddress(user?.walletAddress)}</b>
            </div>
            <button className="rounded-xl bg-[#F5C518] px-4 py-3 text-sm font-bold text-black sm:col-span-2">
              Save changes
            </button>
          </form>
          {message && <p className="mt-3 text-sm text-green-600">{message}</p>}
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        </section>
      </div>
    </RiderLayout>
  );
}
