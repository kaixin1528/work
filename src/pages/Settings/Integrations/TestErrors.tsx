import React, { MutableRefObject } from "react";
import { KeyStringVal } from "src/types/general";

const TestErrors = ({
  testRef,
  errors,
}: {
  testRef: MutableRefObject<HTMLElement>;
  errors: KeyStringVal;
}) => {
  return (
    <section ref={testRef} className="grid gap-2 mx-auto dark:text-white">
      {Object.entries(errors).map((keyVal: [string, unknown]) => {
        return (
          <p
            key={keyVal[0]}
            className="p-2 mx-auto w-max text-xs text-left dark:bg-inner border dark:border-error rounded-sm"
          >
            {keyVal[0]} : {keyVal[1]}
          </p>
        );
      })}
    </section>
  );
};

export default TestErrors;
