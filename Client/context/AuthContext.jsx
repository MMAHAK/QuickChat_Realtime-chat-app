import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useNavigate } from 'react-router-dom';

const rawBackendUrl = import.meta.env.VITE_BACKEND_URL;
const normalizedBackendUrl = (rawBackendUrl || "http://localhost:5000")
  .replace(/^['"]|['"]$/g, "")
  .trim();

const backendUrl = (() => {
  try {
    const parsed = new URL(normalizedBackendUrl);
    // Always use origin so accidental path fragments don't become socket namespaces.
    return parsed.origin;
  } catch {
    return "http://localhost:5000";
  }
})();
axios.defaults.baseURL = backendUrl;
const isSocketDebugEnabled = import.meta.env.VITE_SOCKET_DEBUG === "true";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);

        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);

      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user); // FIXED

        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        navigate("/");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);

    axios.defaults.headers.common["token"] = null;

    socket?.disconnect(); // FIXED
    toast.success("Logged out successfully");
  };

  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    if (isSocketDebugEnabled) {
      console.log("[socket:init]", {
        backendUrl,
        rawBackendUrl,
        normalizedBackendUrl,
        userId: userData?._id,
      });
    }

    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });

    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });

    if (isSocketDebugEnabled) {
      newSocket.on("connect", () => {
        console.log("[socket:connect]", {
          id: newSocket.id,
          namespace: newSocket.nsp,
          connected: newSocket.connected,
        });
      });

      newSocket.on("connect_error", (error) => {
        console.log("[socket:connect-error]", {
          message: error?.message,
          description: error?.description,
          context: error?.context,
        });
      });

      newSocket.on("disconnect", (reason) => {
        console.log("[socket:disconnect]", { reason });
      });
    }
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      checkAuth();
    }
  }, [token]);

  useEffect(() => {
    return () => {
      socket?.disconnect();
    };
  }, []);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};