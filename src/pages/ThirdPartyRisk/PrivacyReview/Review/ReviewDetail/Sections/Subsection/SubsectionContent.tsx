import React from "react";
import CopyToClipboard from "src/components/General/CopyToClipboard";

const SubsectionContent = ({ subsection }: { subsection: any }) => {
  return (
    <section className="grid gap-5 p-4 text-sm dark:bg-black/60 rounded-md">
      <article className="flex gap-2 break-words">
        <article className="w-max">
          <CopyToClipboard copiedValue={subsection.content} />
        </article>
        <p className="grid gap-2 w-full">
          {subsection.content
            .split("\n")
            .map((phrase: string, index: number) => (
              <span
                key={index}
                className="flex flex-wrap items-center gap-1 w-full"
              >
                {phrase.split(" ").map((word, wordIndex) => (
                  <span
                    key={wordIndex}
                    className={`${
                      subsection.search_highlight?.matched_tokens?.includes(
                        word
                      )
                        ? "text-black bg-yellow-300"
                        : ""
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </span>
            ))}
        </p>
      </article>
    </section>
  );
};

export default SubsectionContent;
