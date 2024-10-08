/* eslint-disable no-restricted-globals */
import {
  faCheck,
  faLockOpen,
  faLock,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { Fragment, useState } from "react";
import { images } from "../../constants/investigation";
import { DiaryType, NewDiary } from "../../types/investigation";
import { decodeJWT, parseURL } from "../../utils/general";
import { queryClient } from "src/App";
import { useGeneralStore } from "src/stores/general";
import { CreateInvestigation } from "src/services/investigation/diary/diary";
import {
  AddAsEvidence,
  AutoGenerateTitle,
} from "src/services/investigation/diary/evidence/evidence";
import { GetInvestigations } from "src/services/investigation/investigation";

const AddToInvestigation = ({
  evidenceType,
  graphSearch,
  graphSearchString,
  title,
  startTime,
  endTime,
  showRight,
}: {
  evidenceType: string;
  graphSearch: boolean;
  graphSearchString: string;
  title?: string;
  startTime?: number;
  endTime?: number;
  showRight?: boolean;
}) => {
  const parsed = parseURL();
  const jwt = decodeJWT();

  const { env, error } = useGeneralStore();

  const [diaryQuery, setDiaryQuery] = useState<string>("");
  const [addedDiaryID, setAddedDiaryID] = useState<string>("");
  const [newDiary, setNewDiary] = useState<NewDiary>({
    name: "",
    description: "",
    is_private: false,
    image_url: images[Math.floor(Math.random() * images.length)],
  });

  const { data: diaries } = GetInvestigations(env);
  const createDiary = CreateInvestigation(env);
  const addAsEvidence = AddAsEvidence(env);
  const autoGenerateTitle = AutoGenerateTitle(env);
  const filteredDiaries = diaries?.filter(
    (diary: DiaryType) =>
      diary.status === "OPEN" &&
      diary.name
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(diaryQuery.toLowerCase().replace(/\s+/g, ""))
  );

  const handleAddedDiary = (diaryID: string) => {
    if (true) {
      setAddedDiaryID(diaryID);
      setTimeout(() => {
        setAddedDiaryID("");
        setDiaryQuery("");
      }, 5000);
    }
  };

  const handleAddAsEvidence = (diaryID: string) => {
    if (error.message === "") {
      if (evidenceType.includes("ALERT"))
        addAsEvidence.mutate({
          body: {
            graph_artifact_id: parsed.graph_artifact_id,
            event_cluster_id: parsed.event_cluster_id,
            diary_id: diaryID,
            author: jwt?.name,
            title: title,
            evidence_type: evidenceType,
          },
        });
      else
        autoGenerateTitle.mutate(
          {
            queryType: evidenceType.includes("MAIN")
              ? "main"
              : evidenceType.includes("FIREWALL")
              ? "firewall"
              : "cpm",
            searchString: graphSearchString.trim(),
          },
          {
            onSuccess: (title) => {
              addAsEvidence.mutate({
                body: {
                  query_string: graphSearchString.trim(),
                  results: evidenceType.includes("MAIN")
                    ? ""
                    : {
                        cloud: parsed.integration,
                      },
                  diary_id: diaryID,
                  author: jwt?.name,
                  query_start_time: startTime,
                  query_end_time: endTime,
                  title: title || "",
                  evidence_type: evidenceType,
                },
              });
            },
          }
        );
    }
  };

  return (
    <Popover className="relative text-left">
      <Popover.Button
        disabled={!evidenceType.includes("ALERT") && !graphSearch}
        className={`group relative p-2 dark:disabled:bg-filter ${
          evidenceType.includes("ALERT")
            ? "dark:bg-checkbox dark:hover:bg-checkbox/60"
            : "dark:bg-no dark:hover:bg-no/60"
        } duration-100 focus:outline-none rounded-full`}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
        >
          <path
            d="M13.29 4H13V10H19V9.70999C19 9.44999 18.85 9.10001 18.67 8.92001L14.08 4.33002C13.9 4.15002 13.54 4 13.29 4ZM11.5 4H2.12C1.5 4 1 4.5 1 5.12V26.87C1 27.49 1.5 27.99 2.12 27.99H17.88C18.5 27.99 19 27.49 19 26.87V25.86C16.36 24.7 14.5 22.06 14.5 19C14.5 15.94 16.36 13.3 19 12.14V11.5H12.62C12 11.5 11.5 10.99 11.5 10.38V4Z"
            fill={evidenceType.includes("ALERT") ? "black" : "white"}
          />
          <path
            d="M31 26.19C31 26.36 30.9 26.6 30.78 26.72L29.72 27.78C29.6 27.9 29.36 28 29.19 28C29.02 28 28.78 27.9 28.66 27.78L25.03 24.15C24.14 24.68 23.11 25 22 25C18.69 25 16 22.31 16 19C16 15.69 18.69 13 22 13C25.31 13 28 15.69 28 19C28 19.9 27.62 21.26 27.15 22.03L30.78 25.66C30.9 25.78 31 26.02 31 26.19ZM25 19C25 17.34 23.66 16 22 16C20.34 16 19 17.34 19 19C19 20.66 20.34 22 22 22C23.66 22 25 20.66 25 19Z"
            fill={evidenceType.includes("ALERT") ? "black" : "white"}
          />
        </svg>
        <span className="hidden group-hover:block absolute top-10 right-0 p-2 w-max text-xs dark:bg-filter black-shadow rounded-sm z-20">
          Add query to investigation
        </span>
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Popover.Panel
          className={`absolute ${
            showRight ? "left-0 " : "right-0"
          } grid mt-2 w-[25rem] md:w-[40rem] text-left text-xs origin-top-right focus:outline-none dark:text-white dark:bg-account rounded-sm z-50`}
        >
          {({ close }) => (
            <section className="relative grid gap-3 p-4 overflow-auto scrollbar">
              <button onClick={() => close()}>
                <FontAwesomeIcon
                  icon={faXmark}
                  className="absolute top-5 right-5 text-sm dark:text-filter dark:hover:text-filter/60 duration-100"
                />
              </button>
              <h5 className="text-sm dark:text-checkbox">
                Add to an ongoing investigation
              </h5>
              <input
                type="input"
                spellCheck="false"
                autoComplete="off"
                placeholder="Search any diary..."
                value={diaryQuery}
                onChange={(e) => setDiaryQuery(e.target.value)}
                className="px-4 py-1 w-full text-sm placeholder:text-filter dark:bg-card focus:outline-none"
              />

              {/* list of filtered diaries */}
              <ul className="grid max-h-[18rem] overflow-auto scrollbar">
                {filteredDiaries?.map((diary: DiaryType) => {
                  return (
                    <li
                      key={diary.diary_id}
                      className="flex items-center gap-5 p-2 cursor-pointer dark:hover:bg-expand/60 duration-100 border-b-1 dark:border-checkbox rounded-sm"
                      onClick={() => {
                        handleAddedDiary(diary.diary_id);
                        handleAddAsEvidence(diary.diary_id);
                      }}
                    >
                      {/* background image section */}
                      <span
                        style={{
                          backgroundImage: `url(${diary.image_url})`,
                        }}
                        className="w-10 h-10 bg-no-repeat bg-cover bg-center rounded-full"
                      ></span>
                      <h4 className="w-[20rem] truncate text-ellipsis">
                        {diary.name || "No title"}
                      </h4>

                      {/* evidence added message */}
                      {addedDiaryID === diary.diary_id && (
                        <motion.article
                          initial={{ y: 3, opacity: 0 }}
                          animate={{
                            y: 0,
                            opacity: 1,
                            transition: { duration: 0.3 },
                          }}
                          className="flex items-center gap-2"
                        >
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="w-3 h-3 dark:text-contact"
                          />
                          Evidence added
                        </motion.article>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* create new diary and save query as evidence */}
              <section className="grid gap-3 mt-3">
                <h4 className="text-sm dark:text-checkbox">
                  Add to a new investigation
                </h4>
                <article className="flex items-center gap-5">
                  <input
                    type="input"
                    spellCheck="false"
                    autoComplete="off"
                    placeholder="Name your diary"
                    value={newDiary.name}
                    onChange={(e) =>
                      setNewDiary({
                        ...newDiary,
                        name: e.target.value,
                      })
                    }
                    className="px-4 py-1 w-full placeholder:text-sm text-sm placeholder:text-filter dark:bg-card focus:outline-none"
                  />

                  {/* private status */}
                  <article className="flex items-center gap-5 text-xs">
                    <button
                      className={`flex items-center px-2 py-1 gap-2 ${
                        !newDiary.is_private &&
                        "dark:bg-admin/20 border dark:border-admin"
                      }`}
                      onClick={() =>
                        setNewDiary({
                          ...newDiary,
                          is_private: false,
                        })
                      }
                    >
                      <FontAwesomeIcon
                        icon={faLockOpen}
                        className="dark:text-admin"
                      />
                      PUBLIC
                    </button>
                    <button
                      className={`flex items-center px-2 py-1 gap-2 ${
                        newDiary.is_private &&
                        "dark:bg-lock/20 border dark:border-lock"
                      }`}
                      onClick={() =>
                        setNewDiary({
                          ...newDiary,
                          is_private: true,
                        })
                      }
                    >
                      <FontAwesomeIcon
                        icon={faLock}
                        className="dark:text-lock"
                      />
                      PRIVATE
                    </button>
                  </article>
                  <button
                    disabled={newDiary.name === ""}
                    className={`px-4 py-1 dark:disabled:text-filter/70 dark:disabled:bg-filter/30 border dark:disabled:border-filter ${
                      addedDiaryID === "new diary"
                        ? "dark:bg-no/30 dark:border-contact dark:hover:border-contact/30"
                        : "dark:bg-signin/30 dark:border-signin dark:hover:border-signin/30"
                    } duraiton-100`}
                    onClick={() => {
                      createDiary.mutate(
                        {
                          newDiary: {
                            ...newDiary,
                            description: newDiary.description,
                          },
                        },
                        {
                          onSuccess: (data) => {
                            queryClient.invalidateQueries([
                              "get-investigations",
                            ]);
                            handleAddedDiary(data.diary_id);
                            handleAddAsEvidence(data.diary_id);
                          },
                        }
                      );
                    }}
                  >
                    {/* evidence added message */}
                    {addedDiaryID === "new diary" ? (
                      <motion.article
                        initial={{ y: 3, opacity: 0 }}
                        animate={{
                          y: 0,
                          opacity: 1,
                          transition: { duration: 0.3 },
                        }}
                        className="flex items-center gap-2"
                      >
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="w-3 h-3 dark:text-contact"
                        />
                        added
                      </motion.article>
                    ) : (
                      "Add"
                    )}
                  </button>
                </article>
              </section>
            </section>
          )}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default AddToInvestigation;
