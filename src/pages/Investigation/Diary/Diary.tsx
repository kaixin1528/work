/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { Fragment, useEffect, useState } from "react";
import NewEvidence from "./NewEvidence/NewEvidence";
import { EditDiary } from "../../../types/investigation";
import SidePanel from "./SidePanel/SidePanel";
import EvidenceList from "./EvidenceList/EvidenceList";
import Status from "./Status";
import Recommended from "./Recommended";
import {
  AddDistributionOption,
  GetDistributionOptions,
  GetSubscriptions,
  Subscribe,
  Unsubscribe,
} from "../../../services/general/general";
import { Subscription } from "../../../types/general";
import { handleSubscribe } from "../../../utils/summaries";
import { decodeJWT, parseURL } from "../../../utils/general";
import ReturnPage from "../../../components/Button/ReturnPage";
import PageLayout from "../../../layouts/PageLayout";
import Chat from "./Chat/Chat";
import { useGraphStore } from "src/stores/graph";
import { Popover, Transition } from "@headlessui/react";
import { useGeneralStore } from "src/stores/general";
import { validVariants } from "src/constants/general";
import {
  GetInvestigation,
  UpdateInvestigation,
} from "src/services/investigation/diary/diary";
import { CreateTemplate } from "src/services/investigation/templates";

