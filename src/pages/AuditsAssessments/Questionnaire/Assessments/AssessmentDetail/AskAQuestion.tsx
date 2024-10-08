import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { KeyStringVal } from "src/types/general";

const AskAQuestion = ({
  inputs,
  setInputs,
  query,
  setQuery,
}: {
  inputs: any;
  setInputs: any;
  query: string;
  setQuery: (query: string) => void;
}) => {
  const handleManuallyEnterQuestion = () => {
    if (
      !inputs.drafts.some(
        (draft: KeyStringVal) => draft.draft_question_list_id === "1"
      )
    )
      setInputs({
        drafts: [
          ...inputs.drafts,
          {
            draft_question_list_id: "1",
            draft_document_name: "Manually Entered",
            questions: [query],
          },
        ],
      });
    else
      setInputs({
        drafts: inputs.drafts.map((draft: KeyStringVal) => {
          if (draft.draft_question_list_id === "1")
            return { ...draft, questions: [...draft.questions, query] };
          else return draft;
        }),
      });
    setQuery("");
  };

  return (
    <article className="grid content-start gap-5 text-center text-xl">
      <h4>Ask a question</h4>
      <article className="flex items-center gap-2">
        <textarea
          autoComplete="off"
          spellCheck="false"
          placeholder="Are devices required to be encrypted?"
          value={query}
          onKeyUpCapture={(e) => {
            if (e.key === "Enter" && query !== "")
              handleManuallyEnterQuestion();
          }}
          onChange={(e) => setQuery(e.target.value)}
          className="p-4 pr-12 w-[22rem] h-full text-sm bg-gradient-to-b dark:bg-main border-t border-b dark:border-know/60 know focus:outline-none focus:ring-0 resize-none overflow-auto scrollbar"
        />
      </article>
      <button
        disabled={query === ""}
        className="flex items-center gap-2 px-4 mx-auto dark:disabled:text-signin/30 dark:text-signin dark:hover:text-signin/60 duration-100"
        onClick={handleManuallyEnterQuestion}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </article>
  );
};

export default AskAQuestion;
