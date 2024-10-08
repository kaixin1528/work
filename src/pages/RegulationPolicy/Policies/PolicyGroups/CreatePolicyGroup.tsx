/* eslint-disable react-hooks/exhaustive-deps */
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { motion } from "framer-motion";
import { validVariants } from "src/constants/general";
import {
  AddPolicyGroup,
  GetPolicyGroups,
} from "src/services/regulation-policy/policy";
import { KeyStringVal } from "src/types/general";

const CreatePolicyGroup = () => {
  const [addPolicyGroup, setAddPolicyGroup] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [valid, setValid] = useState<boolean>(true);

  const { data: policyGroups } = GetPolicyGroups();
  const createPolicyGroup = AddPolicyGroup();

  const handleOnEnter = () => {
    if (
      policyGroups?.some(
        (policyGroup: KeyStringVal) =>
          policyGroup.title.toLowerCase().trim() === title.toLowerCase().trim()
      )
    )
      setValid(false);
    else {
      setValid(true);
      setAddPolicyGroup(false);
      createPolicyGroup.mutate({
        title: title,
        description: description,
      });
    }
  };

  return (
    <li className="relative flex items-center gap-2 h-5">
      {addPolicyGroup && (
        <>
          <button
            onClick={() => {
              setTitle("");
              setDescription("");
              setAddPolicyGroup(false);
              setValid(true);
            }}
          >
            <FontAwesomeIcon icon={faXmark} className="w-5 h-5 red-button" />
          </button>
          <article className="flex items-center gap-3 border-b dark:border-checkbox">
            <motion.input
              variants={validVariants}
              initial="hidden"
              animate={!valid ? "visible" : "hidden"}
              type="input"
              spellCheck="false"
              autoComplete="off"
              value={title}
              onKeyUp={(e) => {
                if (e.key === "Enter") handleOnEnter();
              }}
              onChange={(e) => {
                setValid(true);
                setTitle(e.target.value);
              }}
              className="w-60 text-sm focus:outline-none dark:bg-transparent dark:border-transparent dark:focus:ring-0 dark:focus:border-transparent"
            />
            <button
              disabled={title === ""}
              onClick={handleOnEnter}
              className="grid self-center p-1 mb-2 green-gradient-button rounded-sm"
            >
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
            </button>
            {!valid && (
              <span className="absolute -bottom-4 ml-0 text-xs text-left dark:text-reset font-light tracking-wider">
                Name already exists
              </span>
            )}
          </article>
        </>
      )}
      {!addPolicyGroup && (
        <button
          className="flex items-center gap-2 mx-5 group"
          onClick={() => {
            setTitle("");
            setDescription("");
            setAddPolicyGroup(true);
          }}
        >
          <span className="grid self-center p-1 green-gradient-button rounded-sm">
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          </span>
          <p className="relative w-max text-sm dark:text-checkbox">
            Add Policy Group
          </p>
        </button>
      )}
    </li>
  );
};

export default CreatePolicyGroup;
