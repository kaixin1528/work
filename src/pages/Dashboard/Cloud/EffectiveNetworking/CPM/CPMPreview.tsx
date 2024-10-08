/* eslint-disable no-restricted-globals */
import { useNavigate } from "react-router-dom";
import { GetCPMPreview } from "src/services/dashboard/effective-networking/cpm";
import { useGeneralStore } from "src/stores/general";

const CPMPreview = ({
  integration,
  selectedTab,
}: {
  integration: string;
  selectedTab: string;
}) => {
  const navigate = useNavigate();

  const { env } = useGeneralStore();

  const { data: cpmPreview } = GetCPMPreview(env, integration, 3, selectedTab);

  return (
    <section
      className="flex flex-col flex-grow p-4 gap-2 w-full h-full cursor-pointer"
      onClick={() =>
        navigate(`/dashboard/en/details?integration=${integration}&section=cpm`)
      }
    >
      <section className="flex gap-10 h-full">
        <article className="grid place-self-center gap-2 text-center">
          <span className="text-2xl">{cpmPreview?.total_services}</span>
          <h4 className="w-max dark:text-checkbox">Total Services</h4>
        </article>
        <article className="flex flex-col flex-grow gap-1 h-full text-xs">
          <h6 className="text-xs dark:text-checkbox font-medium">Most used</h6>
          {cpmPreview ? (
            cpmPreview?.top_n_services.length > 0 ? (
              <ul className="flex flex-col flex-grow gap-2 p-2 h-full">
                {cpmPreview.top_n_services.map(
                  (
                    service: { svc_name: string; counts: number },
                    index: number
                  ) => {
                    return (
                      <li
                        key={index}
                        className="flex items-center gap-3 h-full dark:text-checkbox break-all"
                      >
                        <span className="text-xl text-center dark:text-white">
                          {service.counts}
                        </span>
                        {service.svc_name}
                      </li>
                    );
                  }
                )}
              </ul>
            ) : (
              <article className="grid p-2 dark:bg-search cursor-pointer">
                <p className="truncate">Not available</p>
              </article>
            )
          ) : null}
        </article>
      </section>
    </section>
  );
};

export default CPMPreview;
