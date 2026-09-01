export const rideTypes = [
  { id: "auto", label: "Auto", eta: "3 min", fare: 85, seats: 3 },
  { id: "mini", label: "Mini", eta: "5 min", fare: 142, seats: 4 },
  { id: "sedan", label: "Sedan", eta: "6 min", fare: 198, seats: 4 },
];

export const recentRides = [
  { id: "RX1024", date: "Aug 27, 2026", route: "Hazratganj → Gomti Nagar", fare: 156, status: "Completed", distance: "6.8 km", duration: "22 min", driver: "Rahul Sharma", vehicle: "Swift Dzire", vehicleNumber: "UP 32 AB 4821", payment: "UPI" },
  { id: "RX1019", date: "Aug 24, 2026", route: "Alambagh → Charbagh", fare: 98, status: "Completed", distance: "4.1 km", duration: "15 min", driver: "Priya Singh", vehicle: "Maruti WagonR", vehicleNumber: "UP 32 CD 7182", payment: "Cash" },
  { id: "RX1008", date: "Aug 21, 2026", route: "Gomti Nagar → Phoenix Palassio", fare: 214, status: "Completed", distance: "8.2 km", duration: "26 min", driver: "Amit Verma", vehicle: "Hyundai Aura", vehicleNumber: "UP 32 EF 9201", payment: "Card" },
  { id: "RX0997", date: "Aug 18, 2026", route: "Hazratganj → Charbagh", fare: 120, status: "Cancelled", distance: "5.0 km", duration: "—", driver: "—", vehicle: "—", vehicleNumber: "—", payment: "UPI" },
];

export const notifications = [
  { id: 1, title: "Ride completed", text: "Your ride to Gomti Nagar has been completed.", time: "12 min ago", unread: true },
  { id: 2, title: "Driver assigned", text: "Rahul is on the way to your pickup point.", time: "1 hour ago", unread: true },
  { id: 3, title: "New offer", text: "Get 20% off your next CabX ride.", time: "Yesterday", unread: false },
];

export const payments = [
  { id: 1, ride: "Hazratganj → Gomti Nagar", date: "Aug 27, 2026", amount: 156, method: "UPI", status: "Paid" },
  { id: 2, ride: "Alambagh → Charbagh", date: "Aug 24, 2026", amount: 98, method: "Cash", status: "Paid" },
  { id: 3, ride: "Gomti Nagar → Phoenix Palassio", date: "Aug 21, 2026", amount: 214, method: "Card", status: "Paid" },
];

export const savedPlaces = [
  { label: "Home", address: "Indirapuram, Ghaziabad" },
  { label: "Work", address: "KIET Group of Institutions" },
];
