/* eslint-disable no-restricted-globals */
import { Favorite, Publication } from "../../types/general";
import { useNavigate } from "react-router-dom";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  AddReportToFavorites,
  RemoveReportFromFavorites,
} from "../../services/summaries/summaries";
import { useSummaryStore } from "src/stores/summaries";
import { useGeneralStore } from "src/stores/general";

const ReportList = ({
  filteredReports,
  favorites,
}: {
  filteredReports: Publication[];
  favorites: Favorite[];
}) => {
  const navigate = useNavigate();

  const { setSpotlightSearchString } = useGeneralStore();
  const { setPeriod, setSelectedReportAccount } = useSummaryStore();

  const addToFav = AddReportToFavorites();
  const removeFromFav = RemoveReportFromFavorites();

  return (
    <ul className="grid content-start dark:text-checkbox max-h-48 overflow-auto scrollbar">
      {filteredReports?.map((report: Publication) => {
        const isFavorite = favorites?.some(
          (favorite: Favorite) =>
            favorite.artifact_name === report.artifact_name
        );

        return (
          <button
            key={report.artifact_name}
            disabled={[
              "Software Dependency Evolution",
              "Networking Config Changes",
            ].includes(report.artifact_name)}
            className="flex items-center justify-between gap-10 p-2 text-left disabled:cursor-auto disabled:dark:text-filter/60 disabled:dark:bg-expand/40 cursor-pointer dark:hover:bg-filter/50 duration-100  border-b-1 dark:border-checkbox/30"
            onClick={() => {
              setPeriod(3);
              setSelectedReportAccount(undefined);
              setSpotlightSearchString("");
              navigate(
                `/summaries/details?summary=${report.artifact_name
                  .toLowerCase()
                  .replaceAll(" ", "_")}`
              );
            }}
          >
            <h4>{report.artifact_name}</h4>
            <article className="flex items-center gap-5 pr-5">
              <article
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();

                  if (isFavorite)
                    removeFromFav.mutate({
                      artifactType: report.artifact_type,
                      artifactCategory: report.artifact_category,
                      artifactName: report.artifact_name,
                    });
                  else
                    addToFav.mutate({
                      favorite: {
                        artifact_type: report.artifact_type,
                        artifact_category: report.artifact_category,
                        artifact_name: report.artifact_name,
                        is_favorite: true,
                      },
                    });
                }}
              >
                {isFavorite ? (
                  <FontAwesomeIcon
                    icon={faStar}
                    className={`${isFavorite ? "dark:text-favorite" : ""}`}
                  />
                ) : (
                  <svg
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                  >
                    <path
                      d="M11.9952 2.63004L14.4929 7.93013L14.9426 8.87015L15.9379 9.02015L21.536 9.87016L17.4881 13.9902L16.7704 14.7202L16.9427 15.7603L17.8996 21.5804L12.8948 18.8303L12.0048 18.3403L11.1148 18.8303L6.10995 21.5804L7.06691 15.7603L7.23916 14.7202L6.52144 13.9902L2.45439 9.87016L8.05257 9.02015L9.0478 8.87015L9.49757 7.93013L11.9952 2.63004ZM11.9952 0C11.488 0 10.9713 0.280005 10.7129 0.830014L7.78462 7.04012L1.22949 8.04013C0.052435 8.22013 -0.416472 9.73016 0.435217 10.6002L5.17214 15.4303L4.0525 22.2504C3.88982 23.2204 4.63624 24.0104 5.46879 24.0104C5.68889 24.0104 5.91856 23.9604 6.13866 23.8304L12.0048 20.6103L17.8709 23.8304C18.091 23.9504 18.3111 24.0004 18.5312 24.0004C19.3638 24.0004 20.1102 23.2204 19.9475 22.2504L18.8279 15.4303L23.5648 10.6002C24.4165 9.73016 23.9476 8.22013 22.7705 8.04013L16.2154 7.04012L13.2775 0.830014C13.0096 0.280005 12.5024 0 11.9856 0H11.9952Z"
                      fill="#7894B0"
                    />
                  </svg>
                )}
              </article>
            </article>
          </button>
        );
      })}
    </ul>
  );
};

export default ReportList;
