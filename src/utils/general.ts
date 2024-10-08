/* eslint-disable no-restricted-globals */
import { utcFormat } from "d3-time-format";
import jwt_decode from "jwt-decode";
import { jwtRole } from "../types/settings";
import { LoginInfo } from "../types/general";
import queryString from "query-string";
import { sha512 } from "js-sha512";
import { Sort } from "src/types/dashboard";
import html2canvas from "html2canvas";

// sort table rows by a specific table column
export const sortRows = (rows: any, sort: Sort) => {
  return rows?.sort((a: any, b: any) => {
    const { order, orderBy } = sort;

    const aLocale =
      typeof a[orderBy] === "object" || a[orderBy] === undefined
        ? ""
        : ["number", "boolean"].includes(typeof a[orderBy])
        ? a[orderBy].toString()
        : a[orderBy].match(/^\d{2}-\d{2}-\d{4}$/)
        ? a[orderBy].substr(6, 4) +
          a[orderBy].substr(3, 2) +
          a[orderBy].substr(0, 2)
        : a[orderBy];
    const bLocale =
      typeof b[orderBy] === "object" || b[orderBy] === undefined
        ? ""
        : ["number", "boolean"].includes(typeof b[orderBy])
        ? b[orderBy].toString()
        : b[orderBy].match(/^\d{2}-\d{2}-\d{4}$/)
        ? b[orderBy].substr(6, 4) +
          b[orderBy].substr(3, 2) +
          b[orderBy].substr(0, 2)
        : b[orderBy];

    if (order === "asc") {
      return aLocale.localeCompare(bLocale, "en", {
        numeric: typeof b[orderBy] === "number",
      });
    } else {
      return bLocale.localeCompare(aLocale, "en", {
        numeric: typeof a[orderBy] === "number",
      });
    }
  });
};

// check 2fa process
export const handle2FA = (
  data: LoginInfo,
  setCustomerID: (customerID: string) => void,
  setTwoFaNeeded: (twoFaNeeded: boolean) => void,
  setTwoFaSetup: (twoFaSetup: boolean) => void,
  setQRCodeValue: (qrCodeValue: string) => void,
  setSetupKey: (setupKey: string) => void,
  setVerifyEmail: (verifyEmail: string) => void,
  twoFAInitialSetup: any,
  enabledModulesOnLogin: any
) => {
  if (data.mfa.twofa_needed) {
    setCustomerID(data.customer.customer_id);
    setTwoFaNeeded(true);
    setVerifyEmail(data.profile.email);
    if (!data.mfa.twofa_verified) {
      setTwoFaSetup(false);
      twoFAInitialSetup.mutate(
        {
          customerID: data?.customer.customer_id,
          email: { user_email: data.profile.email },
        },
        {
          onSuccess: (data: { uri: string; setup_key: string }) => {
            setQRCodeValue(data.uri);
            setSetupKey(data.setup_key);
          },
        }
      );
    }
  } else if (data.token.access_token !== "")
    onLogin(data.token.access_token, enabledModulesOnLogin);
};

// sign in to the main graph page on login
export const onLogin = (token: string, enabledModulesOnLogin: any) => {
  if (token !== "") {
    enabledModulesOnLogin.mutate({});

    const newDecoded = jwt_decode(token) as any;
    sessionStorage.env = newDecoded.defaultEnvTypeID || "";
    sessionStorage.envName = newDecoded.defaultEnvType || "";
    sessionStorage.accessToken = token;
  }
};

// change the sorting order and/or the table column to sort by
export const handleSort = (category: string, setSort: any) => {
  setSort((prevSort: Sort) => ({
    order:
      prevSort.order === "asc" && prevSort.orderBy === category
        ? "desc"
        : "asc",
    orderBy: category,
  }));
};

// parses the browser url
export const parseURL = () => {
  return queryString.parse(location.search);
};

