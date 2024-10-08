import React from "react";
import ThirdPartyControlFilter from "src/components/Filter/ThirdPartyRisk/ThirdPartyControlFilter";
import { GetControlFilters } from "src/services/third-party-risk/vendor-assessment";

const ControlFilters = ({
  reviewID,
  controls,
  controlFilters,
  setControlFilters,
}: {
  reviewID: string;
  controls: any;
  controlFilters: any;
  setControlFilters: any;
}) => {
  const { data: filters } = GetControlFilters(reviewID);

  const handleClear = () =>
    setControlFilters({
      context: [],
      domain: [],
      sub_domain: [],
      level: [],
    });

  const handleReset = () => {
    handleClear();
    if (controls.data)
      controls.mutate({
        context: [],
        domain: [],
        sub_domain: [],
        level: [],
      });
  };

  return (
    <>
      {controlFilters && (
        <article className="grid gap-3 text-sm">
          <article className="flex items-center gap-5 divide-x dark:divide-checkbox">
            <button
              className="dark:hover:text-checkbox/60 duration-100"
              onClick={() =>
                setControlFilters({
                  context: filters.context || [],
                  domain: filters.domain || [],
                  sub_domain: filters.sub_domain || [],
                  level: filters.level || [],
                })
              }
            >
              Select All
            </button>
            <button
              className="pl-5 dark:hover:text-checkbox/60 duration-100"
              onClick={handleClear}
            >
              Deselect All
            </button>
          </article>
          <ThirdPartyControlFilter
            reviewID={reviewID}
            label="Context"
            keyName="context"
            inputs={controlFilters}
            setInputs={setControlFilters}
          />
          <ThirdPartyControlFilter
            reviewID={reviewID}
            label="Domain"
            keyName="domain"
            inputs={controlFilters}
            setInputs={setControlFilters}
          />
          <ThirdPartyControlFilter
            reviewID={reviewID}
            label="Sub Domain"
            keyName="sub_domain"
            inputs={controlFilters}
            setInputs={setControlFilters}
          />
          <ThirdPartyControlFilter
            reviewID={reviewID}
            label="Level"
            keyName="level"
            inputs={controlFilters}
            setInputs={setControlFilters}
          />
          <article className="flex items-center gap-5">
            <button
              className="px-3 py-1 red-gradient-button"
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              className="px-3 py-1 gradient-button"
              onClick={() =>
                controls.mutate({
                  context: controlFilters.context,
                  domain: controlFilters.domain,
                  subDomain: controlFilters.sub_domain,
                  level: controlFilters.level,
                })
              }
            >
              Apply
            </button>
          </article>
        </article>
      )}
    </>
  );
};

export default ControlFilters;
