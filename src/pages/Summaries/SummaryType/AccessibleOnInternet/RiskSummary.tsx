import { GetAccessibleInternetSummary } from "src/services/summaries/accessible-on-internet";
import { useSummaryStore } from "src/stores/summaries";

const RiskSummary = () => {
  const { period } = useSummaryStore();

  const { data: accessibleInternetSummary } =
    GetAccessibleInternetSummary(period);

  return (
    <section className="flex flex-col flex-grow gap-3 p-4 w-full h-full text-sm text-center dark:bg-card black-shadow">
      <h4 className="p-4 mx-auto w-full text-lg dark:bg-reset border dark:border-reset rounded-sm">
        Accessible
      </h4>
      {accessibleInternetSummary && (
        <ul className="grid w-full h-full">
          {[
            "Total Resources",
            "Databases",
            "Compute Assets",
            "Storage",
            "Service & Applications",
          ].map((property: string) => {
            return (
              <li
                key={property}
                className="py-2 px-4 pt-5 dark:bg-filter/30 dark:even:bg-panel"
              >
                {property} -{" "}
                <span className="py-1 px-3 font-medium dark:bg-info">
                  {accessibleInternetSummary[property]}
                </span>{" "}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default RiskSummary;
