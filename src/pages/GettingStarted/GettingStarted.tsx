/* eslint-disable react-hooks/exhaustive-deps */
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  gettingStartedPointers,
  pointerVariants,
  showVariants,
} from "src/constants/general";
import PageLayout from "src/layouts/PageLayout";
import ImportantAlerts from "./ImportantAlerts";
import KeyInvestigations from "./KeyInvestigations";
import KeySummaryFindings from "./KeySummaryFindings/KeySummaryFindings";
import NeedsAttention from "./NeedsAttention";
import Contrafactuals from "./Contrafactuals";
import ImportantChanges from "./ImportantChanges";
import Chat from "./Chat";
import { GetChatResponse } from "src/services/getting-started";
import { useGeneralStore } from "src/stores/general";
import { decodeJWT } from "src/utils/general";

const GettingStarted = () => {
  const jwt = decodeJWT();

  const { env } = useGeneralStore();

  const [selectedAction, setSelectedAction] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [messageHistory, setMessageHistory] = useState<any>([]);

  const getChatResponse = GetChatResponse(env);

  useEffect(() => {
    sessionStorage.page = "Getting Started";
  }, []);

  const handleSelectAction = (action: string) => setSelectedAction(action);

  const handleEnter = () => {
    if (text !== "") {
      getChatResponse.mutate({
        queryString: text,
      });
      setMessageHistory([{ author: jwt?.name, message: text }]);
      setText("");
      handleSelectAction("chat");
    }
  };

  return (
    <PageLayout>
      <motion.main
        variants={showVariants}
        initial="hidden"
        animate="visible"
        className="relative flex flex-row flex-grow font-extralight dark:text-white bg-gradient-to-b dark:from-main dark:to-starter overflow-hidden"
      >
        {selectedAction !== "" && (
          <motion.section
            variants={pointerVariants}
            initial="hidden"
            animate={selectedAction !== "" ? "visible" : "hidden"}
            className="absolute top-10 flex flex-col flex-grow content-start gap-10 px-10 pb-10 w-full h-full overflow-auto scrollbar z-20"
          >
            {selectedAction === "alerts" && <ImportantAlerts />}
            {selectedAction === "investigations" && <KeyInvestigations />}
            {selectedAction === "findings" && <KeySummaryFindings />}
            {selectedAction === "changes" && <ImportantChanges />}
            {selectedAction === "attention" && <NeedsAttention />}
            {selectedAction === "contrafactuals" && <Contrafactuals />}
          </motion.section>
        )}
        <section className="getting-started-circle">
          <ul className="circular-l">
            {gettingStartedPointers.slice(0, 3).map((pointer) => {
              return (
                <button disabled key={pointer.name}>
                  <article
                    className={`group relative flex justify-center items-center gap-2 p-3 w-12 h-12 ${
                      selectedAction !== ""
                        ? "-translate-x-52 opacity-0 duration-[1500ms]"
                        : "-translate-x-0 duration-[1500ms]"
                    } cursor-pointer ${
                      true
                        ? "dark:bg-filter/30 cursor-not-allowed"
                        : "dark:bg-main hover:brightness-150 duration-100"
                    } dark:bg-main hover:brightness-150 duration-100 border dark:border-filter rounded-full`}
                  >
                    <p className="absolute left-16 hidden group-hover:block text-xs w-max">
                      {pointer.name}
                    </p>
                    <img
                      src={`/general/starters/${pointer.short}.svg`}
                      alt={pointer.short}
                      onClick={() => handleSelectAction(pointer.short)}
                    />
                  </article>
                </button>
              );
            })}
          </ul>
          {selectedAction === "chat" && (
            <Chat
              selectedAction={selectedAction}
              setSelectedAction={setSelectedAction}
              text={text}
              setText={setText}
              messageHistory={messageHistory}
              setMessageHistory={setMessageHistory}
              getChatResponse={getChatResponse}
            />
          )}
          <section
            className={`absolute top-1/4 lg:top-[3rem] xl:top-1/4 2xl:top-[14rem] left-1/2 -translate-x-1/2 ${
              selectedAction !== ""
                ? "-translate-y-20 opacity-0 duration-1000"
                : "opacity-1 duration-500"
            } grid place-self-center gap-16 text-sm text-center z-10`}
          >
            <article className="hidden relative place-self-center lg:flex items-center justify-center p-10 lg:p-20 2xl:p-52 border dark:border-filter rounded-full">
              <img
                src="/general/logos/uno.svg"
                alt="uno-logo"
                className="w-32 h-32"
              />
              <img
                src="/general/starters/uno-ai.svg"
                alt="chat"
                className="absolute -bottom-16 w-36 h-36"
              />
            </article>
            <input
              type="input"
              value={text}
              placeholder="Agent Unorderly is here to assist you!"
              onChange={(e) => setText(e.target.value)}
              onKeyUpCapture={(e) => {
                if (e.key === "Enter") handleEnter();
              }}
              className="p-4 pr-12 mt-5 w-full h-16 text-center bg-transparent border-t border-b dark:border-know/60 know focus:outline-none"
            />
            <button
              onClick={() => handleSelectAction("chat")}
              className="flex items-center justify-center p-3 mt-5 xl:mt-0 mx-auto dark:bg-main hover:brightness-150 duration-100 border dark:border-filter rounded-full"
            >
              <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5" />
            </button>
          </section>
          <ul className="circular-r">
            {gettingStartedPointers.slice(3).map((pointer) => {
              return (
                <button key={pointer.name} disabled>
                  <article
                    className={`group relative flex justify-center items-center gap-2 p-3 w-12 h-12 ${
                      selectedAction !== ""
                        ? "translate-x-52 opacity-0 duration-[1500ms]"
                        : "translate-x-0 duration-[1500ms]"
                    } cursor-pointer ${
                      true
                        ? "dark:bg-filter/30 cursor-not-allowed"
                        : "dark:bg-main hover:brightness-150 duration-100"
                    } border dark:border-filter rounded-full`}
                  >
                    <img
                      src={`/general/starters/${pointer.short}.svg`}
                      alt={pointer.short}
                      onClick={() => handleSelectAction(pointer.short)}
                    />
                    <p className="absolute right-16 hidden group-hover:block text-xs w-max">
                      {pointer.name}
                    </p>
                  </article>
                </button>
              );
            })}
          </ul>
        </section>
        <img
          src="/general/starters/gears.svg"
          alt="gears"
          className="absolute left-5 bottom-5 w-60 h-60"
        />
        <img
          src="/general/starters/stripes.svg"
          alt="stripes"
          className="absolute right-5 bottom-5 w-60 h-60"
        />
      </motion.main>
    </PageLayout>
  );
};

export default GettingStarted;
