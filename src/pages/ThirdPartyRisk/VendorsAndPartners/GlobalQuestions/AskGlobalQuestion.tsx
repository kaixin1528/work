import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { AddGlobalQuestion } from "src/services/third-party-risk/vendors-and-partners/global-questions";

const AskGlobalQuestion = () => {
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  const addQuestion = AddGlobalQuestion();

  const handleManuallyEnterQuestion = () => {
    addQuestion.mutate({ question, response });
    setQuestion("");
    setResponse("");
  };

  return (
    <article className="grid content-start gap-5 text-center text-xl">
      <h4>Add Response</h4>
      <article className="flex items-center gap-2">
        <textarea
          autoComplete="off"
          spellCheck="false"
          placeholder="Enter question"
          value={question}
          onKeyUpCapture={(e) => {
            if (e.key === "Enter" && question !== "")
              handleManuallyEnterQuestion();
          }}
          onChange={(e) => setQuestion(e.target.value)}
          className="p-4 pr-12 w-[15rem] h-full text-sm bg-gradient-to-b dark:bg-main border-t border-b dark:border-know/60 know focus:outline-none focus:ring-0 resize-none overflow-auto scrollbar"
        />
        <textarea
          autoComplete="off"
          spellCheck="false"
          placeholder="Enter response"
          value={response}
          onKeyUpCapture={(e) => {
            if (e.key === "Enter" && response !== "")
              handleManuallyEnterQuestion();
          }}
          onChange={(e) => setResponse(e.target.value)}
          className="p-4 pr-12 w-[15rem] h-full text-sm bg-gradient-to-b dark:bg-main border-t border-b dark:border-know/60 know focus:outline-none focus:ring-0 resize-none overflow-auto scrollbar"
        />
      </article>
      <button
        disabled={question === ""}
        className="flex items-center gap-2 px-4 mx-auto dark:disabled:text-signin/30 dark:text-signin dark:hover:text-signin/60 duration-100"
        onClick={handleManuallyEnterQuestion}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </article>
  );
};

export default AskGlobalQuestion;
