/* eslint-disable react-hooks/exhaustive-deps */
import { faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import TextFilter from "src/components/Filter/General/TextFilter";
import { GetSOPDepartments } from "src/services/business-continuity/sop";
import { KeyStringVal } from "src/types/general";

const Tags = ({
  inputs,
  setInputs,
}: {
  inputs: KeyStringVal;
  setInputs: (inputs: KeyStringVal) => void;
}) => {
  const [selectedTag, setSelectedTag] = useState<string>("");

  const { data: departments } = GetSOPDepartments();

  useEffect(() => {
    setInputs({ ...inputs, selected_tag: selectedTag });
  }, [selectedTag]);

  useEffect(() => {
    setInputs({ ...inputs, entered_tag: "" });
  }, [inputs.selected_tag]);

  return (
    <section className="flex flex-wrap items-center gap-5 text-sm">
      <TextFilter
        label="Department"
        list={departments}
        value={selectedTag}
        setValue={setSelectedTag}
      />
      <span>or</span>
      <article className="flex items-stretch w-max divide-x dark:divide-account border-1 dark:border-org rounded-sm">
        <article className="relative flex items-center gap-2 py-2 px-4 ring-0 dark:ring-search focus:ring-2 dark:focus:ring-signin dark:bg-account rounded-sm">
          <FontAwesomeIcon
            icon={faTag}
            className="w-4 h-4 dark:text-checkbox"
          />
          <input
            spellCheck="false"
            autoComplete="off"
            name="new tag name"
            value={inputs.entered_tag}
            onChange={(e) => {
              setSelectedTag("");
              setInputs({ ...inputs, entered_tag: e.target.value });
            }}
            type="input"
            className="py-3 w-20 h-3 focus:outline-none dark:placeholder:text-checkbox dark:text-white dark:bg-transparent dark:bg-account dark:border-transparent dark:focus:ring-0 dark:focus:border-transparent"
          />
        </article>
      </article>
    </section>
  );
};

export default Tags;
