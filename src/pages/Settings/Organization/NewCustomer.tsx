import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Lottie from "react-lottie-player";
import { CreateCustomer } from "src/services/settings/organization";
import { CustomerInput } from "src/types/settings";
import waitingTea from "../../../lottie/coffee.json";
import { checkSuperAdmin } from "src/utils/general";

const NewCustomer = () => {
  const isSuperAdmin = checkSuperAdmin();

  const [createOrg, setCreateOrg] = useState<boolean>(false);
  const [org, setOrg] = useState<CustomerInput>({
    customer_name: "",
    customer_alias: "",
    address: "",
    auth_scheme: "BASIC",
    auth_provider: "UNO",
    domain: "",
    site_admin: false,
  });

  const createCustomer = CreateCustomer();

  return (
    <>
      {!createOrg ? (
        <li
          className="px-4 py-2 w-max h-max cursor-pointer text-sm dark:text-admin dark:hover:text-admin/60 duration-100 border dark:border-admin rounded-sm"
          onClick={() => {
            setCreateOrg(true);
            setOrg({
              customer_name: "",
              customer_alias: "",
              address: "",
              auth_scheme: "BASIC",
              auth_provider: "UNO",
              domain: "",
              site_admin: false,
            });
          }}
        >
          Add Customer
        </li>
      ) : (
        <li className="relative grid content-start gap-3 p-5 text-sm border dark:border-admin rounded-sm">
          <button>
            <FontAwesomeIcon
              icon={faXmark}
              className="absolute top-5 right-5 dark:text-white dark:hover:text-filter/60 duration-100"
              onClick={() => setCreateOrg(false)}
            />
          </button>
          <input
            type="input"
            name="customer name"
            placeholder="Name"
            spellCheck="false"
            autoComplete="off"
            disabled={createCustomer.status === "loading"}
            value={org.customer_name}
            onChange={(e) =>
              setOrg({
                ...org,
                customer_name: e.target.value,
              })
            }
            className="w-5/6 placeholder:tracking-wide dark:placeholder:text-gray-300 placeholder:font-light dark:text-white dark:bg-transparent border-b dark:border-admin focus:outline-none"
          />
          <input
            type="input"
            name="customer alias"
            placeholder="Alias"
            spellCheck="false"
            autoComplete="off"
            disabled={createCustomer.status === "loading"}
            value={org.customer_alias}
            onChange={(e) =>
              setOrg({
                ...org,
                customer_alias: e.target.value,
              })
            }
            className="w-5/6 placeholder:tracking-wide dark:placeholder:text-gray-300 placeholder:font-light dark:text-white dark:bg-transparent border-b dark:border-admin focus:outline-none"
          />
          <input
            type="input"
            name="address"
            placeholder="Address"
            spellCheck="false"
            autoComplete="off"
            disabled={createCustomer.status === "loading"}
            value={org.address}
            onChange={(e) =>
              setOrg({
                ...org,
                address: e.target.value,
              })
            }
            className="w-5/6 placeholder:tracking-wide dark:placeholder:text-gray-300 placeholder:font-light dark:text-white dark:bg-transparent border-b dark:border-admin focus:outline-none"
          />

          {isSuperAdmin && (
            <article className="flex gap-3 items-center">
              <input
                type="checkbox"
                className="form-checkbox w-3 h-3 rounded-md dark:bg-checkbox/50 border dark:border-checkbox dark:ring-0 dark:text-signin dark:focus:border-signin focus:ring dark:focus:ring-offset-0 dark:focus:ring-signin focus:ring-opacity-50"
                onChange={() =>
                  setOrg({
                    ...org,
                    site_admin: !org.site_admin,
                  })
                }
              />
              <label>Site admin</label>
            </article>
          )}

          {/* check if using external provider */}
          <article className="flex gap-3 items-center">
            <input
              type="checkbox"
              className="form-checkbox w-3 h-3 rounded-md dark:bg-checkbox/50 border dark:border-checkbox dark:ring-0 dark:text-signin dark:focus:border-signin focus:ring dark:focus:ring-offset-0 dark:focus:ring-signin focus:ring-opacity-50"
              onChange={() => {
                if (org.auth_scheme === "BASIC")
                  setOrg({
                    ...org,
                    auth_scheme: "OIDC",
                    auth_provider: "GOOGLE",
                  });
                else
                  setOrg({
                    ...org,
                    auth_scheme: "BASIC",
                    auth_provider: "UNO",
                  });
              }}
            />
            <label>Use OIDC via Google Login</label>
          </article>

          {/* enter domain name if using external provider */}
          {org.auth_scheme === "OIDC" && (
            <input
              type="input"
              name="domain"
              placeholder="Domain"
              spellCheck="false"
              autoComplete="off"
              disabled={createCustomer.status === "loading"}
              value={org.domain || ""}
              onChange={(e) =>
                setOrg({
                  ...org,
                  domain: e.target.value,
                })
              }
              className="w-5/6 placeholder:tracking-wide dark:placeholder:text-gray-300 placeholder:font-light dark:text-white dark:bg-transparent border-b dark:border-admin focus:outline-none"
            />
          )}

          {createCustomer.status === "loading" && (
            <article className="absolute top-1/4 left-1/2 -translate-x-1/2 grid mx-auto w-24 h-10">
              <article className="h-[5rem]">
                <Lottie
                  loop
                  animationData={waitingTea}
                  play={true}
                  rendererSettings={{
                    preserveAspectRatio: "xMidYMid slice",
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </article>
            </article>
          )}

          <button
            disabled={
              org.customer_name === "" ||
              org.customer_alias === "" ||
              createCustomer.status === "loading"
            }
            className="px-4 py-1 mx-auto w-max text-sm dark:text-admin dark:hover:text-admin/60 dark:disabled:text-filter duration-100 border dark:border-admin dark:disabled:border-filter rounded-sm"
            onClick={() => {
              setCreateOrg(false);
              createCustomer.mutate({ customer: org });
            }}
          >
            Add Customer
          </button>
        </li>
      )}
    </>
  );
};

export default NewCustomer;
