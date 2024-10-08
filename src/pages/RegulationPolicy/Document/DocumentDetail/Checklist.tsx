import { useState } from "react";
import { GetFrameworkChecklistQA } from "src/services/regulation-policy/framework";
import { copyToClipboard } from "src/utils/graph";

const Checklist = ({ documentID }: { documentID: string }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const { data: questionnaire } = GetFrameworkChecklistQA(documentID);
  return (
    <section className="grid gap-3">
      <button
        className={`px-4 py-2 w-max ${
          copied
            ? "dark:bg-signin"
            : "dark:bg-filter dark:hover:bg-filter/30 duration-100"
        } rounded-md`}
        onClick={() => {
          setCopied(true);

          let copedText = "";
          questionnaire?.questionnaire?.forEach((question: string) => {
            copedText = `${copedText} \n• ${question}`;
          });
          copyToClipboard(copedText);
        }}
      >
        {copied ? "Copied" : "Copy"} list
      </button>
      <ul className="grid gap-2 px-4 list-disc">
        {questionnaire?.questionnaire?.map(
          (question: string, index: number) => {
            return <li key={index}>{question}</li>;
          }
        )}
      </ul>
    </section>
  );
};

export default Checklist;
