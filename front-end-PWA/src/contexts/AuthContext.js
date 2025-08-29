import {
  createContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import client from "../services/apiClient";
import userApi from "../services/userApi";

/** @typedef {{
 *  token: string|null,
 *  user: any,
 *  isAuthenticated: boolean,
 *  login: (email:string, password:string) => Promise<{token:string,user:any}>,
 *  logout: () => Promise<void>,
 *  setUser: React.Dispatch<React.SetStateAction<any>>,
 *  initializing: boolean
 * }} AuthCtx */

/** @type {React.Context<AuthCtx|null>} */
const AuthContext = createContext(/** @type {any} */ (null));

export function AuthProvider({ children }) {
  const [token, setToken] = useState(/** @type {string|null} */ (null));
  const [user, setUser] = useState(/** @type {any} */ (null));
  /** @type {React.MutableRefObject<Promise<string>|null>} */
  const refreshRef = useRef(/** @type {any} */ (null));

  useEffect(() => {
    if (token) client.defaults.headers.common.Authorization = `Bearer ${token}`;
    else delete client.defaults.headers.common.Authorization;
  }, [token]);

  useEffect(() => {
    const id = client.interceptors.response.use(
      (r) => r,
      async (err) => {
        const { config, response } = err || {};
        if (response?.status !== 401 || config?._retry) throw err;

        try {
          config._retry = true;
          if (!refreshRef.current) {
            refreshRef.current = client
              .post("/auth/refresh")
              .then((r) => r?.data?.access_token ?? r?.data?.meta?.access_token)
              .finally(() => {
                refreshRef.current = null;
              });
          }
          const newAccess = await refreshRef.current;
          if (!newAccess) throw err;

          setToken(newAccess);
          config.headers = {
            ...(config.headers || {}),
            Authorization: `Bearer ${newAccess}`,
          };
          return client(config);
        } catch (e) {
          setToken(null);
          setUser(null);
          throw e;
        }
      }
    );
    return () => client.interceptors.response.eject(id);
  }, []);

  // helper pour récupérer le token quelle que soit la forme
  const extractAccess = (p) =>
    p?.access_token ?? p?.meta?.access_token ?? p?.token;

  /** @type {(email:string, password:string) => Promise<{token:string,user:any}>} */
  // 👉 C’est ICI que le Context utilise TON service
  const login = useCallback(async (email, password) => {
    const res = await userApi.login(email, password);
    if (!res.ok) {
      const msg =
        res.data?.details?.[0]?.issue ||
        res.data?.message ||
        "Échec de la connexion.";
      throw Object.assign(new Error(msg), {
        response: { data: res.data, status: res.status },
      });
    }

    const payload = res.data;
    const access = extractAccess(payload);
    if (!access) {
      throw new Error("Access token manquant dans la réponse.");
    }

    setToken(access);
    setUser(payload?.user ?? null); // ton /sign-in renvoie déjà { user: {...} }
    return { token: access, user: payload?.user ?? null };
  }, []);

  const logout = useCallback(async () => {
    await userApi.logout().catch(() => {});
    setToken(null);
    setUser(null);
  }, []);
  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      login,
      logout,
      setUser,
    }),
    [token, user, login, logout]
  );

  return (
    <AuthContext.Provider value={/** @type {any} */ (value)}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans <AuthProvider>");
  return ctx;
};
