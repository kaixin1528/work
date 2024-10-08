/* eslint-disable react-hooks/exhaustive-deps */
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { SendUnorderlyFeedback } from "src/services/investigation/investigation";
import { useGeneralStore } from "src/stores/general";
import { convertToMicrosec } from "src/utils/general";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { queryStringColors, showVariants } from "src/constants/general";
import { motion } from "framer-motion";
import MainSearch from "src/pages/Investigation/EvidenceType/MainSearch";
import { useGraphStore } from "src/stores/graph";

const RaccoonResponse = ({
  messageHistory,
  setMessageHistory,
  optionIndex,
  option,
  setShowChatbot,
  setQuery,
}: {
  messageHistory: any;
  setMessageHistory: (value: any) => void;
  optionIndex: number;
  option: any;
  setShowChatbot: (showChatbot: boolean) => void;
  setQuery: (query: string) => void;
}) => {
  const { env } = useGeneralStore();
  const {
    navigationView,
    snapshotTime,
    temporalStartDate,
    temporalEndDate,
    setGraphSearchString,
    setGraphSearch,
    setGraphSearching,
  } = useGraphStore();

  const startTime =
    navigationView === "snapshots"
      ? convertToMicrosec(snapshotTime)
      : convertToMicrosec(temporalStartDate);
  const endTime =
    navigationView === "snapshots"
      ? convertToMicrosec(snapshotTime)
      : convertToMicrosec(temporalEndDate);

  const optionID = option.message.id.split("+");
  const queryDetail = {
    title: "",
    query_string: optionID[3],
    query_start_time: startTime,
    query_end_time: endTime,
    evidence_type: "MAIN_GRAPH_SEARCH",
  };

  const [feedback, setFeedback] = useState<string>("");

  const sendUnorderlyFeedback = SendUnorderlyFeedback(env);

  const handleSendUnorderlyFeedback = (feedback: boolean) => {
    setFeedback(feedback === true ? "like" : "dislike");
    sendUnorderlyFeedback.mutate({
      question: messageHistory.slice(-2)[0].message,
      queryString: queryDetail.query_string,
      queryTitle: queryDetail.title,
      startTime: queryDetail.query_start_time,
      endTime: queryDetail.query_end_time,
      feedback: feedback,
    });
  };

  const handleSearchQuery = () => {
    setGraphSearch(true);
    setGraphSearching(false);
    setGraphSearchString(queryDetail.query_string);
    setShowChatbot(false);
    setMessageHistory([]);
    setQuery("");
  };

  return (
    <motion.li variants={showVariants} key={optionIndex} className="grid gap-2">
      {queryDetail?.title && (
        <h4 className="py-2 px-4 w-max dark:text-black dark:bg-checkbox rounded-sm">
          {queryDetail.title}
        </h4>
      )}
      <section className="flex items-start gap-3">
        <button
          className="dark:disabled:text-filter/30 dark:text-checkbox dark:hover:text-checkbox/60 duration-100"
          onClick={handleSearchQuery}
        >
          <span className="p-2 px-4 tracking-widest text-xs border dark:border-checkbox rounded-2xl">
            Search
          </span>
        </button>
        <MainSearch evidence={queryDetail} showModal />
      </section>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex items-center gap-2 w-full text-left text-xs dark:text-checkbox focus:outline-none">
              <p>{open ? "Hide" : "Show"} context</p>
              <ChevronDownIcon
                className={`${open ? "rotate-180 transform" : ""} w-4 h-4`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="grid gap-5 p-4 text-xs bg-gradient-to-b dark:from-expand dark:to-expand/60">
              <section className="grid gap-5 break-all">
                {Object.entries(option.message.fragments).map(
                  (keyVal, index) => {
                    if (keyVal[0].toLowerCase().includes("customer"))
                      return null;

                    return (
                      <article key={keyVal[0]} className="grid gap-1">
                        <h4
                          className={`capitalize w-max ${
                            queryStringColors[(index % 10) + 1]
                          }`}
                        >
                          {keyVal[0].replaceAll("_", " ")}
                        </h4>
                        <ul className="grid px-6 list-disc">
                          {(keyVal[1] as string[]).map((fragment) => {
                            return (
                              <li key={fragment}>
                                {fragment
                                  .replaceAll("<mark>", "")
                                  .replaceAll("</mark>", "")}
                              </li>
                            );
                          })}
                        </ul>
                      </article>
                    );
                  }
                )}
              </section>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <section className="flex items-center gap-5 dark:text-checkbox">
        <button
          className={`${
            feedback === "like" ? "dark:text-no" : ""
          } dark:hover:text-no duration-100`}
        >
          <FontAwesomeIcon
            icon={faThumbsUp}
            onClick={() => handleSendUnorderlyFeedback(true)}
          />
        </button>
        <button
          className={`${
            feedback === "dislike" ? "dark:text-reset" : ""
          } dark:hover:text-reset duration-100 focus:text-reset`}
        >
          <FontAwesomeIcon
            icon={faThumbsDown}
            onClick={() => handleSendUnorderlyFeedback(false)}
          />
        </button>
      </section>
    </motion.li>
  );
};

export default RaccoonResponse;
