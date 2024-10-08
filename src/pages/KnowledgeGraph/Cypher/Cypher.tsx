/* eslint-disable react-hooks/exhaustive-deps */
import {
  faChevronDown,
  faChevronRight,
  faDiagramProject,
  faKeyboard,
  faNoteSticky,
  faPlus,
  faTable,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import CypherMatchFilter from "src/components/Filter/Graph/CypherMatchFilter";
import CypherConditionFilter from "src/components/Filter/Graph/CypherConditionFilter";
import {
  cypherMatch1Params,
  cypherReturnTypes,
  initialMatch,
  newCondition,
  nodeThreshold,
} from "src/constants/graph";
import ModalLayout from "src/layouts/ModalLayout";
import { useGraphStore } from "src/stores/graph";
import { KeyStringVal } from "src/types/general";
import NumericFilter from "src/components/Filter/General/NumericFilter";
import { validVariants } from "src/constants/general";
import { motion } from "framer-motion";
import { useGeneralStore } from "src/stores/general";
import { Disclosure } from "@headlessui/react";

const Cypher = ({
  startTime,
  endTime,
  setSelectedReturnType,
}: {
  startTime: number;
  endTime: number;
  setSelectedReturnType: (selectedReturnType: string) => void;
}) => {
  const { error, setError } = useGeneralStore();

  const {
    navigationView,
    graphSearchString,
    setGraphSearchString,
    setGraphSearch,
    setGraphSearching,
    temporalStartDate,
    temporalEndDate,
  } = useGraphStore();

  const [showCypher, setShowCypher] = useState<boolean>(false);
  const [match, setMatch] = useState<KeyStringVal>(initialMatch);
  const [conditions, setConditions] = useState<KeyStringVal[]>([]);
  const [returnTypes, setReturnTypes] = useState<string[]>(cypherReturnTypes);
  const [limit, setLimit] = useState<number>(nodeThreshold);

  const matchString = `MATCH (${match.match1Name}:${match.match1Value})${
    match.relName
      ? `-[${match.relName}:${match.relValue}]-`
      : match.match2Name
      ? "-[:]-"
      : ""
  }${
    match.match2Name
      ? `(${match.match2Name}:${match.match2Value})`
      : match.relValue
      ? "()"
      : ""
  }`;
  const whereString = `${conditions.map((condition, index) => {
    if (condition.match)
      return `${index > 0 ? " AND" : " WHERE"} ${condition.match}.${
        condition.propertyName
      }${condition.propertyOperator}${
        condition.propertyValue ? `"${condition.propertyValue}"` : '""'
      }`;
    else return "";
  })}`.replaceAll(",", "");
  const returnString = ` RETURN (type:*, content_type:${
    returnTypes.length === 3
      ? "uno/*"
      : `${returnTypes.map((returnType) => `uno/${returnType}`)}`
  })`;
  const limitString = ` LIMIT ${limit}`;

  useEffect(() => {
    if (graphSearchString !== "") {
      const returnIndex =
        graphSearchString.indexOf("RETURN") !== -1
          ? graphSearchString.indexOf("RETURN")
          : graphSearchString.length;
      const whereIndex =
        graphSearchString.indexOf("WHERE") !== -1
          ? graphSearchString.indexOf("WHERE")
          : returnIndex !== -1
          ? returnIndex
          : graphSearchString.length;
      const matchString = graphSearchString
        .slice(0, whereIndex)
        .replaceAll(" ", "")
        .replace("MATCH", "");
      const match1 = matchString
        .slice(0, matchString.indexOf(")"))
        .replace("(", "");
      const match2 = matchString
        .slice(matchString.indexOf("["), matchString.indexOf("]"))
        .replace("[", "")
        .replace("]", "");
      const match3 =
        matchString.indexOf("-(") !== -1
          ? matchString
              .slice(matchString.indexOf("-("))
              .replace("-(", "")
              .replace(")", "")
          : "";
      const whereArr = graphSearchString
        .slice(whereIndex, returnIndex)
        .replaceAll(" ", "")
        .replace("WHERE", "")
        .replaceAll("VARIABLE_VALUE", "")
        .split("AND");
      setMatch({
        match1Name: match1.slice(0, match1.indexOf(":")) || "",
        match1Value: match1.slice(match1.indexOf(":") + 1) || "",
        relName: match2.split(":")[0] || "",
        relValue: match2.split(":")[1] || "",
        match2Name: match3.split(":")[0] || "",
        match2Value: match3.split(":")[1] || "",
      });
      setConditions(
        whereArr.map((condition) => {
          const propertyNameIndex = condition.indexOf(".");
          const operatorIndex = condition.search(/[^A-Za-z_0-9@.]/);
          const propertyValueIndex =
            condition.indexOf('"') !== -1
              ? condition.indexOf('"')
              : condition.indexOf("“");
          const match = condition.slice(0, propertyNameIndex) || "";
          const propertyName =
            condition.slice(propertyNameIndex + 1, operatorIndex) || "";
          const propertyOperator =
            condition
              .slice(operatorIndex, propertyValueIndex)
              .replace('"', "") || "";
          const propertyValue =
            condition
              .slice(propertyValueIndex)
              .replaceAll('"', "")
              .replaceAll("“", "")
              .replaceAll("”", "") || "";
          return {
            match: match,
            propertyName: propertyName,
            propertyOperator: propertyOperator,
            propertyValue: propertyValue,
          };
        })
      );
    } else {
      setMatch(initialMatch);
      setConditions([]);
      setReturnTypes(returnTypes);
      setLimit(nodeThreshold);
    }
  }, [graphSearchString]);

  useEffect(() => {
    if (navigationView === "temporal" && temporalStartDate === temporalEndDate)
      setError({
        url: "/autocomplete",
        message: "Date must be selected first in order to use Cypher UnoQL",
      });
    else setError({ url: "", message: "" });
  }, [navigationView, temporalStartDate, temporalEndDate]);

  useEffect(() => {
    setConditions(
      conditions.filter((condition) => condition.match !== match.match1Name)
    );
  }, [match.match1Name, match.match1Value]);

  useEffect(() => {
    setConditions(
      conditions.filter((condition) => condition.match !== match.match2Name)
    );
  }, [match.match2Name, match.match2Value]);

  const handleCypherSearch = () => {
    setGraphSearch(true);
    setGraphSearching(false);
    setGraphSearchString(
      `${matchString}${whereString}${returnString}${limitString}`
    );
    setSelectedReturnType("");
  };

  const handleOnClose = () => {
    setShowCypher(false);
  };

  return (
    <>
      <button
        className="group relative dark:text-admin dark:hover:text-admin/60 duration-100"
        onClick={() => setShowCypher(!showCypher)}
      >
        <FontAwesomeIcon icon={faKeyboard} />
        <span className="hidden group-hover:block absolute top-10 left-0 p-2 w-max text-xs dark:text-white dark:bg-filter black-shadow rounded-sm z-20">
          UnoQL Query Builder
        </span>
      </button>
      <ModalLayout showModal={showCypher} onClose={handleOnClose}>
        <section className="grid gap-5 font-extralight">
          <header className="flex items-center gap-2 border-b-1 dark:border-admin">
            <FontAwesomeIcon icon={faKeyboard} className="dark:text-admin" />
            <h3 className="w-max text-base">UnoQL</h3>
          </header>
          <section className="grid gap-5">
            <article className="grid grid-cols-10 items-start gap-10 p-4 w-full dark:bg-card">
              <article className="col-span-8 grid gap-2">
                {[matchString, whereString, returnString, limitString].map(
                  (string, index) => {
                    if (string === "") return null;
                    return (
                      <span key={index} className="break-words">
                        {string}
                      </span>
                    );
                  }
                )}
              </article>
              <button
                className="col-span-2 justify-self-end px-4 py-1 w-max text-xs dark:bg-reset dark:hover:bg-reset/70 duration-100 focus:outline-none rounded-sm"
                onClick={() => {
                  setMatch(initialMatch);
                  setConditions([]);
                }}
              >
                Clear
              </button>
            </article>
            {error.url.includes("/autocomplete") && error.message !== "" && (
              <motion.article
                variants={validVariants}
                initial="hidden"
                animate={error.message !== "" ? "visible" : "hidden"}
                className="p-2 mt-2 break-words text-sm text-left dark:bg-inner border dark:border-error rounded-sm"
              >
                <p>{error.message}</p>
              </motion.article>
            )}
            <Disclosure defaultOpen>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex items-center gap-2 px-2 py-1 w-max cursor-pointer dark:bg-admin/30 dark:hover:bg-admin/60 duration-100 border dark:border-admin">
                    <h4>MATCH</h4>
                    <FontAwesomeIcon
                      icon={open ? faChevronDown : faChevronRight}
                      className="w-2 h-2"
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="grid gap-5">
                    <article className="flex items-center gap-2 pl-10 w-full">
                      <span>(</span>
                      <CypherMatchFilter
                        list={cypherMatch1Params}
                        queryParam="match1"
                        keyName="match1Name"
                        match={match}
                        setMatch={setMatch}
                        conditions={conditions}
                        startTime={startTime}
                        endTime={endTime}
                      />
                      {match.match1Name && (
                        <>
                          <span>:</span>
                          <CypherMatchFilter
                            queryParam={match.match1Name}
                            keyName="match1Value"
                            match={match}
                            setMatch={setMatch}
                            conditions={conditions}
                            startTime={startTime}
                            endTime={endTime}
                          />
                        </>
                      )}
                      <span>)</span>
                    </article>
                    {match.match1Value && (
                      <>
                        {((match.match1Name === "id" && !match.match2Name) ||
                          !["extension", "annotation", "id"].includes(
                            match.match1Name
                          )) && (
                          <article className="flex items-center gap-2 pl-10">
                            <span>-[</span>
                            <CypherMatchFilter
                              list={
                                match.match1Name === "id"
                                  ? ["rel", "radius", "impact_radius"]
                                  : ["rel"]
                              }
                              queryParam="relation"
                              keyName="relName"
                              match={match}
                              setMatch={setMatch}
                              conditions={conditions}
                              startTime={startTime}
                              endTime={endTime}
                            />
                            <CypherMatchFilter
                              queryParam={match.relName}
                              keyName="relValue"
                              match={match}
                              setMatch={setMatch}
                              conditions={conditions}
                              startTime={startTime}
                              endTime={endTime}
                            />
                            <span>]-</span>
                          </article>
                        )}
                        {!match.relName.includes("radius") && (
                          <article className="flex items-center gap-2 pl-10">
                            <span>(</span>
                            <CypherMatchFilter
                              list={
                                match.match1Name.includes("resource")
                                  ? ["type"]
                                  : ["connected"]
                              }
                              queryParam="match2"
                              keyName="match2Name"
                              match={match}
                              setMatch={setMatch}
                              conditions={conditions}
                              startTime={startTime}
                              endTime={endTime}
                            />
                            <span>:</span>
                            <CypherMatchFilter
                              queryParam={match.match2Name}
                              keyName="match2Value"
                              match={match}
                              setMatch={setMatch}
                              conditions={conditions}
                              startTime={startTime}
                              endTime={endTime}
                            />
                            <span>)</span>
                          </article>
                        )}
                      </>
                    )}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </section>
          <Disclosure defaultOpen>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center gap-2 px-2 py-1 w-max cursor-pointer dark:bg-admin/30 dark:hover:bg-admin/60 duration-100 border dark:border-admin">
                  <h4>WHERE</h4>
                  <FontAwesomeIcon
                    icon={open ? faChevronDown : faChevronRight}
                    className="w-2 h-2"
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="grid gap-5">
                  {conditions.length > 0 && (
                    <ul className="grid gap-5">
                      {conditions.map((condition, index) => {
                        return (
                          <li
                            key={index}
                            className="flex items-start gap-2 pl-10"
                          >
                            {index > 0 && <p className="-ml-9 mt-2">AND</p>}
                            <CypherConditionFilter
                              list={[match.match1Name, match.match2Name].filter(
                                (name) =>
                                  ![
                                    "",
                                    "radius",
                                    "impact_radius",
                                    "resource_status",
                                  ].includes(name)
                              )}
                              index={index}
                              keyName="match"
                              match={match}
                              condition={condition}
                              conditions={conditions}
                              setConditions={setConditions}
                            />
                            <span>.</span>
                            <section className="grid gap-2">
                              {condition.match && (
                                <CypherConditionFilter
                                  label="name"
                                  index={index}
                                  keyName="propertyName"
                                  match={match}
                                  condition={condition}
                                  conditions={conditions}
                                  setConditions={setConditions}
                                  startTime={startTime}
                                  endTime={endTime}
                                />
                              )}
                              {condition.propertyName && (
                                <CypherConditionFilter
                                  label="operator"
                                  index={index}
                                  keyName="propertyOperator"
                                  match={match}
                                  condition={condition}
                                  conditions={conditions}
                                  setConditions={setConditions}
                                  startTime={startTime}
                                  endTime={endTime}
                                />
                              )}
                              {condition.propertyName &&
                                condition.propertyOperator && (
                                  <CypherConditionFilter
                                    label="value"
                                    index={index}
                                    keyName="propertyValue"
                                    match={match}
                                    condition={condition}
                                    conditions={conditions}
                                    setConditions={setConditions}
                                    startTime={startTime}
                                    endTime={endTime}
                                  />
                                )}
                            </section>
                            <button
                              className="ml-2 mt-2 red-button"
                              onClick={() =>
                                setConditions(
                                  conditions.filter(
                                    (_, curIndex) => curIndex !== index
                                  )
                                )
                              }
                            >
                              <FontAwesomeIcon icon={faTrashCan} />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  <button
                    className="ml-10 px-2 w-max dark:bg-filter/30 dark:hover:bg-filter/60 duration-100 border dark:border-filter"
                    onClick={() =>
                      setConditions([
                        ...conditions,
                        {
                          ...newCondition,
                          match:
                            match.match1Name && match.match2Name
                              ? ""
                              : match.match1Name || match.match2Name,
                        },
                      ])
                    }
                  >
                    <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                  </button>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <Disclosure defaultOpen>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center gap-2 px-2 py-1 w-max cursor-pointer dark:bg-admin/30 dark:hover:bg-admin/60 duration-100 border dark:border-admin">
                  <h4>RETURN</h4>
                  <FontAwesomeIcon
                    icon={open ? faChevronDown : faChevronRight}
                    className="w-2 h-2"
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="grid gap-5">
                  <ul className="flex items-center gap-5 px-10">
                    {cypherReturnTypes.map((option) => {
                      return (
                        <li
                          key={option}
                          className={`flex items-center gap-2 px-2 py-1 capitalize cursor-pointer ${
                            returnTypes.includes(option)
                              ? "selected-button"
                              : ""
                          } dark:hover:bg-signin/60 duration-100`}
                          onClick={() => {
                            if (!returnTypes.includes(option))
                              setReturnTypes([...returnTypes, option]);
                            else
                              setReturnTypes(
                                returnTypes.filter(
                                  (returnType) => returnType !== option
                                )
                              );
                          }}
                        >
                          <FontAwesomeIcon
                            icon={
                              option === "graph"
                                ? faDiagramProject
                                : option === "table"
                                ? faTable
                                : faNoteSticky
                            }
                            className="dark:text-checkbox"
                          />
                          <p>{option}</p>
                        </li>
                      );
                    })}
                  </ul>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <Disclosure defaultOpen>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center gap-2 px-2 py-1 w-max cursor-pointer dark:bg-admin/30 dark:hover:bg-admin/60 duration-100 border dark:border-admin">
                  <h4>LIMIT</h4>
                  <FontAwesomeIcon
                    icon={open ? faChevronDown : faChevronRight}
                    className="w-2 h-2"
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="grid gap-5">
                  <article className="flex items-center gap-5 px-7">
                    <NumericFilter value={limit} setValue={setLimit} />
                    {limit >= 500 && (
                      <motion.article
                        variants={validVariants}
                        initial="hidden"
                        animate={limit >= 500 ? "visible" : "hidden"}
                        className="p-2 w-max break-words text-xs text-left dark:bg-medium/30 border dark:border-medium rounded-sm"
                      >
                        <p>Your search might be take a little longer</p>
                      </motion.article>
                    )}
                  </article>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <button
            disabled={
              match.match1Name === "" ||
              match.match1Value === "" ||
              returnTypes.length === 0 ||
              limit === 0
            }
            className="justify-self-center px-4 py-1 w-max dark:disabled:text-filter dark:disabled:bg-expand dark:bg-admin dark:hover:bg-admin/70 duration-100 focus:outline-none rounded-sm"
            onClick={() => {
              handleCypherSearch();
              handleOnClose();
            }}
          >
            Search
          </button>
        </section>
      </ModalLayout>
    </>
  );
};

export default Cypher;
