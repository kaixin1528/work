/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import {
  faChevronDown,
  faChevronUp,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useState } from "react";
import { convertToUTCString, isEpoch, sortRows } from "../../../utils/general";
import { GetAllGroups } from "../../../services/settings/groups";
import Users from "./Users";
import { Group } from "../../../types/settings";
import AddGroup from "./AddGroup";
import EditGroup from "./EditGroup";
import { getCustomerID } from "../../../utils/general";
import { ListHeader } from "../../../types/general";
import TableLayout from "../../../layouts/TableLayout";
import SortColumn from "src/components/Button/SortColumn";
import { initialSort } from "src/constants/general";
import GroupActionFilter from "src/components/Filter/Settings/GroupActionFilter";

export const groupHeaders = [
  { display_name: "Group Name", property_name: "group_name" },
  { display_name: "Description", property_name: "group_description" },
  { display_name: "Users", property_name: "users_count" },
  { display_name: "Updated", property_name: "updated_at" },
  { display_name: "Created", property_name: "created_at" },
];

const Groups = () => {
  const customerID = getCustomerID();

  const [editGroup, setEditGroup] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [query, setQuery] = useState<string>("");
  const [multiSelect, setMultiSelect] = useState<string[]>([]);
  const [sort, setSort] = useState(initialSort);

  const { data: allGroups } = GetAllGroups(customerID, false);

  const filteredGroups = allGroups
    ? allGroups.filter((group: Group) =>
        group.group_name
          .toLowerCase()
          .replaceAll(/\s+/g, "")
          .includes(
            query.replaceAll('"', "").toLowerCase().replaceAll(/\s+/g, "")
          )
      )
    : [];
  const sortedGroups = sortRows(filteredGroups, sort);

  const totalCount = sortedGroups.length;

  return (
    <section className="grid content-start gap-5 p-4 w-full h-full overflow-auto scrollbar">
      <h4>
        GROUPS{" "}
        <span className="dark:text-checkbox">
          ({filteredGroups?.length || 0})
        </span>
      </h4>
      <section className="flex flex-col flex-grow gap-5 mb-5 w-full h-full text-xs overflow-auto scrollbar">
        <header className="flex justify-between gap-10">
          <article className="relative flex px-4 h-9 items-center w-2/5 dark:bg-search rounded-sm">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="dark:text-checkbox"
            />
            <input
              type="filter"
              autoComplete="off"
              spellCheck="false"
              placeholder="Filter groups by name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-full pl-3 text-xs placeholder:text-secondary placeholder:text-xs placeholder:font-medium dark:disabled:cursor-not-allowed border-transparent focus:ring-0 focus:border-transparent bg-transparent focus:outline-none dark:bg-search rounded-sm"
            />
          </article>
          <article className="flex items-center gap-2">
            {multiSelect.length > 0 && (
              <GroupActionFilter
                list={["Delete"]}
                multiSelect={multiSelect}
                setMultiSelect={setMultiSelect}
              />
            )}

            {/* add group */}
            <AddGroup />
          </article>
        </header>

        {/* group table */}
        <TableLayout>
          <thead className="sticky -top-1.5 z-10 bg-gradient-to-b dark:from-expand dark:to-table-header">
            <tr>
              <th className="px-5 pr-6 w-5">
                <input
                  type="checkbox"
                  checked={
                    sortedGroups?.length > 0 &&
                    multiSelect.length === totalCount
                  }
                  className="form-checkbox w-4 h-4 border-0 dark:focus:ring-0 dark:text-checkbox dark:focus:border-checkbox focus:ring dark:focus:ring-offset-0 dark:focus:ring-checkbox focus:ring-opacity-50"
                  onChange={(e) => {
                    e.stopPropagation();
                    if (multiSelect.length < totalCount) {
                      setMultiSelect(
                        sortedGroups?.map((group: Group) => group.group_id)
                      );
                    } else setMultiSelect([]);
                  }}
                />
              </th>
              {groupHeaders.map((col: ListHeader) => {
                return (
                  <th
                    scope="col"
                    key={col.display_name}
                    className="py-3 px-3 text-left font-semibold"
                  >
                    <article className="capitalize flex gap-10 justify-between">
                      <h4>{col.display_name}</h4>
                      <SortColumn
                        propertyName={col.property_name}
                        setSort={setSort}
                      />
                    </article>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedGroups?.map((group: Group, index: number) => {
              return (
                <Fragment key={group.group_id}>
                  <tr
                    className={`relative p-5 gap-3 break-words cursor-pointer ${
                      selectedGroup === group.group_id
                        ? "dark:bg-expand border-b dark:border-filter/80"
                        : "dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70 dark:hover:bg-gradient-to-b dark:hover:from-expand dark:hover:to-filter/60"
                    }`}
                    onClick={(e) => {
                      if (document.getSelection()?.type === "Range")
                        e.preventDefault();
                      else {
                        if (selectedGroup === group.group_id)
                          setSelectedGroup("");
                        else setSelectedGroup(group.group_id);
                      }
                    }}
                  >
                    <td className="px-5 w-5">
                      <input
                        type="checkbox"
                        checked={multiSelect.includes(group.group_id)}
                        className="form-checkbox w-4 h-4 border-0 dark:focus:ring-0 dark:text-checkbox dark:focus:border-checkbox focus:ring dark:focus:ring-offset-0 dark:focus:ring-checkbox focus:ring-opacity-50"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        onChange={() => {
                          if (multiSelect.includes(group.group_id))
                            setMultiSelect(
                              multiSelect.filter(
                                (userID) => userID !== group.group_id
                              )
                            );
                          else setMultiSelect([...multiSelect, group.group_id]);
                        }}
                      />
                    </td>
                    {groupHeaders.map((col: ListHeader, colIndex: number) => {
                      const isDate = isEpoch(group[col.property_name])
                        ? convertToUTCString(group[col.property_name])
                        : false;

                      return (
                        <td
                          key={`${group.group_id}-${colIndex}`}
                          className="relative py-4 px-3 last:pr-16 text-left truncate lg:whitespace-normal"
                        >
                          <button
                            disabled={!col.property_name.includes("name")}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditGroup(group.group_id);
                            }}
                          >
                            <p
                              className={`${
                                col.property_name.includes("name") &&
                                "underline dark:text-signin"
                              } text-left`}
                            >
                              {isDate ? isDate : group[col.property_name]}
                            </p>
                          </button>
                          {colIndex === groupHeaders.length - 1 && (
                            <button className="absolute right-5 top-1/3 w-6 h-6 dark:hover:text-clear dark:text-checkbox duration-100 justify-self-end cursor-pointer">
                              <FontAwesomeIcon
                                icon={
                                  selectedGroup === group.group_id
                                    ? faChevronUp
                                    : faChevronDown
                                }
                              />
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* expanded view */}
                  {selectedGroup === group.group_id && (
                    <tr
                      key={`${group.group_id}-expanded`}
                      className="relative py-5 px-10 gap-10 bg-gradient-to-b dark:from-expand dark:to-expand/60"
                    >
                      <td colSpan={groupHeaders.length + 1}>
                        <section className="relative grid grid-cols-1 w-full pb-5">
                          <Users selectedGroup={selectedGroup} />
                        </section>
                      </td>
                    </tr>
                  )}

                  {/* edit group */}
                  <EditGroup
                    editGroup={editGroup}
                    setEditGroup={setEditGroup}
                    group={group}
                  />
                </Fragment>
              );
            })}
          </tbody>
        </TableLayout>
      </section>
    </section>
  );
};

export default Groups;
