import { showVariants, userColors } from "src/constants/general";
import { decodeJWT } from "src/utils/general";
import UnorderlyResponse from "./UnorderlyResponse";
import RaccoonResponse from "./RaccoonResponse";
import TextResponse from "./TextResponse";
import { Fragment, useState } from "react";
import { motion } from "framer-motion";

const Message = ({
  messageHistory,
  setMessageHistory,
  message,
  messageIndex,
}: {
  messageHistory: any;
  setMessageHistory: any;
  message: any;
  messageIndex: number;
}) => {
  const jwt = decodeJWT();

  const [selectedOption, setSelectedOption] = useState<number>(0);

  return (
    <li
      className={`flex items-start gap-3 w-full ${
        message.author === jwt?.name
          ? "flex-row-reverse justify-self-end"
          : "justify-self-start"
      }`}
    >
      {message.author === jwt?.name ? (
        <span
          className={`grid content-center w-8 h-8 capitalize text-center text-sm font-medium bg-gradient-to-b ${
            userColors[message.author[0].toLowerCase()]
          } shadow-sm dark:shadow-checkbox rounded-full`}
        >
          {message.author[0]}
        </span>
      ) : (
        <img
          src="/general/logos/uno-id.svg"
          alt="unoai logo"
          className="w-8 h-8"
        />
      )}
      {["pythia", "text"].includes(message.context) ? (
        <TextResponse message={message} />
      ) : ["unorderly", "raccoon_search"].includes(message.context) ? (
        <motion.ul
          variants={showVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-10 w-full"
        >
          {message.response
            .slice(0, selectedOption + 1)
            .map((option: any, optionIndex: number) => {
              return (
                <Fragment key={optionIndex}>
                  {message.context === "raccoon_search" ? (
                    <RaccoonResponse
                      key={optionIndex}
                      messageHistory={messageHistory}
                      setMessageHistory={setMessageHistory}
                      messageIndex={messageIndex}
                      optionIndex={optionIndex}
                      option={option}
                    />
                  ) : (
                    <UnorderlyResponse
                      messageHistory={messageHistory}
                      setMessageHistory={setMessageHistory}
                      messageIndex={messageIndex}
                      optionIndex={optionIndex}
                      option={option}
                    />
                  )}
                </Fragment>
              );
            })}
          {selectedOption < message.response.length - 1 && (
            <button
              className="p-2 w-max text-left dark:text-panel dark:bg-checkbox dark:hover:bg-checkbox/70 duration-100 rounded-md"
              onClick={() => setSelectedOption(selectedOption + 1)}
            >
              More suggestion?
            </button>
          )}
        </motion.ul>
      ) : null}
    </li>
  );
};

export default Message;
