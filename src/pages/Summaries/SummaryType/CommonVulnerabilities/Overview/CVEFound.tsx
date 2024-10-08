import React from "react";
import { GetCVSystemTotal } from "src/services/summaries/common-vulnerabilities";
import { useGeneralStore } from "src/stores/general";

const CVEFound = ({
  selectedSource,
  selectedVersion,
}: {
  selectedSource: string;
  selectedVersion: string;
}) => {
  const { env } = useGeneralStore();

  const { data: systemTotal } = GetCVSystemTotal(
    env,
    selectedSource,
    selectedVersion
  );

  return (
    <>
      {systemTotal && (
        <article className="grid gap-2 py-4 px-8 text-center divide-y-1 dark:divide-white dark:bg-reset border-1 dark:border-reset rounded-md">
          <article className="grid">
            <span className="text-2xl">{systemTotal.count} CVE</span>
            found in your system
          </article>
          <article className="grid pt-2">
            <span className="text-2xl">{systemTotal.total} CVE</span>
            Total (for all years)
          </article>
        </article>
      )}
    </>
  );
};

export default CVEFound;
