/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from "framer-motion";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import ReturnPage from "src/components/Button/ReturnPage";
import VersionFilter from "src/components/Filter/RegulationPolicy/VersionFilter";
import Loader from "src/components/Loader/Loader";
import { showVariants } from "src/constants/general";
import PageLayout from "src/layouts/PageLayout";
import { KeyStringVal } from "src/types/general";
import { parseURL } from "src/utils/general";
import Summary from "./Summary";
import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import { driftColors, driftTooltipColors } from "src/constants/grc";
import { percentageHeights } from "src/constants/summaries";
import {
  GetSOPDrift,
  GetSOPDriftDiff,
} from "src/services/business-continuity/sop";

const SOPDrift = () => {
  const parsed = parseURL();

  const [selectedChange, setSelectedChange] = useState<KeyStringVal>({
    source_version: "",
    source_version_id: "",
    target_version_id: "",
    target_version: "",
  });

  const { data: sopDrift, status: driftStatus } = GetSOPDrift(
    String(parsed.sop_id)
  );
  const { data: diff, status: diffStatus } = GetSOPDriftDiff(
    selectedChange.source_version_id,
    selectedChange.target_version_id
  );

  const listRef = useRef(
    Array(diff?.diff?.length).fill(null)
  ) as MutableRefObject<any[]>;
  const [selectedScrollIndex, setSelectedScrollIndex] = useState<number>(-1);

  useEffect(() => {
    if (diff?.diff?.length > 0) {
      if (listRef?.current && listRef?.current[selectedScrollIndex])
        listRef.current[selectedScrollIndex].scrollIntoView({
          behavior: "smooth",
        });
    }
  }, [listRef, selectedScrollIndex]);

  return (
    <PageLayout>
      <motion.main
        variants={showVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col flex-grow content-start gap-3 p-4 w-full h-full shadow-2xl dark:shadow-card overflow-y-auto scrollbar"
      >
        <header className="flex items-center gap-5">
          <ReturnPage />
          <h4 className="text-xl">Policy Drift - {parsed.sop_name}</h4>
        </header>
        {driftStatus === "loading" ? (
          <Loader />
        ) : (
          <>
            <Disclosure defaultOpen>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={open ? faChevronCircleDown : faChevronCircleRight}
                      className="dark:text-checkbox"
                    />
                    <p>{open ? "Hide" : "Show"} summary</p>
                  </Disclosure.Button>
                  <Disclosure.Panel>
                    <section className="grid content-start gap-2 text-center dark:bg-filter/30 rounded-md">
                      <p className="pt-7">Click through to see details</p>
                      <Summary
                        sopDrift={sopDrift}
                        setSelectedChange={setSelectedChange}
                      />
                    </section>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
            <article className="flex items-center gap-10 mx-auto">
              <VersionFilter
                selectedChange={selectedChange}
                setSelectedChange={setSelectedChange}
                list={sopDrift}
                type="source"
              />
              <VersionFilter
                selectedChange={selectedChange}
                setSelectedChange={setSelectedChange}
                list={sopDrift}
                type="target"
              />
            </article>
            {diffStatus === "loading" ? (
              <Loader />
            ) : diff ? (
              diff?.diff?.length > 0 ? (
                <section className="flex gap-2 w-full bg-gradient-to-br dark:from-expand dark:to-expand/20 overflow-y-auto scrollbar">
                  <section className="grid grid-cols-2 content-start gap-10 p-4">
                    <ul className="inline content-start gap-5 leading-8">
                      {diff?.diff.map(
                        (diff: KeyStringVal, diffIndex: number) => {
                          return (
                            <li
                              key={diffIndex}
                              ref={(el) => {
                                if (listRef && listRef.current)
                                  listRef.current[diffIndex] = el;
                              }}
                              className="inline break-all"
                            >
                              {diff.source_text
                                ?.split("\n\n")
                                .map((phrase, index) => (
                                  <span
                                    key={index}
                                    className={`inline-block pb-4 ${
                                      ["replace", "delete"].includes(diff.state)
                                        ? "px-2 py-1 bg-reset/30"
                                        : diff.state === "insert"
                                        ? `select-none`
                                        : ""
                                    }`}
                                  >
                                    {phrase}
                                  </span>
                                ))}
                              {["replace", "insert"].includes(diff.state) &&
                                [...Array(diff.target_text.length).keys()].map(
                                  (_, index) => {
                                    return <span key={index}> &nbsp;</span>;
                                  }
                                )}
                            </li>
                          );
                        }
                      )}
                    </ul>
                    <ul className="inline content-start gap-5 leading-8">
                      {diff?.diff.map(
                        (diff: KeyStringVal, diffIndex: number) => {
                          return (
                            <li key={diffIndex} className="inline break-all">
                              {["replace", "delete"].includes(diff.state) &&
                                [...Array(diff.source_text.length).keys()].map(
                                  (_, index) => {
                                    return <span key={index}> &nbsp;</span>;
                                  }
                                )}
                              {diff.target_text
                                ?.split("\n\n")
                                .map((phrase, index) => (
                                  <span
                                    key={index}
                                    className={`inline-block pb-4 ${
                                      diff.state === "delete"
                                        ? "select-none"
                                        : diff.state !== "equal"
                                        ? "px-2 py-1 bg-no/30"
                                        : ""
                                    }`}
                                  >
                                    {phrase}
                                  </span>
                                ))}
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </section>
                  <article className="sticky top-0 flex flex-col flex-grow mr-4">
                    {diff?.diff.map((diff: KeyStringVal, diffIndex: number) => {
                      return (
                        <span
                          key={diffIndex}
                          className={`relative group w-10 ${
                            percentageHeights[diff.scrollbar_percent]
                          } cursor-pointer ${
                            driftColors[diff.state]
                          } first:rounded-t-sm last:rounded-b-sm`}
                          onClick={() => setSelectedScrollIndex(diffIndex)}
                        >
                          <span
                            className={`hidden group-hover:block absolute right-11 top-1/4 -translate-y-1/2 p-2 text-sm capitalize ${
                              driftTooltipColors[diff.state]
                            } rounded-md`}
                          >
                            {diff.state}
                          </span>
                        </span>
                      );
                    })}
                  </article>
                </section>
              ) : (
                <p>No changes available</p>
              )
            ) : null}
          </>
        )}
      </motion.main>
    </PageLayout>
  );
};

export default SOPDrift;