const Diary = () => {
  const parsed = parseURL();
  const jwt = decodeJWT();

  const { env, error, setError } = useGeneralStore();
  const { setSelectedNode, setSelectedEdge } = useGraphStore();

  const [editDiaryDetails, setEditDiaryDetails] = useState<EditDiary>({
    diary_id: parsed.diary_id,
    name: "",
    description: "",
    status: "",
    archived: false,
    is_private: false,
  });
  const [editTitle, setEditTitle] = useState<boolean>(false);
  const [editDescription, setEditDescription] = useState<boolean>(false);
  const [savedTemplateTitle, setSavedTemplateTitle] = useState<string>("");

  const { data: diary } = GetInvestigation(env, parsed.diary_id);
  const editDiary = UpdateInvestigation(env);
  const { data: subscriptions } = GetSubscriptions(true);
  const subscribe = Subscribe();
  const unsubscribe = Unsubscribe();
  const { data: distributionOptions } = GetDistributionOptions();
  const addDistributionOption = AddDistributionOption();
  const saveAsTemplate = CreateTemplate(env, parsed.diary_id);

  const distributionOptionID =
    distributionOptions?.length > 0
      ? distributionOptions[0].distribution_option_id
      : "";
  const closedDiary = diary?.status === "CLOSED";

  const handleEditTitle = () => {
    if (
      editDiaryDetails.name.length > 60 ||
      editDiaryDetails.name.search(/[^a-z_\- 0-9]/) !== -1
    )
      setError({
        url: "/investigation/diary",
        message:
          "Label can only contain lowercase letters, numbers, hyphens, spaces, and underscores, and must be 60 characters or less",
      });
    else {
      setError({ url: "", message: "" });
      setEditTitle(false);
      editDiary.mutate({
        editDiary: {
          ...editDiaryDetails,
          name: editDiaryDetails.name,
        },
      });
    }
  };

  const handleEditDescription = () => {
    setEditDescription(false);
    editDiary.mutate({
      editDiary: {
        ...editDiaryDetails,
        description: editDiaryDetails.description,
      },
    });
  };

  useEffect(() => {
    setSelectedNode(undefined);
    setSelectedEdge(undefined);
  }, []);

  useEffect(() => {
    if (diary) {
      setEditDiaryDetails({
        ...editDiaryDetails,
        name: diary.name,
        description: diary.description,
        status: diary.status,
        is_private: diary.is_private,
      });
    }
  }, [diary]);

  return (
    <PageLayout>
      {diary && (
        <motion.main className="grid gap-5 content-start w-full dark:text-white dark:bg-main rounded-sm overflow-x-hidden overflow-y-auto scrollbar">
          <header className="flex items-center justify-between gap-5 py-3 px-4 w-full dark:bg-main">
            <article className="flex items-center gap-5 dark:bg-main">
              <ReturnPage />

              {/* diary title */}
              {editTitle ? (
                <section className="flex items-center gap-2">
                  <button onClick={handleEditTitle}>
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="text-no hover:text-no/60 duration-100"
                    />
                  </button>
                  <article className="relative grid gap-2">
                    <input
                      type="input"
                      spellCheck="false"
                      autoComplete="off"
                      value={editDiaryDetails.name}
                      onBlur={handleEditTitle}
                      onChange={(e) =>
                        setEditDiaryDetails({
                          ...editDiaryDetails,
                          name: e.target.value,
                        })
                      }
                      className="px-4 py-1 md:w-[30rem] xl:w-[50rem] text-xl dark:bg-filter/30 focus:outline-none"
                    />
                    {error.url.includes("/investigation/diary") &&
                      error.message !== "" && (
                        <motion.article
                          variants={validVariants}
                          initial="hidden"
                          animate={error.message !== "" ? "visible" : "hidden"}
                          className="absolute top-10 p-2 mt-2 break-words text-xs text-left dark:bg-inner border dark:border-error rounded-sm"
                        >
                          <p>{error.message}</p>
                        </motion.article>
                      )}
                  </article>
                </section>
              ) : (
                <button
                  disabled={closedDiary}
                  className="p-1 w-full break-all text-xl dark:text-checkbox dark:disabled:hover:bg-transparent dark:hover:bg-filter/30 duration-100 rounded-sm"
                  onClick={() => {
                    setEditTitle(true);
                    setEditDiaryDetails({
                      ...editDiaryDetails,
                      name: diary.name,
                    });
                  }}
                >
                  {diary.name === "" ? "No title" : diary.name}
                </button>
              )}
            </article>

            {/* private status */}
            <Status editDiaryDetails={editDiaryDetails} />
          </header>

          {/* background image section */}
          <section
            style={{
              backgroundImage: `url(${diary.image_url})`,
            }}
            className="grid place-content-center mx-4 h-96 bg-no-repeat bg-cover bg-center grayscale"
          ></section>

          {/* main diary section */}
          <section className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 content-start items-start gap-12 pt-2 pb-6 mx-4 text-sm z-10">
            {/* side panel */}
            <SidePanel diary={diary} />

            <section className="col-span-4 lg:col-span-4 grid gap-10">
              {!closedDiary && (
                <header className="flex items-center justify-between gap-10">
                  {subscriptions ? (
                    !subscriptions?.some(
                      (subscription: Subscription) =>
                        subscription.artifact_category === diary.diary_id
                    ) ? (
                      <button
                        className="flex items-center gap-2"
                        onClick={() =>
                          handleSubscribe(
                            distributionOptionID,
                            "daily",
                            addDistributionOption,
                            subscribe,
                            jwt,
                            "Diaries",
                            String(parsed.diary_id),
                            diary.name
                          )
                        }
                      >
                        <img
                          src="/general/subscribe.svg"
                          alt="subscribe"
                          className="w-4 h-4"
                        />
                        <p>Subscribe</p>
                      </button>
                    ) : (
                      <button
                        className="flex items-center gap-2"
                        onClick={() =>
                          unsubscribe.mutate({
                            artifactType: "Diaries",
                            artifactCategory: String(parsed.diary_id),
                            artifactName: diary?.name,
                            frequency: "daily",
                          })
                        }
                      >
                        <img
                          src="/general/true.svg"
                          alt="check"
                          className="w-4 h-4"
                        />
                        <p>Subscribed</p>
                      </button>
                    )
                  ) : null}
                  <Popover className="relative">
                    {({ open }) => (
                      <>
                        {saveAsTemplate.status === "success" ? (
                          <article className="flex items-center gap-2">
                            <FontAwesomeIcon
                              icon={faCheck}
                              className="w-4 h-4 text-no"
                            />
                            <p>saved as template</p>
                          </article>
                        ) : (
                          <Popover.Button className="px-4 py-1 gradient-button focus:outline-none rounded-sm">
                            Save as Template
                          </Popover.Button>
                        )}
                        <Transition
                          as={Fragment}
                          show={open && saveAsTemplate.status !== "success"}
                          enter="transition ease-out duration-100"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                          afterLeave={() => setSavedTemplateTitle("")}
                        >
                          <Popover.Panel className="absolute mt-3 right-0 z-10">
                            <section className="flex items-center gap-2 px-4 py-2 text-xs dark:bg-filter/60">
                              <input
                                type="input"
                                placeholder="Name your template"
                                value={savedTemplateTitle}
                                onChange={(e) =>
                                  setSavedTemplateTitle(e.target.value)
                                }
                                className="px-2 py-1 pr-5 w-60 dark:bg-search focus:outline-none"
                              />
                              <button
                                disabled={savedTemplateTitle === ""}
                                className="disabled:text-filter hover:text-signin duration-100"
                              >
                                <FontAwesomeIcon
                                  icon={faCheck}
                                  onClick={() =>
                                    saveAsTemplate.mutate({
                                      diary: {
                                        name: savedTemplateTitle,
                                        description: "",
                                        image_url: diary.image_url,
                                        is_private: true,
                                        priority: diary.priority,
                                      },
                                    })
                                  }
                                />
                              </button>
                            </section>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>
                </header>
              )}

              {/* diary description */}
              {editDescription ? (
                <section className="flex items-center gap-2">
                  <button onClick={handleEditDescription}>
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="text-no hover:text-no/60 duration-100"
                    />
                  </button>
                  <textarea
                    spellCheck="false"
                    autoComplete="off"
                    value={editDiaryDetails.description}
                    onBlur={handleEditDescription}
                    onChange={(e) =>
                      setEditDiaryDetails({
                        ...editDiaryDetails,
                        description: e.target.value,
                      })
                    }
                    className="w-full max-h-60 text-sm dark:bg-filter/30 focus:outline-none resize-none border-none focus:ring-0"
                  />
                </section>
              ) : (
                <button
                  disabled={closedDiary}
                  className="p-2 w-full leading-6 text-left text-sm dark:disabled:hover:bg-transparent dark:hover:bg-filter/30 duration-100 rounded-sm"
                  onClick={() => {
                    setEditDescription(true);
                    setEditDiaryDetails({
                      ...editDiaryDetails,
                      description: diary.description,
                    });
                  }}
                >
                  {diary.description === ""
                    ? "No description"
                    : diary.description}
                </button>
              )}
              {!closedDiary && <Chat />}
              <EvidenceList diary={diary} />
              {!closedDiary && (
                <>
                  <NewEvidence />
                  <Recommended />
                </>
              )}
            </section>
          </section>
        </motion.main>
      )}
    </PageLayout>
  );
};

export default Diary;
