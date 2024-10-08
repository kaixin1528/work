/* eslint-disable react-hooks/exhaustive-deps */
import {
  faCheck,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import SnapshotDatepicker from "src/components/Datepicker/SnapshotDatepicker";
import MainSearch from "../../EvidenceType/MainSearch";
import { queryClient } from "src/App";
import { SendUnorderlyFeedback } from "src/services/investigation/investigation";
import { useGeneralStore } from "src/stores/general";
import { GeneralEvidenceType } from "src/types/investigation";
import {
  parseURL,
  decodeJWT,
  convertToMicrosec,
  convertToDate,
} from "src/utils/general";
import { GetSnapshotsAvailable } from "src/services/graph/snapshots";
import {
  AddAsEvidence,
  AutoGenerateTitle,
} from "src/services/investigation/diary/evidence/evidence";
import { AddNote } from "src/services/investigation/diary/evidence/notes";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { queryStringColors, showVariants } from "src/constants/general";
import Cypher from "./Cypher";
import { motion } from "framer-motion";

const RaccoonResponse = ({
  messageHistory,
  setMessageHistory,
  messageIndex,
  optionIndex,
  option,
}: {
  messageHistory: any;
  setMessageHistory: (value: any) => void;
  messageIndex: number;
  optionIndex: number;
  option: any;
}) => {
  const parsed = parseURL();
  const jwt = decodeJWT();

  const optionID = option.message.id.split("+");
  const queryDetail = {
    title: "",
    query_string: optionID[3],
    query_start_time: Number(optionID[2]),
    query_end_time: Number(optionID[2]),
    evidence_type: "MAIN_GRAPH_SEARCH",
  };
  const queryString = queryDetail.query_string;
  const startTime = queryDetail.query_start_time;
  const endTime = queryDetail.query_end_time;

  const { env } = useGeneralStore();

  const [feedback, setFeedback] = useState<string>("");
  const [selectedQueries, setSelectedQueries] = useState<string[]>([]);
  const [snapshotTime, setSnapshotTime] = useState<Date | null>(
    convertToDate(startTime)
  );

  const sendUnorderlyFeedback = SendUnorderlyFeedback(env);
  const autoGenerateTitle = AutoGenerateTitle(env);
  const addAsEvidence = AddAsEvidence(env);
  const addNote = AddNote(env);
  const { data: snapshotAvailable } = GetSnapshotsAvailable(env, "all", "main");

  const handleSendUnorderlyFeedback = (feedback: boolean) => {
    setFeedback(feedback === true ? "like" : "dislike");
    sendUnorderlyFeedback.mutate({
      question: messageHistory.slice(-2)[0].message,
      queryString: queryDetail.query_string,
      queryTitle: queryDetail.title,
      startTime: startTime,
      endTime: endTime,
      feedback: feedback,
    });
  };

  const handleAddAsEvidence = (
    query: GeneralEvidenceType,
    title: string,
    note: string
  ) => {
    addAsEvidence.mutate(
      {
        body: {
          query_string: query.query_string,
          results: query.results,
          annotation_set: "{}",
          annotation: "",
          diary_id: parsed.diary_id,
          author: jwt?.name,
          query_start_time: query.query_start_time,
          query_end_time: query.query_end_time,
          title: title,
          evidence_type: query.evidence_type,
        },
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries([
            "get-all-diary-evidence",
            env,
            parsed.diary_id,
          ]);
          if (data && note !== "")
            addNote.mutate({
              evidenceID: data.evidence_id,
              note: {
                evidence_id: data.evidence_id,
                author_email: "editable",
                content: note,
              },
            });
        },
      }
    );
  };

  useEffect(() => {
    const snapshotTimeSinceEpoch = convertToMicrosec(snapshotTime);
    if (
      snapshotAvailable &&
      snapshotTimeSinceEpoch !== queryDetail.query_start_time
    ) {
      const queryTime =
        snapshotAvailable.latest_snapshot <= snapshotTimeSinceEpoch
          ? snapshotTimeSinceEpoch - 3.6e9
          : snapshotTimeSinceEpoch;
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
                        id: `Graph+Node+${queryTime}+${curOptionID[3]}`,
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
    }
  }, [snapshotTime, snapshotAvailable, optionIndex]);

  return (
    <motion.li variants={showVariants} key={optionIndex} className="grid gap-2">
      {queryDetail?.title && (
        <h4 className="py-2 px-4 w-max dark:text-black dark:bg-checkbox rounded-sm">
          {queryDetail.title}
        </h4>
      )}
      <header className="flex items-center gap-10">
        <SnapshotDatepicker
          snapshotTime={snapshotTime}
          setSnapshotTime={setSnapshotTime}
        />
        <Cypher
          type="raccoon"
          queryString={queryString}
          startTime={startTime}
          endTime={endTime}
          messageHistory={messageHistory}
          setMessageHistory={setMessageHistory}
          messageIndex={messageIndex}
          optionIndex={optionIndex}
          option={option}
        />
      </header>
      <section className="flex items-start gap-3">
        <button
          disabled={selectedQueries.includes(queryString)}
          className="dark:disabled:text-filter/30 dark:text-checkbox dark:hover:text-checkbox/60 duration-100"
          onClick={() => {
            setSelectedQueries([...selectedQueries, queryString]);
            autoGenerateTitle.mutate(
              {
                queryType: "main",
                searchString: queryString,
              },
              {
                onSuccess: (title) =>
                  handleAddAsEvidence(queryDetail, title, ""),
              }
            );
          }}
        >
          {selectedQueries.includes(queryString) ? (
            <FontAwesomeIcon icon={faCheck} className="dark:text-contact" />
          ) : (
            <p className="p-2 px-4 tracking-widest text-xs border dark:border-checkbox rounded-2xl">
              ADD
            </p>
          )}
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
