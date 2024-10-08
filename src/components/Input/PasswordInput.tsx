import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const PasswordInput = ({
  label,
  keyName,
  inputs,
  setInputs,
  showInputs,
  setShowInputs,
  disabled,
}: {
  label: string;
  keyName: string;
  inputs: any;
  setInputs: (inputs: any) => void;
  showInputs: any;
  setShowInputs: (showInputs: any) => void;
  disabled?: boolean;
}) => {
  return (
    <article className="grid content-start gap-1">
      <h4 className="justify-self-start">{label}</h4>
      <article
        className={`flex items-center py-2 ${
          showInputs[keyName] ? "pl-4" : "pl-1"
        } pr-4 ring-0 dark:ring-search focus:ring-2 dark:focus:ring-signin dark:bg-search rounded-sm`}
      >
        <input
          spellCheck="false"
          autoComplete="off"
          disabled={disabled}
          value={inputs[keyName]}
          onChange={(e) =>
            setInputs({
              ...inputs,
              [keyName]: e.target.value,
            })
          }
          type={showInputs[keyName] ? "input" : "password"}
          className="py-1 w-full h-6 focus:outline-none placeholder:italic placeholder:text-xs dark:placeholder:text-checkbox dark:bg-transparent dark:bg-search dark:border-transparent dark:focus:ring-0 dark:focus:border-transparent"
        />
        <button
          className="dark:text-checkbox"
          onClick={() =>
            setShowInputs({
              ...showInputs,
              [keyName]: !showInputs[keyName],
            })
          }
        >
          {showInputs[keyName] ? (
            <FontAwesomeIcon icon={faEyeSlash} />
          ) : (
            <FontAwesomeIcon icon={faEye} />
          )}
        </button>
      </article>
    </article>
  );
};

export default PasswordInput;
