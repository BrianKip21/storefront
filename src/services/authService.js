import axios from "../lib/axios";

export const signup = (payload) => axios.post("/auth/signup", payload).then((r) => r.data);
export const login = (payload) => axios.post("/auth/login", payload).then((r) => r.data);
export const googleAuth = (credential) => axios.post("/auth/google", { credential }).then((r) => r.data);
export const logout = () => axios.post("/auth/logout").then((r) => r.data);
export const getMe = () => axios.get("/auth/me").then((r) => r.data);

export const forgotPassword = (email) =>
    axios.post("/auth/forgot-password", { email }).then((r) => r.data);
export const resetPassword = (token, password) =>
    axios.post(`/auth/reset-password/${token}`, { password }).then((r) => r.data);

export const updateProfile = (payload) => axios.patch("/auth/profile", payload).then((r) => r.data);
export const changePassword = (payload) => axios.patch("/auth/password", payload).then((r) => r.data);
export const setPassword = (newPassword) =>
    axios.patch("/auth/set-password", { newPassword }).then((r) => r.data);

export const requestEmailChange = (newEmail) =>
    axios.post("/auth/request-email-change", { newEmail }).then((r) => r.data);
export const confirmEmailChange = (token) =>
    axios.post(`/auth/confirm-email-change/${token}`).then((r) => r.data);

export const deleteAccount = (password) =>
    axios.delete("/auth/account", { data: { password } }).then((r) => r.data);
