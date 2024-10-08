/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { GetControlFilters } from "src/services/third-party-risk/vendor-assessment";

const ThirdPartyControlFilter = ({
  reviewID,
  label,
  keyName,
  inputs,
  setInputs,
}: {
  reviewID: string;
  label?: string;
  keyName: string;
  inputs: any;
  setInputs: any;
}) => {
  const { data: controlFilters } = GetControlFilters(reviewID);

  const filteredList = controlFilters && controlFilters[keyName];

  return (
    <>
      {filteredList?.length > 0 && (
        <section className="flex flex-wrap items-center gap-x-10 gap-y-2">
          <h4 className="w-max font-medium dark:text-checkbox">{label}</h4>
          {filteredList?.map((value: string, index: number) => (
            <article key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={inputs[keyName].includes(value)}
                className="form-checkbox w-4 h-4 border-0 dark:focus:ring-0 dark:text-checkbox dark:focus:border-checkbox focus:ring dark:focus:ring-offset-0 dark:focus:ring-checkbox focus:ring-opacity-50"
                onChange={() => {
                  if (inputs[keyName].includes(value)) {
                    setInputs({
                      ...inputs,
                      [keyName]: inputs[keyName].filter(
                        (curValue: string) => curValue !== value
                      ),
                    });
                  } else
                    setInputs({
                      ...inputs,
                      [keyName]: [...inputs[keyName], value],
                    });
                }}
              />
              <span>{value}</span>
            </article>
          ))}
        </section>
      )}
    </>
  );
};

export default ThirdPartyControlFilter;
