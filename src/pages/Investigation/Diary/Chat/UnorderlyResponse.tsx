/* eslint-disable react-hooks/exhaustive-deps */
import {
  faCheck,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
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
import Cypher from "./Cypher";
import TemporalDatepicker from "src/components/Datepicker/TemporalDatepicker";
import { motion } from "framer-motion";
import { showVariants } from "src/constants/general";

const UnorderlyResponse = ({
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

  const { env } = useGeneralStore();

  const { data: snapshotAvailable } = GetSnapshotsAvailable(env, "all", "main");

  const queryDetail = option.message.query;
  const queryString = queryDetail.query_string;

  const [feedback, setFeedback] = useState<string>("");
  const [selectedQueries, setSelectedQueries] = useState<string[]>([]);
  const [temporalStartDate, setTemporalStartDate] = useState<Date>(new Date());
  const [temporalEndDate, setTemporalEndDate] = useState<Date>(new Date());

  const sendUnorderlyFeedback = SendUnorderlyFeedback(env);
  const autoGenerateTitle = AutoGenerateTitle(env);
  const addAsEvidence = AddAsEvidence(env);
  const addNote = AddNote(env);

  const startTime = convertToMicrosec(temporalStartDate);
  const endTime = convertToMicrosec(temporalEndDate);

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
          query_start_time: startTime,
          query_end_time: endTime,
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

  const handleApplyTime = () => {
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
                        query_start_time: startTime,
                        query_end_time: endTime,
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
    if (snapshotAvailable) {
      setTemporalStartDate(convertToDate(snapshotAvailable.latest_snapshot));
      setTemporalEndDate(convertToDate(snapshotAvailable.latest_snapshot));
    }
  }, [snapshotAvailable]);

  return (
    <motion.li variants={showVariants} key={optionIndex} className="grid gap-2">
      {queryDetail?.title && (
        <h4 className="py-2 px-4 w-max dark:text-black dark:bg-checkbox rounded-sm">
          {queryDetail.title}
        </h4>
      )}
      <header className="flex items-center gap-10">
        <article className="flex items-center gap-3">
          <TemporalDatepicker
            temporalStartDate={temporalStartDate}
            setTemporalStartDate={setTemporalStartDate}
            temporalEndDate={temporalEndDate}
            setTemporalEndDate={setTemporalEndDate}
          />
          <button
            disabled={startTime === endTime}
            onClick={handleApplyTime}
            className="p-2 text-xs dark:disabled:bg-filter/10 dark:disabled:border-filter dark:bg-admin/10 dark:hover:bg-admin/30 duration-100 border dark:border-admin rounded-sm"
          >
            Apply Time Range
          </button>
        </article>
        <Cypher
          type="unorderly"
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
                  handleAddAsEvidence(
                    queryDetail,
                    title,
                    queryDetail?.note || ""
                  ),
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

export default UnorderlyResponse;
