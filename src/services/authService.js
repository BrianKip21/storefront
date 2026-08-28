import axios from "../lib/axios";

export const signup = (payload) => axios.post("/auth/signup", payload).then((r) => r.data);

export const login = (payload) => axios.post("/auth/login", payload).then((r) => r.data);

export const logout = () => axios.post("/auth/logout").then((r) => r.data);

export const getMe = () => axios.get("/auth/me").then((r) => r.data);
