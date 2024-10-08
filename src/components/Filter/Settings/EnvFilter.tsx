/* eslint-disable no-restricted-globals */
import { ChevronDownIcon } from "@heroicons/react/solid";
import { motion } from "framer-motion";
import { useState } from "react";
import { filterVariants } from "../../../constants/general";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";
import { GetCustomerEnvs } from "../../../services/settings/environments";
import { getCustomerID } from "../../../utils/general";
import { CustomerEnv } from "../../../types/settings";

const EnvFilter = ({ value, list }: { value: string; list: string[] }) => {
  const navigate = useNavigate();
  const parsed = queryString.parse(location.search);
  const customerID = getCustomerID();

  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const { data: customerEnvs } = GetCustomerEnvs(customerID);

  return (
    <section
      className="text-sm mr-3"
      onMouseLeave={() => setShowDropdown(false)}
    >
      <article
        onMouseMove={() => setShowDropdown(true)}
        className="relative w-max py-1 px-10 text-left cursor-pointer bg-gradient-to-b dark:from-tooltip dark:to-tooltip/30 focus:outline-none rounded-t-sm"
      >
        <span className="block truncate">
          {value === "" ? "Select Environment" : value}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon className="w-3 h-3" aria-hidden="true" />
        </span>
        {showDropdown && (
          <motion.article
            variants={filterVariants}
            initial="hidden"
            animate={showDropdown ? "visible" : "hidden"}
            className="absolute right-0 grid w-full max-h-60 py-2 content-start z-50 overflow-auto scrollbar shadow-2xl dark:shadow-checkbox/30 dark:bg-tooltip focus:outline-none rounded-b-sm"
          >
            {list?.map((item: string, index: number) => (
              <motion.button
                key={index}
                variants={filterVariants}
                disabled={!showDropdown}
                className={`relative py-1 break-all dark:hover:bg-filter/50 ${
                  value === item ? "dark:bg-filter" : ""
                } duration-100`}
                onClick={() => {
                  parsed.env =
                    customerEnvs?.find(
                      (customerEnv: CustomerEnv) => customerEnv.env_id === item
                    )?.env_id || "";
                  navigate(
                    `${window.location.pathname}?${queryString.stringify(
                      parsed
                    )}`
                  );
                }}
              >
                <p>{item}</p>
              </motion.button>
            ))}
          </motion.article>
        )}
      </article>
    </section>
  );
};

export default EnvFilter;
