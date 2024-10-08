/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from "framer-motion";
import React, { useState } from "react";
import { childrenVariants } from "src/constants/general";
import { GetPropertyGroupDetail } from "src/services/summaries/system-entropy";
import { useSummaryStore } from "src/stores/summaries";
import { KeyStringVal } from "src/types/general";
import { convertToUTCString, isValidTimestamp } from "src/utils/general";

const PropertyGroupDetail = ({
  nav,
  setNav,
}: {
  nav: string[];
  setNav: (nav: string[]) => void;
}) => {
  const { period } = useSummaryStore();

  const [selectedNodeType, setSelectedNodeType] = useState<string>("");

  const value = nav[nav.length - 1].split("+");
  const bucketStart = Number(value[0]);
  const group = value[1];
  const integration = value.length === 4 ? value[2] : "";
  const resourceType = value.length === 3 ? value[2] : value[3] || "";

  const { data: propertyGroupDetail } = GetPropertyGroupDetail(
    period,
    group,
    bucketStart,
    resourceType
  );

  const filteredDetails =
    value.length >= 3
      ? propertyGroupDetail?.filter((propertyGroup: KeyStringVal) =>
          [group, integration].includes(propertyGroup.integration_type)
        )
      : propertyGroupDetail;

  return (
    <>
      {propertyGroupDetail ? (
        filteredDetails?.length > 0 ? (
          <ul className="property-group-detail flex justify-between items-end gap-10 pb-10 mx-auto w-full h-full rotate-180 overflow-auto scrollbar">
            {filteredDetails.map((nodeType: any) => {
              return (
                <li
                  key={`${nodeType.integration_type}-${nodeType.node_type}`}
                  className="grid content-start justify-self-center gap-5 mx-auto rotate-180"
                >
                  <header className="grid gap-2 text-center">
                    <img
                      src={`/graph/nodes/${nodeType.integration_type.toLowerCase()}/${nodeType.node_type.toLowerCase()}.svg`}
                      alt={nodeType.node_type}
                      className="mx-auto"
                      onClick={() => {
                        if (selectedNodeType !== nodeType.node_type)
                          setSelectedNodeType(nodeType.node_type);
                        else setSelectedNodeType("");
                      }}
                    />
                    <h4>{nodeType.node_type}</h4>
                  </header>
                  <motion.article
                    variants={childrenVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid justify-self-end font-extralight break-words"
                  >
                    {Object.entries(nodeType.properties).map((keyVal: any) => {
                      return (
                        <motion.article
                          variants={childrenVariants}
                          key={keyVal[0]}
                          className="relative group grid gap-3 p-5 w-[15rem] break-all border-l-2 dark:border-[#77ACA2] dark:even:border-[#F4E9CD] cursor-pointer dark:hover:bg-filter/30 duration-100"
                          onClick={() => {
                            if (value.length >= 3)
                              setNav([
                                nav[0],
                                `${nav[1].split("+")[0]}+${
                                  keyVal[1].property_group
                                }+${nav[1].split("+")[1]}+${
                                  nav[1].split("+")[2]
                                }`,
                                `${nodeType.node_type}+${keyVal[0]}`,
                              ]);
                            else
                              setNav([
                                ...nav,
                                `${nodeType.node_type}+${keyVal[0]}`,
                              ]);
                          }}
                        >
                          <h4 className="dark:text-qualifying">
                            {keyVal[1].short_description}{" "}
                          </h4>
                          <p className="text-xs">{keyVal[0]}</p>
                          <article className="hidden group-hover:flex flex-wrap items-center gap-3 text-sm break-all">
                            <p className="break-words">
                              Description:{" "}
                              {keyVal[1].long_description.slice(0, 100)}
                              {keyVal[1].long_description.length > 100 && (
                                <span>......</span>
                              )}
                            </p>
                            <article className="flex flex-wrap items-center gap-1 text-admin">
                              <h4>Most - </h4>
                              <h4>
                                {isValidTimestamp(
                                  keyVal[1].most_common.value
                                ) ? (
                                  convertToUTCString(
                                    keyVal[1].most_common.value
                                  )
                                ) : (
                                  <>
                                    {keyVal[1].most_common.value.slice(0, 100)}{" "}
                                    {keyVal[1].most_common.value.length >
                                      100 && <span>......</span>}
                                  </>
                                )}
                              </h4>
                            </article>
                            <article className="flex flex-wrap items-center gap-1 text-filter">
                              <h4>Least - </h4>
                              <h4>
                                {isValidTimestamp(
                                  keyVal[1].least_common.value
                                ) ? (
                                  convertToUTCString(
                                    keyVal[1].least_common.value
                                  )
                                ) : (
                                  <>
                                    {keyVal[1].least_common.value.slice(0, 100)}{" "}
                                    {keyVal[1].least_common.value.length >
                                      100 && <span>......</span>}
                                  </>
                                )}
                              </h4>
                            </article>
                          </article>
                        </motion.article>
                      );
                    })}
                  </motion.article>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No data available</p>
        )
      ) : null}
    </>
  );
};

export default PropertyGroupDetail;
