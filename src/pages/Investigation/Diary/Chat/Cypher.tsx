import {
  faBars,
  faChevronDown,
  faChevronRight,
  faPenToSquare,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import CypherConditionFilter from "src/components/Filter/Graph/CypherConditionFilter";
import CypherMatchFilter from "src/components/Filter/Graph/CypherMatchFilter";
import {
  cypherReturnTypes,
  initialMatch,
  newCondition,
} from "src/constants/graph";
import ModalLayout from "src/layouts/ModalLayout";
import { KeyStringVal } from "src/types/general";

const Cypher = ({
  type,
  queryString,
  startTime,
  endTime,
  messageHistory,
  setMessageHistory,
  messageIndex,
  optionIndex,
  option,
}: {
  type: string;
  queryString: string;
  startTime: number;
  endTime: number;
  messageHistory: any;
  setMessageHistory: (value: any) => void;
  messageIndex: number;
  optionIndex: number;
  option: any;
}) => {
  const [showCypher, setShowCypher] = useState<boolean>(false);
  const [match, setMatch] = useState<KeyStringVal>(initialMatch);
  const [conditions, setConditions] = useState<KeyStringVal[]>([]);

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
    cypherReturnTypes.length === 3
      ? "uno/*"
      : `${cypherReturnTypes.map((returnType) => `uno/${returnType}`)}`
  })`;
  const limitString = ` LIMIT 150`;

  const handleOnClose = () => {
    setShowCypher(false);
  };

  const handleCypherSearch = () => {
    const updatedQueryString = `${matchString}${whereString}${returnString}${limitString}`;
    if (type === "raccoon")
      setMessageHistory(
        messageHistory.map((curMessage: any, curMessageIdx: number) => {
          if (messageIndex === curMessageIdx)
            return {
              ...curMessage,
              response: curMessage.response.map(
                (curOption: any, curOptionIdx: number) => {
                  if (
                    messageIndex === curMessageIdx &&
                    optionIndex === curOptionIdx
                  ) {
                    const curOptionID = curOption.message.id.split("+");
                    return {
                      ...curOption,
                      message: {
                        ...curOption.message,
                        id: `Graph+Node+${curOptionID[2]}+${updatedQueryString}`,
                      },
                    };
                  }
                  return option;
                }
              ),
            };
          return curMessage;
        })
      );
    else if (type === "unorderly")
      setMessageHistory(
        messageHistory.map((curMessage: any, curMessageIdx: number) => {
          if (messageIndex === curMessageIdx)
            return {
              ...curMessage,
              response: curMessage.response.map(
                (curOption: any, curOptionIdx: number) => {
                  if (
                    curOption.is_primary &&
                    messageIndex === curMessageIdx &&
                    optionIndex === curOptionIdx
                  )
                    return {
                      ...curOption,
                      message: {
                        ...curOption.message,
                        query: {
                          ...curOption.message.query,
                          query_string: updatedQueryString,
                        },
                      },
                    };
                  return option;
                }
              ),
            };
          return curMessage;
        })
      );
  };

  useEffect(() => {
    const returnIndex =
      queryString.indexOf("RETURN") !== -1
        ? queryString.indexOf("RETURN")
        : queryString.length;
    const whereIndex =
      queryString.indexOf("WHERE") !== -1
        ? queryString.indexOf("WHERE")
        : returnIndex !== -1
        ? returnIndex
        : queryString.length;
    const matchString = queryString
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
    const whereArr = queryString
      .slice(whereIndex, returnIndex)
      .replaceAll(" ", "")
      .replace("WHERE", "")
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
          condition.slice(operatorIndex, propertyValueIndex).replace('"', "") ||
          "";
        const propertyValue =
          condition
            .slice(propertyValueIndex)
            .replaceAll('"', "")
            .replaceAll("“", "")
            .replaceAll("”", "")
            .replace("VARIABLE_VALUE", "") || "";
        return {
          match: match,
          propertyName: propertyName,
          propertyOperator: propertyOperator,
          propertyValue: propertyValue,
        };
      })
    );
  }, [queryString]);

  return (
    <>
      <button
        className="flex items-center gap-2 dark:text-checkbox text-xs focus:outline-none"
        onClick={() => setShowCypher(!showCypher)}
      >
        <FontAwesomeIcon icon={faPenToSquare} className="w-3 h-3" />
        <p>Edit Query</p>
      </button>
      <ModalLayout showModal={showCypher} onClose={handleOnClose}>
        <section className="grid gap-5 p-5 w-full h-full font-extralight overflow-auto scrollbar">
          <header className="flex items-center gap-2 border-b-1 dark:border-admin">
            <FontAwesomeIcon icon={faBars} />
            <h3 className="w-max text-base">Cypher UnoQL</h3>
          </header>
          <Disclosure>
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
                  <section className="grid gap-3 ml-10">
                    <article className="flex items-center gap-2 w-full">
                      <span>(</span>
                      <CypherMatchFilter
                        list={[
                          "type",
                          "id",
                          "resource_status",
                          "annotation",
                          "extension",
                        ]}
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
                          <article className="flex items-center gap-2">
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
                          <article className="flex items-center gap-2">
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
                  </section>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
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
                            className="flex items-start gap-2 ml-10"
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
          <button
            className="justify-self-center px-4 py-1 w-max dark:disabled:text-filter dark:disabled:bg-expand dark:bg-admin dark:hover:bg-admin/70 duration-100 focus:outline-none rounded-sm"
            onClick={() => {
              handleCypherSearch();
              handleOnClose();
            }}
          >
            Done
          </button>
        </section>
      </ModalLayout>
    </>
  );
};

export default Cypher;
