import { faClock, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { GetWatchlist, UpdateWatchlist } from "src/services/graph/context-menu";
import { useGeneralStore } from "src/stores/general";
import { KeyStringVal } from "src/types/general";
import { convertToUTCString } from "src/utils/general";

const WatchList = () => {
  const { env } = useGeneralStore();

  const { data: watchlist } = GetWatchlist(env);
  const updateWatchlist = UpdateWatchlist(env);

  return (
    <section className="grid content-start gap-5 p-5">
      <header className="flex items-center gap-2">
        <FontAwesomeIcon icon={faEye} />
        <h3 className="text-lg">Watch List</h3>
      </header>
      <ul className="grid gap-5 pr-20 w-3/5 text-sm">
        {watchlist?.map((resource: KeyStringVal) => {
          return (
            <li key={resource.graph_artifact_id} className="grid gap-1">
              <header className="flex items-center gap-5">
                <article className="flex items-center gap-2">
                  <img
                    src={`/graph/nodes/${resource.integration_type?.toLowerCase()}/${resource.resource_type?.toLowerCase()}.svg`}
                    alt={resource.node_type}
                    className="w-5 h-5"
                  />
                  <h4 className="break-all">{resource.graph_artifact_id}</h4>
                </article>
                <button
                  disabled={updateWatchlist.status === "loading"}
                  onClick={(e) =>
                    updateWatchlist.mutate({
                      elementType: "node",
                      integrationType: resource.integration_type,
                      resourceType: resource.resource_type,
                      elementID: resource.graph_artifact_id,
                      action: "remove",
                    })
                  }
                >
                  <FontAwesomeIcon icon={faTrash} className="red-button" />
                </button>
              </header>
              <article className="flex items-center gap-2 break-all text-[0.75rem] dark:text-checkbox">
                <FontAwesomeIcon icon={faClock} className="dark:text-admin" />
                <p>since {convertToUTCString(Number(resource.entry_time))}</p>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default WatchList;
