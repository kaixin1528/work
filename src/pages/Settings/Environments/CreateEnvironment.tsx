/* eslint-disable react-hooks/exhaustive-deps */
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  CreateCustomerEnv,
  GetCustomerEnvs,
} from "../../../services/settings/environments";
import { useState } from "react";
import { CustomerEnv } from "../../../types/settings";
import { validVariants } from "../../../constants/general";
import { motion } from "framer-motion";
import { getCustomerID } from "../../../utils/general";

const CreateEnvironment = () => {
  const customerID = getCustomerID();

  const [addEnvType, setAddEnvType] = useState<boolean>(false);
  const [envType, setEnvType] = useState<string>("");
  const [valid, setValid] = useState<boolean>(true);

  const { data: customerEnvs } = GetCustomerEnvs(customerID);
  const createCustomerEnv = CreateCustomerEnv(customerID);

  const allEnvTypes = [
    ...new Set(
      customerEnvs?.reduce(
        (pV: string[], cV: CustomerEnv) => [...pV, cV.env_type],
        []
      )
    ),
  ] as string[];

  return (
    <li className="relative flex items-center gap-2 h-5">
      {addEnvType && (
        <button
          onClick={() => {
            setEnvType("");
            setAddEnvType(false);
            setValid(true);
          }}
        >
          <FontAwesomeIcon icon={faXmark} className="mt-3 w-3 h-3 red-button" />
        </button>
      )}
      {addEnvType && (
        <article className="flex items-center gap-3 border-b dark:border-checkbox">
          <motion.input
            variants={validVariants}
            initial="hidden"
            animate={!valid ? "visible" : "hidden"}
            type="input"
            spellCheck="false"
            name="environment type"
            autoComplete="off"
            value={envType}
            onChange={(e) => {
              setValid(true);
              setEnvType(e.target.value);
            }}
            className="w-32 text-sm focus:outline-none dark:bg-transparent dark:border-transparent dark:focus:ring-0 dark:focus:border-transparent"
          />
          <button
            disabled={envType === ""}
            onClick={() => {
              if (
                allEnvTypes?.some(
                  (type: string) =>
                    type.toLowerCase().trim() === envType.toLowerCase().trim()
                )
              )
                setValid(false);
              else {
                setValid(true);
                setAddEnvType(false);
                createCustomerEnv.mutate({
                  envType: {
                    env_type: envType,
                  },
                });
              }
            }}
            className="grid self-center p-1 gradient-button rounded-sm"
          >
            <FontAwesomeIcon
              icon={faPlus}
              className="w-[0.35rem] h-[0.35rem]"
            />
          </button>
          {!valid && (
            <span className="absolute -bottom-4 ml-0 text-xs text-left dark:text-reset font-light tracking-wider">
              Name already exists
            </span>
          )}
        </article>
      )}
      {!addEnvType && (
        <button
          className="flex items-center gap-2 mx-5 group"
          onClick={() => {
            setEnvType("");
            setAddEnvType(true);
          }}
        >
          <span className="grid self-center p-1 gradient-button rounded-sm">
            <FontAwesomeIcon
              icon={faPlus}
              className="w-[0.35rem] h-[0.35rem]"
            />
          </span>
          <p className="relative w-max text-[0.8rem] dark:text-checkbox">
            Add environment
          </p>
        </button>
      )}
    </li>
  );
};

export default CreateEnvironment;
