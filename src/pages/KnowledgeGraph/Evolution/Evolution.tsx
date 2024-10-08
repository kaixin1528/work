import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import DiffIntegrationFilter from "../../../components/Filter/Graph/DiffIntegrationFilter";
import { DiffBucket } from "../../../types/graph";
import { useGraphStore } from "../../../stores/graph";
import DiffSummary from "./DiffSummary";
import { convertToDate } from "src/utils/general";
import { utcFormat } from "d3-time-format";

const Evolution = ({
  diffSummary,
  collapseSummary,
  setCollapseSummary,
}: {
  diffSummary: DiffBucket[];
  collapseSummary: boolean;
  setCollapseSummary: (collapseSummary: boolean) => void;
}) => {
  const {
    diffView,
    setDiffView,
    diffIntegrationType,
    setDiffIntegrationType,
    diffStartTime,
  } = useGraphStore();

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      className={`grid px-10 pr-20 w-full ${
        collapseSummary ? "h-[1.5rem]" : "h-[7rem]"
      } text-xs dark:text-white`}
    >
      <header className="grid grid-cols-3 gap-3 mb-2">
        <article className="flex items-center gap-3">
          <h4 className="hidden sm:block dark:text-checkbox text-sm">
            Evolution Over Time
          </h4>
          <button onClick={() => setCollapseSummary(!collapseSummary)}>
            {!collapseSummary ? (
              <svg
                width="17"
                height="11"
                viewBox="0 0 17 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3"
              >
                <path
                  d="M15.7467 7.15567C16.2171 7.6136 16.2275 8.38191 15.7695 8.85236L14.6484 10.0041C14.1904 10.4746 13.4221 10.485 12.9517 10.027L8.06873 5.274L3.31579 10.1569C2.85786 10.6274 2.08955 10.6377 1.6191 10.1798L0.46728 9.05864C-0.00316756 8.60071 -0.0135248 7.83239 0.444408 7.36195L7.15549 0.467458C7.61342 -0.00298962 8.36572 -0.013131 8.85218 0.444586L15.7467 7.15567Z"
                  fill="#7993B0"
                />
              </svg>
            ) : (
              <svg
                width="16"
                height="11"
                viewBox="0 0 16 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3"
              >
                <path
                  d="M0.348174 3.18159C-0.116058 2.71736 -0.116058 1.94897 0.348174 1.48474L1.48478 0.348174C1.94901 -0.116058 2.71739 -0.116058 3.18162 0.348174L8.00005 5.16658L12.8184 0.348174C13.2826 -0.116058 14.051 -0.116058 14.5152 0.348174L15.6518 1.48474C16.1161 1.94897 16.1161 2.71736 15.6518 3.18159L8.84842 9.98499C8.38419 10.4492 7.63182 10.4492 7.15158 9.98499L0.348174 3.18159Z"
                  fill="#7993B0"
                />
              </svg>
            )}
          </button>
          {diffView === "hour" && diffStartTime.hour && (
            <p>
              {utcFormat("%b %d")(convertToDate(Number(diffStartTime.hour)))}
            </p>
          )}
        </article>
        {!collapseSummary && (
          <article className="flex items-center gap-2 mx-auto">
            {["day", "hour", "snapshot"].includes(diffView) &&
              !collapseSummary && (
                <button
                  data-test="back"
                  className="flex items-center gap-2 dark:text-checkbox dark:hover:text-white duration-100"
                  onClick={() => {
                    if (diffView === "day") {
                      setDiffView("month");
                    } else if (["hour", "snapshot"].includes(diffView)) {
                      setDiffView("day");
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
                </button>
              )}
            <p
              data-test="view"
              className="capitalize text-sm dark:text-checkbox"
            >
              By {diffView === "snapshot" ? "hour" : diffView}
            </p>
          </article>
        )}
        <article className="justify-self-end">
          <DiffIntegrationFilter
            value={diffIntegrationType}
            setValue={setDiffIntegrationType}
          />
        </article>
      </header>
      {diffIntegrationType !== "" &&
        diffSummary?.length === 0 &&
        !collapseSummary && (
          <p className="mx-auto">No snapshot for this time period.</p>
        )}
      {diffSummary?.length > 0 && !collapseSummary && (
        <DiffSummary diffSummary={diffSummary} />
      )}
    </motion.section>
  );
};

export default Evolution;
