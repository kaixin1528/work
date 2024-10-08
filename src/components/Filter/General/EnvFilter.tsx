/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { filterVariants } from "../../../constants/general";
import { getCustomerID } from "../../../utils/general";
import DropdownLayout from "../../../layouts/DropdownLayout";
import { GetCustomerEnvs } from "../../../services/settings/environments";
import { CustomerEnv } from "../../../types/settings";
import { useGeneralStore } from "src/stores/general";
import { useEffect } from "react";

const EnvFilter = () => {
  const customerID = getCustomerID();

  const { setEnv } = useGeneralStore();

  const { data: customerEnvs } = GetCustomerEnvs(customerID);

  const allEnvTypes = [
    ...new Set(
      customerEnvs?.reduce(
        (pV: string[], cV: CustomerEnv) => [...pV, cV.env_type],
        []
      )
    ),
  ] as string[];

  useEffect(() => {
    setEnv(sessionStorage.env);
  }, []);

  return (
    <DropdownLayout value={sessionStorage.envName}>
      {allEnvTypes?.map((item: string, index: number) => (
        <motion.button
          key={index}
          variants={filterVariants}
          className={`relative py-1 px-7 text-left break-all dark:hover:bg-filter/50 ${
            sessionStorage.envName === item ? "dark:bg-filter" : ""
          } duration-100`}
          onClick={() => {
            sessionStorage.envName = item;
            const envID =
              customerEnvs?.find(
                (customerEnv: CustomerEnv) => customerEnv.env_type === item
              )?.env_id || "";
            if (envID !== "") {
              sessionStorage.env = envID;
              setEnv(envID);
            }
          }}
        >
          <p>{item}</p>
        </motion.button>
      ))}
    </DropdownLayout>
  );
};

export default EnvFilter;
