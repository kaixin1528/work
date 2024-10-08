/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useIdleTimer } from "react-idle-timer";
import { useGeneralStore } from "../../stores/general";
import { decodeJWT } from "../../utils/general";
import { queryClient } from "src/App";
import { env } from "src/env";

export const client = axios.create({
  baseURL: env.REACT_APP_BASE_URL,
  withCredentials: false,
});

client.interceptors.request.use((config: any) => {
  const accessToken = sessionStorage.accessToken || "";
  if (accessToken !== "") {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

const AxiosInterceptor = ({ children }: { children: any }) => {
  const { setError } = useGeneralStore();

  const { getLastActiveTime } = useIdleTimer({
    timeout: Number(env.REACT_APP_ACTIVITY_TIME_LIMIT),
    promptTimeout: 0,
  });

  const handleLogOut = () => {
    sessionStorage.clear();
    sessionStorage.sessionTimeout = "true";
    window.location.assign("/signin");
  };

  const handleRefresh = async (originalConfig: any) => {
    try {
      const refreshToken = await client.get("/refresh");

      if (refreshToken.data?.access_token)
        sessionStorage.accessToken = refreshToken.data.access_token;

      queryClient.resetQueries();
      return client(originalConfig);
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  };

  client.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (
        navigator.onLine &&
        !error.response &&
        error.message === "Network Error"
      ) {
        process.env.NODE_ENV === "development"
          ? console.error(error)
          : window.location.assign("/503");
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        const originalConfig = error.config;
        switch (error.response.status) {
          case 401:
            if (!["/login", "/oidc-login"].includes(originalConfig.url)) {
              const jwt = decodeJWT();
              if (jwt) {
                // access token expires
                if (Date.now() > jwt?.exp * 1000) {
                  const timeSinceLastActivity =
                    Date.now() - Date.parse(String(getLastActiveTime()));

                  // if time since last activity < 15 min, reset new access token
                  if (
                    timeSinceLastActivity <
                    Number(env.REACT_APP_ACTIVITY_TIME_LIMIT)
                  )
                    handleRefresh(originalConfig);
                  // if time since last activity >= 15 min, logs user out
                  else handleLogOut();
                } else handleLogOut();
              } else handleLogOut();
            } else
              setError({
                url: originalConfig.url,
                message: error.response.data.detail,
              });
            break;
          case 400:
            setError({
              url: originalConfig.url,
              message: error.response.data.detail,
            });
            break;
          case 406:
            setError({
              url: originalConfig.url,
              message: error.response.data.detail,
            });
            break;
          case 422:
            if (typeof error.response.data.detail === "string")
              setError({
                url: originalConfig.url,
                message: error.response.data.detail,
              });
            setError({
              url: originalConfig.url,
              message: `body: "${error.response.data.detail[0].loc[1]}" field required`,
            });
            break;
          case 403:
            window.location.assign("/403");
            break;
          case 502:
            window.location.assign("/502");
            break;
        }
      }
    }
  );

  return children;
};

export default AxiosInterceptor;
