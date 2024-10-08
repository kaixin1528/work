import {
  faXmark,
  faCheck,
  faArrowRightLong,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { MutableRefObject } from "react";
import { KeyStringVal } from "src/types/general";

const ConnectionDetails = ({
  testRef,
  failed,
  passed,
}: {
  testRef: MutableRefObject<HTMLElement>;
  failed: KeyStringVal;
  passed: KeyStringVal;
}) => {
  return (
    <section
      ref={testRef}
      className="grid gap-10 p-4 px-20 w-full max-h-96 dark:text-checkbox dark:bg-tooltip/50 overflow-auto scrollbar"
    >
      {Object.keys(failed)?.length > 0 && (
        <article className="grid content-start gap-2 mx-auto">
          <header className="flex items-center gap-2">
            <FontAwesomeIcon icon={faXmark} className="text-reset" />
            <h4 className="dark:text-checkbox">Tests failed</h4>
          </header>
          <ul className="grid content-start gap-3 list-decimal dark:text-reset">
            {Object.entries(failed).map((keyVal: [string, unknown]) => (
              <li key={keyVal[0]} className="">
                <article className="flex items-center gap-2">
                  <h4>{keyVal[0]}</h4>
                  <FontAwesomeIcon
                    icon={faArrowRightLong}
                    className="dark:text-white"
                  />
                  <p>{(keyVal[1] as string[])[1]}</p>
                </article>
                <p className="px-2 py-1 mt-1 w-max text-xs dark:text-white dark:bg-reset/10 border dark:border-reset rounded-sm">
                  {(keyVal[1] as string[])[0]}
                </p>
              </li>
            ))}
          </ul>
        </article>
      )}
      {Object.keys(passed)?.length > 0 && (
        <article className="grid content-start gap-2 mx-auto">
          <header className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCheck} className="text-contact" />
            <h4 className="dark:text-checkbox">Tests passed</h4>
          </header>
          <ul className="grid content-start items-start gap-3 list-decimal dark:text-contact">
            {Object.entries(passed).map((keyVal: [string, unknown]) => (
              <li key={keyVal[0]}>
                <article className="flex items-center gap-2">
                  <h4>{keyVal[0]}</h4>
                  <FontAwesomeIcon
                    icon={faArrowRightLong}
                    className="dark:text-white"
                  />
                  <p>{(keyVal[1] as string[])[0]}</p>
                </article>
              </li>
            ))}
          </ul>
        </article>
      )}
    </section>
  );
};

export default ConnectionDetails;
