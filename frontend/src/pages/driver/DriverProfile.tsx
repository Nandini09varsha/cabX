import { useEffect, useState } from "react";
import { Mail, Phone, ShieldCheck, Star, UserRound } from "lucide-react";
import DriverLayout from "../../components/driver/DriverLayout";
import WalletBar from "../../components/WalletBar";
import { useAuth } from "../../context/AuthContext";
import { driverApi } from "../../api/cabx";
import { formatDate, shortAddress, apiError } from "../../lib/format";

function DriverProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    driverApi
      .me()
      .then((res) => setProfile(res.data.driver))
      .catch((err) => setError(apiError(err)));
  }, []);

  const vehicle = profile?.vehicle || {};

  return (
    <DriverLayout activePage="Profile">
      <h1 className="text-2xl font-black sm:text-3xl">Profile</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">Your driver account, stake, and vehicle hash.</p>
      <WalletBar />
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      <div className="overflow-hidden rounded-2xl border border-border bg-card ">
        <div className="h-28 bg-primary" />
        <div className="px-5 pb-6 sm:px-7">
          <div className="-mt-12 flex items-end gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-card bg-ink text-3xl font-black text-primary">
              {user?.name?.[0]?.toUpperCase() || "D"}
            </div>
            <div className="pb-1">
              <h2 className="text-xl font-black">{user?.name}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Star size={14} className="fill-current text-primary" />
                {Number(user?.rating || 0).toFixed(1)}
              </p>
            </div>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Total rides</p>
              <p className="mt-1 text-xl font-black">{profile?.totalRides || 0}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Verified</p>
              <p className="mt-1 text-xl font-black">{profile?.isVerified ? "Yes" : "No"}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Member since</p>
              <p className="mt-1 text-sm font-black">{formatDate(user?.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Info icon={UserRound} label="Name" value={user?.name} />
        <Info icon={Mail} label="Email" value={user?.email} />
        <Info icon={Phone} label="Phone" value={user?.phone} />
        <Info icon={ShieldCheck} label="Wallet" value={shortAddress(user?.walletAddress)} />
      </div>
      <div className="mt-6 rounded-2xl border border-border bg-card p-6 ">
        <h2 className="text-lg font-bold">Vehicle</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Mini label="Type" value={vehicle.type || "—"} />
          <Mini label="Model" value={vehicle.model || "—"} />
          <Mini label="Number" value={vehicle.number || "—"} />
          <Mini label="Color" value={vehicle.color || "—"} />
        </div>
      </div>
    </DriverLayout>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 ">
      <Icon size={18} />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm font-bold">{value}</p>
      </div>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div className="rounded-xl bg-muted/50 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}

export default DriverProfile;
