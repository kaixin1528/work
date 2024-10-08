import React, { useState } from "react";
import KeyValuePair from "../General/KeyValuePair";
import CVENotes from "./CVENotes";
import { GetCVEDetail } from "src/services/general/cve";
import CopyToClipboard from "../General/CopyToClipboard";

const Summary = ({ selectedCVE }: { selectedCVE: string }) => {
  const [showMore, setShowMore] = useState<boolean>(false);

  const { data: cveDetail } = GetCVEDetail(selectedCVE);

  return (
    <>
      <header className="flex items-center gap-7">
        <article className="flex items-center gap-3">
          <img src="/general/vuln.svg" alt="cve" className="w-7 h-7" />
          <h4 className="text-lg dark:text-white">{selectedCVE}</h4>
          <CopyToClipboard copiedValue={selectedCVE} />
        </article>
        <CVENotes cveID={selectedCVE} />
      </header>
      <section className="grid gap-3">
        <KeyValuePair
          label="Last Updated"
          value={cveDetail?.data?.last_modified_date_musecs}
        />
        <p className={`break-words ${showMore ? "h-max" : ""}`}>
          {cveDetail.data?.description?.slice(
            0,
            showMore ? cveDetail.data?.description?.length : 500
          )}
          {cveDetail.data?.description?.length > 500 && !showMore && "..."}
        </p>
        {cveDetail.data?.description?.length > 500 && (
          <button
            className="text-left text-xs dark:text-checkbox dark:text-checkbox/60 duration-200"
            onClick={() => setShowMore(!showMore)}
          >
            Show {showMore ? "less" : "more"}
          </button>
        )}
      </section>
    </>
  );
};

export default Summary;
