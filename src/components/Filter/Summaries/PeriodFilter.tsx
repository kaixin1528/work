/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { periods } from "src/constants/summaries";
import { filterVariants } from "../../../constants/general";
import DropdownLayout from "../../../layouts/DropdownLayout";
import { useSummaryStore } from "src/stores/summaries";

const PeriodFilter = ({ excludePeriods }: { excludePeriods?: number[] }) => {
  const { period, setPeriod } = useSummaryStore();

  return (
    <DropdownLayout value={periods[period]}>
      {Object.keys(periods).map((curPeriod: string) => {
        if (excludePeriods?.includes(Number(curPeriod))) return null;
        return (
          <motion.button
            key={curPeriod}
            variants={filterVariants}
            className={`relative py-1 px-7 text-left dark:hover:bg-filter/50 ${
              period === Number(curPeriod) ? "dark:bg-filter" : ""
            } duration-100`}
            onClick={() => setPeriod(Number(curPeriod))}
          >
            <p>{periods[curPeriod]}</p>
          </motion.button>
        );
      })}
    </DropdownLayout>
  );
};

export default PeriodFilter;
