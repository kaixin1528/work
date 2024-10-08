import { motion } from "framer-motion";
import React from "react";
import { showVariants } from "src/constants/general";

const InitialPrompt = ({
  messageHistory,
  selectedAction,
  setSelectedAction,
  query,
  setQuery,
  handleClickSendMessage,
}: {
  messageHistory: any;
  selectedAction: string;
  setSelectedAction: (selectedAction: string) => void;
  query: string;
  setQuery: (query: string) => void;
  handleClickSendMessage: any;
}) => {
  return (
    <article className="grid place-content-center gap-5 p-10">
      {/* <p className="p-2 text-center">
        Here to help you! What would you like to do?
      </p>
      <motion.article
        variants={actionVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-2"
      >
        {[
          "Search for something",
          "Generate a query",
          "Q&A",
          // "Ask Unorderly to complete a task",
        ].map((action) => {
          return (
            <motion.button
              variants={actionVariants}
              key={action}
              className="flex items-center gap-2 p-2 w-max text-left dark:text-panel dark:bg-checkbox dark:hover:bg-checkbox/70 duration-100 rounded-md"
              onClick={() => setSelectedAction(action)}
            >
              {action}
            </motion.button>
          );
        })}
      </motion.article> */}
      {/* {selectedAction !== "" && ( */}
      <motion.input
        variants={showVariants}
        initial="hidden"
        animate="visible"
        type="input"
        spellCheck="false"
        autoComplete="off"
        placeholder={
          selectedAction.includes("Search")
            ? "What keywords would you like to search for?"
            : selectedAction.includes("query")
            ? "Enter your query in natural language"
            : "What would you like to ask?"
        }
        value={query}
        onKeyUpCapture={(e) => {
          if (e.key === "Enter" && query !== "") handleClickSendMessage();
        }}
        onChange={(e) => setQuery(e.target.value)}
        className="p-4 pr-12 w-96 h-16 bg-gradient-to-b dark:bg-main border-t border-b dark:border-know/60 know focus:outline-none"
      />
      {/* )} */}
    </article>
  );
};

export default InitialPrompt;
