import { motion } from "framer-motion";
import React, { useState } from "react";
import { validVariants } from "src/constants/general";

const RegularInput = ({
  label,
  keyName,
  inputs,
  setInputs,
  disabled,
  valid,
  setValid,
  required,
}: {
  label: string;
  keyName: string;
  inputs: any;
  setInputs: (inputs: any) => void;
  disabled?: boolean;
  valid?: boolean;
  setValid?: (valid: boolean) => void;
  required?: boolean;
}) => {
  const [clicked, setClicked] = useState<boolean>(false);

  return (
    <article className="grid content-start gap-1">
      <h4 className="flex items-center gap-1 justify-self-start">
        {label}{" "}
        {required && (
          <article className="relative group">
            <span>*</span>
            <span className="hidden group-hover:block absolute bottom-5 px-3 py-1 w-max dark:text-black dark:bg-event rounded-md">
              Required field
            </span>{" "}
          </article>
        )}
      </h4>
      <article
        className={`relative flex items-center py-2 pl-4 pr-4 ring-0 dark:ring-search ${
          required && clicked && inputs[keyName] === ""
            ? "border dark:border-reset"
            : "focus:ring-2 dark:focus:ring-signin"
        } dark:bg-search rounded-sm`}
      >
        <motion.input
          variants={validVariants}
          initial="hidden"
          animate={!valid && setValid ? "visible" : "hidden"}
          spellCheck="false"
          autoComplete="off"
          value={inputs[keyName]}
          disabled={disabled}
          onClick={() => setClicked(false)}
          onBlur={() => setClicked(true)}
          onChange={(e) => {
            if (setValid) setValid(true);
            setInputs({
              ...inputs,
              [keyName]: e.target.value,
            });
          }}
          type="input"
          className="py-1 w-full h-6 focus:outline-none placeholder:italic placeholder:text-xs dark:placeholder:text-checkbox dark:disabled:text-checkbox dark:bg-transparent dark:bg-search dark:border-transparent dark:focus:ring-0 dark:focus:border-transparent"
        />
        {setValid && !valid && (
          <span className="absolute -bottom-5 ml-0 text-xs text-left dark:text-reset font-light tracking-wider">
            {label} already exists
          </span>
        )}
      </article>
    </article>
  );
};

export default RegularInput;
