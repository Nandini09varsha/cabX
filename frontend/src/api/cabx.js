import api from "./axios";

export const authApi = {
  me: () => api.get("/auth/me"),
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
  linkWallet: (payload) => api.put("/auth/wallet", payload),
};

export const riderApi = {
  profile: () => api.get("/rider/profile"),
  updateProfile: (payload) => api.put("/rider/profile", payload),
};

export const driverApi = {
  me: () => api.get("/drivers/me"),
  list: (params) => api.get("/drivers", { params }),
  availability: (online) => api.put("/drivers/availability", { online }),
  register: (payload) => api.post("/drivers/register", payload),
  confirmRegister: (signature) =>
    api.post("/drivers/register/confirm", { signature }),
  vote: (driverId) => api.post(`/drivers/${driverId}/votes`),
  earnings: () => api.get("/drivers/earnings"),
};

export const rideApi = {
  request: (payload) => api.post("/rides", payload),
  confirmRequest: (id, signature) =>
    api.post(`/rides/${id}/confirm`, { signature }),
  open: () => api.get("/rides/open"),
  mine: () => api.get("/rides/mine"),
  active: () => api.get("/rides/active"),
  get: (id) => api.get(`/rides/${id}`),
  accept: (id) => api.post(`/rides/${id}/accept`),
  confirmAccept: (id, signature) =>
    api.post(`/rides/${id}/accept/confirm`, { signature }),
  start: (id) => api.post(`/rides/${id}/start`),
  confirmStart: (id, signature) =>
    api.post(`/rides/${id}/start/confirm`, { signature }),
  cancel: (id) => api.post(`/rides/${id}/cancel`),
  confirmCancel: (id, signature) =>
    api.post(`/rides/${id}/cancel/confirm`, { signature }),
  complete: (id, payload = {}) => api.post(`/rides/${id}/complete`, payload),
  confirmComplete: (id, signature) =>
    api.post(`/rides/${id}/complete/confirm`, { signature }),
  rate: (id, score) => api.post(`/rides/${id}/rate`, { score }),
};

export const adminApi = {
  initialize: () => api.post("/admin/initialize"),
  verify: (driverId) => api.post(`/admin/drivers/${driverId}/verify`),
  confirmVerify: (driverId, signature) =>
    api.post(`/admin/drivers/${driverId}/verify/confirm`, { signature }),
  slash: (driverId, payload) =>
    api.post(`/admin/drivers/${driverId}/slash`, payload),
  confirmSlash: (driverId, payload) =>
    api.post(`/admin/drivers/${driverId}/slash/confirm`, payload),
};

export const miscApi = {
  config: () => api.get("/config"),
  payments: () => api.get("/payments"),
  ratings: (userId) => api.get(`/ratings/${userId}`),
};