// get session timeout flag
export const getSessionTimeout = () => {
  return sessionStorage.sessionTimeout;
};
// get raw access token
export const getAccessToken = () => {
  return sessionStorage.accessToken || "";
};

// decodes the raw jwt token
export const decodeJWT = () => {
  const accessToken = getAccessToken();
  return accessToken !== "" && (jwt_decode(accessToken) as any);
};

// get customer id
export const getCustomerID = () => {
  const jwt = decodeJWT();
  return jwt?.scope.customer_id || "";
};

// get customer cloud node id
export const getCustomerCloud = () => {
  const jwt = decodeJWT();
  return (jwt && `customercld-${sha512(jwt.scope.customer_id)}`) || "";
};

// checks if user is super/site admin
export const checkSuperOrSiteAdmin = () => {
  const jwt = decodeJWT();

  return jwt?.scope.roles.some((role: jwtRole) =>
    ["Super Admin", "Site Admin"].includes(role.role_type)
  );
};

// checks if user is super admin
export const checkSuperAdmin = () => {
  const jwt = decodeJWT();

  return jwt?.scope.roles.some(
    (role: jwtRole) => role.role_type === "Super Admin"
  );
};

// checks if user is super admin or grc module admin
export const checkSuperOrGRCAdmin = () => {
  const jwt = decodeJWT();

  return jwt?.scope.roles.some((role: jwtRole) =>
    ["Super Admin", "GRC Admin"].includes(role.role_type)
  );
};

// checks if user is grc module admin
export const checkGRCAdmin = () => {
  const jwt = decodeJWT();

  return jwt?.scope.roles.some((role: jwtRole) =>
    ["GRC Admin"].includes(role.role_type)
  );
};

// checks if user is admin
export const checkIsAdmin = () => {
  const jwt = decodeJWT();

  return jwt?.scope.roles.some((role: jwtRole) => role.role_type === "Admin");
};

export const checkIsAdminOrSuperAdmin = () => {
  const jwt = decodeJWT();

  return jwt?.scope.roles.some((role: jwtRole) =>
    ["Admin", "Super Admin"].includes(role.role_type)
  );
};

// converts utc date to local date
export const convertUTCToLocalDate = (date: Date | null) => {
  if (!date) {
    return date;
  }
  date = new Date(date);
  date = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours()
  );
  return date;
};

// converts local date to utc date
export const convertLocalToUTCDate = (date: Date | null) => {
  if (!date) {
    return date;
  }
  date = new Date(date);
  date = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours()
    )
  );
  return date;
};

// calculate the difference in microseconds between a snapshot time
// and a specific time in the past
export const calcTimeFromSnapshot = (
  timeInterval: number,
  curSnapshotTime?: number
) =>
  curSnapshotTime
    ? Number(curSnapshotTime) - timeInterval
    : Date.now() * 1000 - timeInterval;

// converts last updated time to a more readable format
export const lastUpdatedAt = (updatedAt: number) => {
  const currentTime = Math.floor((Date.now() - updatedAt / 1000) / 1000);
  return currentTime < 60
    ? `just now`
    : currentTime >= 60 && currentTime < 3600
    ? `${Math.floor(currentTime / 60)} minute${
        Math.floor(currentTime / 60) > 1 ? "s" : ""
      } ago`
    : currentTime >= 3600 && currentTime < 86400
    ? `${Math.floor(currentTime / 3600)} hour${
        Math.floor(currentTime / 3600) > 1 ? "s" : ""
      } ago`
    : convertToDate(updatedAt).getUTCFullYear() !== new Date().getUTCFullYear()
    ? utcFormat("%b %d %Y")(convertToDate(updatedAt))
    : utcFormat("%b %d")(convertToDate(updatedAt));
};

// convert bytes into a easier-to-understand format
export const convertBytes = (value: number) => {
  return value / 1e9 > 1
    ? `${Math.floor(value / 1e9)} GB`
    : value / 1e6 > 1
    ? `${Math.floor(value / 1e6)} MB`
    : value / 1000 > 1
    ? `${Math.floor(value / 1000)} kB`
    : `${value} B`;
};

