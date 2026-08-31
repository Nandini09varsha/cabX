import {
  UserRound,
  Mail,
  Phone,
  Star,
  Car,
  MapPin,
  CalendarDays,
  ShieldCheck,
  Pencil,
  CreditCard,
} from "lucide-react";

import DriverLayout from "../../components/driver/DriverLayout";
import { useAuth } from "../../context/AuthContext";

function DriverProfile() {
  const { user } = useAuth();

  // Temporary driver data.
  // Later this will come from the backend.
  const driver = {
    name: user?.name || "CabX Driver",
    email: user?.email || "driver@cabx.com",
    phone: user?.phone || "+91 98765 43210",
    rating: 4.8,
    totalRides: 128,
    memberSince: "August 2026",

    vehicle: {
      type: "Sedan",
      model: "Maruti Suzuki Dzire",
      number: "UP 14 AB 1234",
      color: "White",
    },
  };

  return (
    <DriverLayout activePage="Profile">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5C518]">
              <UserRound size={17} className="text-black" />
            </div>

            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Driver Account
            </span>
          </div>

          <h1 className="text-2xl font-black sm:text-3xl">Profile</h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your driver information and vehicle details.
          </p>
        </div>

        {/* Profile Overview */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-[#2A2A2A] dark:bg-[#171717]">
          {/* Yellow Header */}
          <div className="h-28 bg-[#F5C518]" />

          {/* Profile Content */}
          <div className="px-5 pb-6 sm:px-7">
            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              {/* Avatar + Name */}
              <div className="flex items-end gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-[#111111] text-3xl font-black text-[#F5C518] dark:border-[#171717]">
                  {driver.name.charAt(0).toUpperCase()}
                </div>

                <div className="pb-1">
                  <h2 className="text-xl font-black">{driver.name}</h2>

                  <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                    <Star size={14} className="fill-current text-[#F5C518]" />

                    <span className="font-semibold">{driver.rating}</span>

                    <span>Driver Rating</span>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <button className="flex w-fit items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold transition hover:bg-gray-100 dark:border-[#3A3A3A] dark:hover:bg-[#222]">
                <Pencil size={16} />
                Edit Profile
              </button>
            </div>

            {/* Stats */}
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-[#1E1E1E]">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total Rides
                </p>

                <p className="mt-1 text-xl font-black">{driver.totalRides}</p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4 dark:bg-[#1E1E1E]">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Rating
                </p>

                <p className="mt-1 flex items-center gap-1 text-xl font-black">
                  {driver.rating}
                  <Star size={17} className="fill-current text-[#F5C518]" />
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4 dark:bg-[#1E1E1E]">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Member Since
                </p>

                <p className="mt-1 text-xl font-black">{driver.memberSince}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-[#2A2A2A] dark:bg-[#171717]">
          <div className="mb-5">
            <h2 className="text-lg font-bold">Personal Information</h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your registered account details.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Name */}
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-[#1E1E1E]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F5C518]/20">
                <UserRound size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Full Name
                </p>

                <p className="mt-1 truncate text-sm font-bold">{driver.name}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-[#1E1E1E]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F5C518]/20">
                <Mail size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Email Address
                </p>

                <p className="mt-1 truncate text-sm font-bold">
                  {driver.email}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-[#1E1E1E]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F5C518]/20">
                <Phone size={18} />
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Phone Number
                </p>

                <p className="mt-1 text-sm font-bold">{driver.phone}</p>
              </div>
            </div>

            {/* Driver Status */}
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-[#1E1E1E]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950/30">
                <ShieldCheck
                  size={18}
                  className="text-green-600 dark:text-green-400"
                />
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Account Status
                </p>

                <p className="mt-1 text-sm font-bold text-green-600 dark:text-green-400">
                  Verified Driver
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-[#2A2A2A] dark:bg-[#171717]">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">Vehicle Information</h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Vehicle registered with your CabX driver account.
              </p>
            </div>

            <button className="flex w-fit items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold transition hover:bg-gray-100 dark:border-[#3A3A3A] dark:hover:bg-[#222]">
              <Pencil size={15} />
              Edit Vehicle
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Vehicle Type */}
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-[#1E1E1E]">
              <Car size={18} className="mb-3 text-gray-500" />

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Vehicle Type
              </p>

              <p className="mt-1 font-bold">{driver.vehicle.type}</p>
            </div>

            {/* Model */}
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-[#1E1E1E]">
              <Car size={18} className="mb-3 text-gray-500" />

              <p className="text-xs text-gray-500 dark:text-gray-400">Model</p>

              <p className="mt-1 font-bold">{driver.vehicle.model}</p>
            </div>

            {/* Number */}
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-[#1E1E1E]">
              <CreditCard size={18} className="mb-3 text-gray-500" />

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Registration Number
              </p>

              <p className="mt-1 font-bold">{driver.vehicle.number}</p>
            </div>

            {/* Color */}
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-[#1E1E1E]">
              <div className="mb-3 h-[18px] w-[18px] rounded-full border border-gray-300 bg-white" />

              <p className="text-xs text-gray-500 dark:text-gray-400">Color</p>

              <p className="mt-1 font-bold">{driver.vehicle.color}</p>
            </div>
          </div>
        </div>

        {/* Driver Documents */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-[#2A2A2A] dark:bg-[#171717]">
          <div className="mb-5">
            <h2 className="text-lg font-bold">Driver Verification</h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your CabX driver verification status.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-[#1E1E1E]">
              <div className="flex items-center gap-3">
                <ShieldCheck
                  size={20}
                  className="text-green-600 dark:text-green-400"
                />

                <div>
                  <p className="text-sm font-bold">Driving License</p>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Verified
                  </p>
                </div>
              </div>

              <CheckBadge />
            </div>

            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-[#1E1E1E]">
              <div className="flex items-center gap-3">
                <Car size={20} className="text-green-600 dark:text-green-400" />

                <div>
                  <p className="text-sm font-bold">Vehicle Documents</p>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Verified
                  </p>
                </div>
              </div>

              <CheckBadge />
            </div>
          </div>
        </div>
      </div>
    </DriverLayout>
  );
}

function CheckBadge() {
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/30">
      <ShieldCheck size={15} className="text-green-600 dark:text-green-400" />
    </div>
  );
}

export default DriverProfile;
