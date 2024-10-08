import React, { useState } from "react";
import { copyToClipboard } from "src/utils/graph";

const CopyToClipboard = ({ copiedValue }: { copiedValue: string }) => {
  const [copied, setCopied] = useState<boolean>(false);

  return (
    <article className="group w-max">
      <img
        src="/general/copy-to-clipboard.svg"
        alt="copy to clipboard"
        className={`relative w-5 h-5 cursor-pointer ${copied ? "clicked" : ""}`}
        onClick={() => {
          copyToClipboard(copiedValue);
          setCopied(true);
        }}
      />
      <article className="hidden group-hover:block relative z-50">
        <article className="absolute -top-[3.5rem] -left-5 flex items-center gap-2 px-3 py-1 w-max text-xs dark:text-white dark:bg-filter black-shadow rounded-sm">
          {copied ? "Copied!" : "Copy"}
        </article>
        <svg
          className="absolute left-1 -top-8 h-3 dark:text-filter"
          x="0px"
          y="0px"
          viewBox="0 0 255 255"
          xmlSpace="preserve"
        >
          <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
        </svg>
      </article>
    </article>
  );
};

export default CopyToClipboard;
