import React from "react";
import { convertToUTCString } from "src/utils/general";
import { CVEInfo } from "../../../../../types/dashboard";

const CVEImpact = ({ cveInfo }: { cveInfo: CVEInfo }) => {
  return (
    <section className="grid gap-3 p-4 px-6 w-max break-all text-sm dark:text-checkbox border dark:border-icon rounded-sm overflow-auto scrollbar">
      <header className="flex items-center gap-2 mx-auto">
        <img
          src="/dashboard/expanded/cri/impact.svg"
          alt="cve impact"
          className="w-4 h-4"
        />
        <h4>Impact</h4>
      </header>
      <article className="flex items-center gap-2 mx-auto">
        <h4 className="text-right">Images:</h4>
        <p className="px-2 py-1 mx-auto text-left dark:text-white text-xs dark:bg-[#020D23]">
          {cveInfo.total_images}
        </p>
      </article>
      <article className="flex items-center gap-2 mx-auto">
        <h4 className="text-right w-max">Live Resources:</h4>
        <p className="px-2 py-1 mx-auto text-left dark:text-white text-xs dark:bg-[#020D23]">
          {cveInfo.live_services}
        </p>
      </article>
      <article className="grid gap-1">
        <h4 className="text-center">First Observed:</h4>
        <p className="px-2 py-1 mx-auto w-max break-all dark:text-white text-xs dark:bg-[#020D23]">
          {cveInfo.first_observed === -1
            ? "Never"
            : convertToUTCString(cveInfo.first_observed)}
        </p>
      </article>
      <article className="grid gap-2">
        <h4 className="text-center">un-addressed for:</h4>
        <p className="px-2 py-1 break-all text-xs text-center dark:text-white border border-[#F04163] bg-[#3A2B45] rounded-sm">
          {cveInfo.unaddressed_for} day
          {cveInfo.unaddressed_for > 1 && "s"}
        </p>
      </article>
    </section>
  );
};

export default CVEImpact;
