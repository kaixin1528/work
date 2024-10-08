import React, { useState } from "react";
import { GetCWEDetail } from "src/services/general/cwe";
import { KeyStringVal } from "src/types/general";
import CVENotes from "../CVE/CVENotes";
import KeyValuePair from "../General/KeyValuePair";
import parse from "html-react-parser";
import { Disclosure } from "@headlessui/react";
import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CopyToClipboard from "../General/CopyToClipboard";

const Summary = ({ selectedCWE }: { selectedCWE: string }) => {
  const [showMore, setShowMore] = useState<boolean>(false);

  const { data: cweDetail } = GetCWEDetail(selectedCWE);

  return (
    <>
      <header className="flex items-center gap-7">
        <article className="flex items-center gap-3">
          <img src="/general/vuln.svg" alt="cve" className="w-7 h-7" />
          <h4 className="text-lg dark:text-white">{selectedCWE}</h4>
          <CopyToClipboard copiedValue={selectedCWE} />
        </article>
        <CVENotes cveID={selectedCWE} />
      </header>
      <section className="flex flex-wrap items-center gap-5">
        {cweDetail.metadata.cwe.map((attr: KeyStringVal) => {
          if (
            ["alternative_cwe_id", "description"].includes(attr.property_name)
          )
            return null;
          return (
            <KeyValuePair
              key={attr.property_name}
              label={attr.display_name}
              value={cweDetail.data[attr.property_name]}
            />
          );
        })}
      </section>
      <section className="grid gap-3">
        <p className={`break-words ${showMore ? "h-max" : ""}`}>
          {cweDetail.data?.description?.slice(
            0,
            showMore ? cweDetail.data?.description?.length : 500
          )}
          {cweDetail.data?.description?.length > 500 && !showMore && "..."}
        </p>
        {cweDetail.data?.description?.length > 500 && (
          <button
            className="text-left text-xs dark:text-checkbox dark:text-checkbox/60 duration-200"
            onClick={() => setShowMore(!showMore)}
          >
            Show {showMore ? "less" : "more"}
          </button>
        )}
      </section>
      <Disclosure defaultOpen>
        {({ open }) => (
          <section className="grid content-start gap-3">
            <Disclosure.Button className="flex items-center gap-2 w-max">
              <FontAwesomeIcon
                icon={open ? faChevronCircleDown : faChevronCircleRight}
                className="dark:text-checkbox"
              />
              <p>Extended Description</p>
            </Disclosure.Button>
            <Disclosure.Panel>
              {parse(cweDetail?.data?.extended_description_xhtml_content)}
            </Disclosure.Panel>
          </section>
        )}
      </Disclosure>
    </>
  );
};

export default Summary;
