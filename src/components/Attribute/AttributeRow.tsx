import { faSearch, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover, Transition } from "@headlessui/react";
import { index } from "d3-array";
import React, { Fragment, useState } from "react";
import { orgCloud } from "src/constants/graph";
import { handleViewSnapshot } from "src/utils/graph";
import AttributeValue from "./AttributeValue";
import { useNavigate } from "react-router-dom";
import { GetPropertySearchQuery } from "src/services/graph/search";
import { useGraphStore } from "src/stores/graph";
import {
  parseURL,
  getCustomerCloud,
  convertToMicrosec,
} from "src/utils/general";

const AttributeRow = ({
  attribute,
  curSearchSnapshot,
}: {
  attribute: any;
  curSearchSnapshot?: any;
}) => {
  const navigate = useNavigate();
  const parsed = parseURL();
  const customerCloud = getCustomerCloud();

  const {
    graphInfo,
    setGraphInfo,
    graphSearchString,
    setGraphSearchString,
    setGraphNav,
    setGraphSearch,
    setGraphSearching,
    setNavigationView,
    setSnapshotTime,
    selectedNode,
    snapshotTime,
  } = useGraphStore();

  const [propertyValues, setPropertyValues] = useState<any>(attribute.value);

  const getPropertySearchQuery = GetPropertySearchQuery();

  const isList =
    attribute.data_type === "json" &&
    Array.isArray(attribute.value) &&
    typeof attribute.value[0] !== "object";

  return (
    <tr
      key={`keyinfo-${index}`}
      className="text-xs dark:bg-tooltip dark:even:bg-panel"
    >
      <td className="flex flex-wrap items-start gap-2 py-3 px-4 pr-10 break-words dark:text-white font-medium">
        {!parsed.diary_id &&
          parsed.section !== "rgn" &&
          (attribute.data_type !== "json" || isList) &&
          attribute.property_name !== "children_count" && (
            <button
              className="dark:hover:text-signin duration-100"
              onClick={() => {
                setGraphNav([
                  {
                    nodeID: customerCloud,
                    nodeType: orgCloud,
                  },
                ]);
                setGraphInfo({
                  ...graphInfo,
                  showPanel: false,
                });
                getPropertySearchQuery.mutate(
                  {
                    query: graphSearchString,
                    type: selectedNode?.nodeType,
                    found_in_source_nodes:
                      curSearchSnapshot?.source_nodes?.includes(
                        selectedNode?.id
                      ),
                    source_nodes_present:
                      curSearchSnapshot?.source_nodes?.length > 0,
                    found_in_qualifying_nodes:
                      curSearchSnapshot?.qualifying_nodes?.includes(
                        selectedNode?.id
                      ),
                    qualifying_nodes_present:
                      curSearchSnapshot?.qualifying_nodes?.length > 0,
                    property_name: attribute.property_name,
                    property_operator: "=",
                    property_value: isList ? propertyValues : attribute.value,
                  },
                  {
                    onSuccess: (queryString) => {
                      handleViewSnapshot(
                        queryString,
                        setNavigationView,
                        setGraphSearch,
                        setGraphSearching,
                        setGraphSearchString,
                        navigate,
                        setSnapshotTime,
                        convertToMicrosec(snapshotTime)
                      );
                    },
                  }
                );
              }}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          )}
        {attribute.display_name}
        {attribute.long_desc && (
          <Popover className="relative">
            <Popover.Button>
              <FontAwesomeIcon
                icon={faCircleInfo}
                className="w-3 h-3 dark:text-checkbox z-0"
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="pointer-events-auto absolute md:w-[20rem] break-words px-4 z-50">
                <p className="absolute -top-16 dark:text-white dark:bg-metric p-3 overflow-hidden rounded-sm">
                  {attribute.long_desc}
                </p>
              </Popover.Panel>
            </Transition>
          </Popover>
        )}
      </td>
      <td className="py-3 px-4 overflow-auto scrollbar break-all">
        <AttributeValue
          attribute={attribute}
          propertyValues={propertyValues}
          setPropertyValues={setPropertyValues}
        />
      </td>
    </tr>
  );
};

export default AttributeRow;
