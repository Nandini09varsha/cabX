import { useState } from "react";
import {
  Bell,
  ShieldCheck,
  Lock,
  UserRound,
  LogOut,
  ChevronRight,
  Smartphone,
  Car,
  Volume2,
} from "lucide-react";

import DriverLayout from "../../components/driver/DriverLayout";
import ThemeToggle from "../../components/ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function DriverSettings() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState({
    rideRequests: true,
    rideUpdates: true,
    earnings: false,
  });

  const [ridePreferences, setRidePreferences] = useState({
    requestAlerts: true,
    soundAlerts: true,
  });

  const toggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleRidePreference = (key) => {
    setRidePreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <DriverLayout activePage="Settings">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-black sm:text-3xl">Settings</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your CabX driver preferences and account settings.
          </p>
        </div>

        {/* Appearance */}
        <section className="rounded-2xl border border-border bg-card ">
          <div className="border-b border-border p-6 ">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft">
                <Smartphone size={19} />
              </div>

              <div>
                <h2 className="font-bold">Appearance</h2>

                <p className="text-sm text-muted-foreground">
                  Customize how CabX looks on your device.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 p-6">
            <div>
              <p className="font-semibold">Theme</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Switch between light and dark mode.
              </p>
            </div>

            <ThemeToggle />
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-2xl border border-border bg-card ">
          <div className="border-b border-border p-6 ">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft">
                <Bell size={19} />
              </div>

              <div>
                <h2 className="font-bold">Notifications</h2>

                <p className="text-sm text-muted-foreground">
                  Choose which notifications you want to receive.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-border">
            <SettingToggle
              title="Ride Requests"
              description="Get notified when a nearby rider requests a ride."
              enabled={notifications.rideRequests}
              onClick={() => toggleNotification("rideRequests")}
            />

            <SettingToggle
              title="Ride Updates"
              description="Receive updates about your current rides."
              enabled={notifications.rideUpdates}
              onClick={() => toggleNotification("rideUpdates")}
            />

            <SettingToggle
              title="Earnings Updates"
              description="Receive notifications about completed ride earnings."
              enabled={notifications.earnings}
              onClick={() => toggleNotification("earnings")}
            />
          </div>
        </section>

        {/* Ride Preferences */}
        <section className="rounded-2xl border border-border bg-card ">
          <div className="border-b border-border p-6 ">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft">
                <Car size={19} />
              </div>

              <div>
                <h2 className="font-bold">Ride Preferences</h2>

                <p className="text-sm text-muted-foreground">
                  Configure how you receive ride requests.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-border">
            <SettingToggle
              title="Ride Request Alerts"
              description="Show alerts when new ride requests become available."
              enabled={ridePreferences.requestAlerts}
              onClick={() => toggleRidePreference("requestAlerts")}
            />

            <SettingToggle
              title="Sound Alerts"
              description="Play a sound when a new ride request arrives."
              enabled={ridePreferences.soundAlerts}
              onClick={() => toggleRidePreference("soundAlerts")}
              icon={<Volume2 size={18} />}
            />
          </div>
        </section>

        {/* Privacy & Security */}
        <section className="rounded-2xl border border-border bg-card ">
          <div className="border-b border-border p-6 ">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft">
                <ShieldCheck size={19} />
              </div>

              <div>
                <h2 className="font-bold">Privacy & Security</h2>

                <p className="text-sm text-muted-foreground">
                  Manage your account security.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-border">
            <SettingsLink
              icon={<Lock size={18} />}
              title="Change Password"
              description="Update your account password."
            />

            <SettingsLink
              icon={<ShieldCheck size={18} />}
              title="Login & Security"
              description="Review your account security settings."
            />
          </div>
        </section>

        {/* Account */}
        <section className="rounded-2xl border border-border bg-card ">
          <div className="border-b border-border p-6 ">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft">
                <UserRound size={19} />
              </div>

              <div>
                <h2 className="font-bold">Account</h2>

                <p className="text-sm text-muted-foreground">
                  Manage your CabX driver account.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-border">
            <SettingsLink
              icon={<UserRound size={18} />}
              title="Profile"
              description="View and update your driver profile."
              onClick={() => navigate("/driver/profile")}
            />

            <SettingsLink
              icon={<LogOut size={18} />}
              title="Logout"
              description="Sign out from your CabX driver account."
              danger
              onClick={() => {
                logout();
                navigate("/");
              }}
            />
          </div>
        </section>

        {/* Footer */}
        <div className="pb-4 text-center">
          <p className="text-xs text-muted-foreground">CabX Driver Portal</p>

          <p className="mt-1 text-xs text-muted-foreground dark:text-muted-foreground">
            Settings are saved locally for now.
          </p>
        </div>
      </div>
    </DriverLayout>
  );
}

/* Reusable Toggle */

function SettingToggle({ title, description, enabled, onClick, icon }) {
  return (
    <div className="flex items-center justify-between gap-5 p-5 sm:p-6">
      <div className="flex min-w-0 items-center gap-3">
        {icon && <div className="hidden text-muted-foreground sm:block">{icon}</div>}

        <div>
          <p className="text-sm font-semibold">{title}</p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <button
        onClick={onClick}
        aria-label={`Toggle ${title}`}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-card shadow transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

/* Reusable Settings Link */

function SettingsLink({ icon, title, description, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-4 p-5 text-left transition sm:p-6 ${
        danger
          ? "hover:bg-red-50 dark:hover:bg-red-950/20"
          : "hover:bg-muted/50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`${
            danger ? "text-red-500" : "text-muted-foreground"
          }`}
        >
          {icon}
        </div>

        <div>
          <p
            className={`text-sm font-semibold ${danger ? "text-red-500" : ""}`}
          >
            {title}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      {!danger && <ChevronRight size={18} className="shrink-0 text-muted-foreground" />}
    </button>
  );
}

export default DriverSettings;
