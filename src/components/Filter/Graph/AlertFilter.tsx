/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { Filter, KeyAllVal } from "../../../types/general";
import {
  calcTimeFromSnapshot,
  convertToUTCString,
} from "../../../utils/general";
import { motion } from "framer-motion";
import { filterVariants } from "src/constants/general";
import DropdownLayout from "src/layouts/DropdownLayout";
import { alertTimes } from "src/constants/graph";

const AlertFilter = ({
  setFilter,
  curSnapshotTime,
}: {
  setFilter: (filter: Filter[]) => void;
  curSnapshotTime?: number | undefined;
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Last 30 days");

  return (
    <section className="flex flex-wrap items-center gap-5">
      <DropdownLayout value={selectedPeriod}>
        {alertTimes?.map((item: KeyAllVal, index: number) => (
          <motion.button
            key={index}
            variants={filterVariants}
            className={`relative py-1 px-7 text-left dark:hover:bg-checkbox/30 ${
              selectedPeriod === item.name ? "dark:bg-filter" : ""
            } duration-100`}
            onClick={() => {
              setSelectedPeriod(String(item.name));
              setFilter([
                {
                  field: "timestamp",
                  op: "ge",
                  value: calcTimeFromSnapshot(
                    Number(item.value),
                    Number(curSnapshotTime)
                  ),
                  type: "integer",
                  set_op: "and",
                },
              ]);
            }}
          >
            <p>{item.name}</p>
          </motion.button>
        ))}
      </DropdownLayout>
      {curSnapshotTime && (
        <h4 className="text-xs">
          from {convertToUTCString(Number(curSnapshotTime))}
        </h4>
      )}
    </section>
  );
};

export default AlertFilter;
