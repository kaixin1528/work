import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { GraphNodeAttribute } from "src/types/general";
import AttributeValue from "./AttributeValue";

const DiffAttribute = ({
  action,
  oldAttribute,
  newAttribute,
}: {
  action: string;
  oldAttribute?: GraphNodeAttribute;
  newAttribute?: GraphNodeAttribute;
}) => {
  return (
    <tr className="text-xs dark:bg-tooltip dark:even:bg-panel">
      <td className="flex flex-wrap items-center gap-2 py-3 px-4">
        <article className="flex items-start gap-2 break-words dark:text-white font-medium">
          <h4>{newAttribute?.display_name || oldAttribute?.display_name}</h4>
          {(newAttribute?.long_desc || oldAttribute?.long_desc) && (
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
                <Popover.Panel className="pointer-events-auto absolute w-56 px-4 z-50">
                  <p className="absolute -top-5 dark:text-white dark:bg-metric px-3 py-1 overflow-hidden rounded-sm">
                    {newAttribute?.long_desc || oldAttribute?.long_desc}
                  </p>
                </Popover.Panel>
              </Transition>
            </Popover>
          )}
        </article>
        {(newAttribute?.property_type || oldAttribute?.property_type) && (
          <p
            className={`px-2 py-1 w-max ${
              (
                newAttribute?.property_type || oldAttribute?.property_type
              )?.includes("Request")
                ? "bg-purple-500/30 border border-purple-500"
                : "bg-admin/30 border border-admin"
            } rounded-full`}
          >
            {newAttribute?.property_type || oldAttribute?.property_type}
          </p>
        )}
      </td>
      <td className="p-3 break-all">
        {["removed", "modified", "delete"].includes(action?.toLowerCase()) &&
          oldAttribute?.value && (
            <AttributeValue
              attribute={oldAttribute}
              specialVal="removed"
              isDiff
            />
          )}
        {action === "modified" && oldAttribute?.value && <br />}
        {["created", "modified", "update"].includes(action?.toLowerCase()) &&
          newAttribute?.value && (
            <AttributeValue
              attribute={newAttribute}
              specialVal="created"
              isDiff
            />
          )}
      </td>
    </tr>
  );
};

export default DiffAttribute;
