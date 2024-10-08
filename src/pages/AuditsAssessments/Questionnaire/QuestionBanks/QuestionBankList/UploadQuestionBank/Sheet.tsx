/* eslint-disable react-hooks/exhaustive-deps */
import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import NumericFilter from "src/components/Filter/General/NumericFilter";
import Columns from "./Columns";

const Sheet = ({
  headers,
  sheet,
  numOfRows,
  setNumOfRows,
  markedAsQuestionCol,
  setMarkedAsQuestionCol,
  markedAsAnswerCol,
  setMarkedAsAnswerCol,
}: {
  headers: any;
  sheet: any;
  numOfRows: any;
  setNumOfRows: any;
  markedAsQuestionCol: any;
  setMarkedAsQuestionCol: any;
  markedAsAnswerCol: any;
  setMarkedAsAnswerCol: any;
}) => {
  const [rows, setRows] = useState<number>(1);

  useEffect(() => {
    setNumOfRows({ ...numOfRows, [sheet]: rows });
  }, [rows]);

  return (
    <article
      key={sheet}
      className="grid gap-1 p-4 bg-gradient-to-r dark:from-filter/80 dark:to-white/10 rounded-md"
    >
      <h4 className="text-base">Sheet: {sheet}</h4>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={open ? faChevronCircleDown : faChevronCircleRight}
                className="dark:text-checkbox"
              />
              <p>{open ? "Hide" : "Show"} columns</p>
            </Disclosure.Button>
            <Disclosure.Panel>
              <section className="grid gap-3">
                <NumericFilter
                  label="How many header rows?"
                  value={rows}
                  setValue={setRows}
                />
                <Columns
                  label="All"
                  headers={headers}
                  sheet={sheet}
                  markedAsQuestionCol={markedAsQuestionCol}
                  setMarkedAsQuestionCol={setMarkedAsQuestionCol}
                  markedAsAnswerCol={markedAsAnswerCol}
                  setMarkedAsAnswerCol={setMarkedAsAnswerCol}
                />
              </section>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </article>
  );
};

export default Sheet;
