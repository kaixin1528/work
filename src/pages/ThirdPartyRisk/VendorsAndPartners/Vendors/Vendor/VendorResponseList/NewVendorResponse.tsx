import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { AddVendorResponse } from "src/services/third-party-risk/vendors-and-partners/vendors";

const NewVendorResponse = ({ vendorID }: { vendorID: string }) => {
  const [addResponse, setAddResponse] = useState<boolean>(false);
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [newResponse, setNewResponse] = useState<string>("");

  const addNewResponse = AddVendorResponse(vendorID);

  const handleDiscard = () => {
    setAddResponse(false);
    setNewQuestion("");
    setNewResponse("");
  };

  return (
    <section>
      {addResponse ? (
        <section className="grid gap-2">
          <header className="flex items-center gap-1">
            <FontAwesomeIcon icon={faPlus} />
            New Response
          </header>
          <article className="flex items-start gap-2 w-full">
            Q:{" "}
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="px-4 py-1 pb-10 w-full dark:bg-black focus:outline-none resize-none overflow-auto scrollbar"
            />
          </article>
          <article className="flex items-start gap-2 w-full">
            A:{" "}
            <textarea
              value={newResponse}
              onChange={(e) => setNewResponse(e.target.value)}
              className="px-4 py-1 pb-10 w-full dark:bg-black focus:outline-none resize-none overflow-auto scrollbar"
            />
          </article>
          <article className="flex items-center justify-self-end gap-2">
            <button
              className="p-3 py-1 dark:bg-reset dark:hover:bg-reset/60 duration-100 rounded-md"
              onClick={handleDiscard}
            >
              Discard
            </button>
            {newQuestion && newResponse && (
              <button
                className="px-3 py-1 dark:bg-no dark:hover:bg-no/60 duration-100 rounded-md"
                onClick={() => {
                  addNewResponse.mutate({
                    question: newQuestion,
                    response: newResponse,
                  });
                  handleDiscard();
                }}
              >
                Save
              </button>
            )}
          </article>
        </section>
      ) : (
        <button
          className="flex items-center gap-1 px-4 py-1 dark:bg-filter dark:hover:bg-filter/30 duration-100 rounded-md"
          onClick={() => setAddResponse(true)}
        >
          <FontAwesomeIcon icon={faPlus} />
          New Response
        </button>
      )}
    </section>
  );
};

export default NewVendorResponse;