// check validity of url
export const isValidUrl = (str: string) => {
  try {
    new URL(str);
    return true;
  } catch (err) {
    return false;
  }
};

// convert microseconds to date
export const convertToDate = (value: number) => {
  return new Date(value / 1000);
};

// convert microseconds to min
export const convertToMin = (value: number) => {
  return Math.floor(value / 6e7);
};

// convert microseconds to utc date string
export const convertToUTCString = (timestamp: number) => {
  if (timestamp !== 0)
    return `${utcFormat("%b %d %Y %H:%M")(convertToDate(timestamp))} UTC`;
  else return "N/A";
};

// convert microseconds to utc date short string
export const convertToUTCShortString = (timestamp: number) => {
  if (timestamp !== 0) return utcFormat("%b %d %Y")(convertToDate(timestamp));
  else return "N/A";
};

// download page screenshot
export const downloadScreenshot = () => {
  html2canvas(document.querySelector("main") as HTMLElement, {
    backgroundColor: "#151F2B",
    x: window.scrollX,
    y: window.scrollY,
    width: window.innerWidth - 60,
    height: window.innerHeight - 55,
  }).then(function (canvas: { toDataURL: () => string }) {
    const a = document.createElement("a");
    a.download = `Uno-screenshot-${convertToUTCString(Date.now() * 1000)}.png`;
    a.href = canvas.toDataURL();
    a.target = "_blank";
    a.click();
  });
};

// sort numeric data in asc/desc order by property
export const sortNumericData = (data: any, key: string, order: string) => {
  return data?.sort(
    (a: { [key: string]: number }, b: { [key: string]: number }) => {
      if (order === "asc") return a[key] - b[key];
      else return b[key] - a[key];
    }
  );
};

// sort text data in asc/desc order by property
export const sortTextData = (data: any, key: string, order: string) => {
  return data?.sort(
    (a: { [key: string]: string }, b: { [key: string]: string }) => {
      if (order === "asc")
        return a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0;
      else return a[key] > b[key] ? -1 : b[key] > a[key] ? 1 : 0;
    }
  );
};

// convert datetime to microseconds
export const convertToMicrosec = (time: any) => {
  return time?.getTime() * 1000;
};

// check if string is valid json
export const isValidJson = (item: any) => {
  let value = typeof item !== "string" ? JSON.stringify(item) : item;
  try {
    value = JSON.parse(value.replaceAll("'", '"'));
  } catch (e) {
    return false;
  }

  return typeof value === "object" && value !== null;
};

// check whether value is valid epoch time
export const isValidTimestamp = (value: number | string) => {
  return convertToDate(Number(value)).getFullYear() >= 1970;
};

export const handleLegendMouseEnter = (
  key: string,
  sectionProps: any,
  setSectionProps: any
) => {
  if (!sectionProps[key]) {
    setSectionProps({ ...sectionProps, hover: key });
  }
};

export const handleLegendMouseLeave = (
  sectionProps: any,
  setSectionProps: any
) => {
  setSectionProps({ ...sectionProps, hover: null });
};

export const handleSelectSection = (
  key: string,
  sectionProps: any,
  setSectionProps: any
) => {
  setSectionProps({
    ...sectionProps,
    [key]: !sectionProps[key],
    hover: null,
  });
};

// check if value is timestamp
export const isEpoch = (value: string | number) => {
  return convertToDate(Number(value)).getFullYear() >= 1970;
};

export const extractIDFromQuery = (query: string) => {
  return query.slice(query.indexOf(":") + 1, query.indexOf(")"));
};

export const getAllEmails = (text: string) => {
  const emailRegex = /[a-zA-Z0-9-_.+]+@[a-zA-Z0-9-_.]+/gi;
  return [...text.matchAll(emailRegex)].reduce(
    (pV: string[], cV: any) => [...pV, cV[0]],
    []
  );
};
