import {
  faCheck,
  faEye,
  faEyeSlash,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { filterVariants, showVariants } from "src/constants/general";
import { initialContextMenu } from "src/constants/graph";
import {
  GetWatchlist,
  UpdateWatchlist,
  GetContextualActions,
} from "src/services/graph/context-menu";
import { useGeneralStore } from "src/stores/general";
import { useGraphStore } from "src/stores/graph";
import { KeyStringVal } from "src/types/general";
import { handleViewSnapshot } from "src/utils/graph";

const ContextMenu = () => {
  const navigate = useNavigate();

  const {
    setNavigationView,
    setGraphSearch,
    setGraphSearching,
    setGraphSearchString,
    selectedContextMenu,
    setSnapshotTime,
    setSelectedContextMenu,
  } = useGraphStore();
  const { env } = useGeneralStore();

  const [added, setAdded] = useState<boolean>(false);

  const { data: watchlist } = GetWatchlist(env);
  const updateWatchlist = UpdateWatchlist(env);
  const { data: getContextualActions } = GetContextualActions(
    env,
    String(selectedContextMenu.nodeType) || "",
    selectedContextMenu.id
  );

  const addedToWatchlist = watchlist?.some(
    (resource: KeyStringVal) =>
      resource.graph_artifact_id === selectedContextMenu.id
  );

  const handleAddToWatchlist = () => {
    if (addedToWatchlist === false) {
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
        setSelectedContextMenu(initialContextMenu);
      }, 2000);
    }
  };

  return (
    <motion.nav
      variants={filterVariants}
      initial="hidden"
      animate={selectedContextMenu.id !== "" ? "visible" : "hidden"}
      style={{
        ...(selectedContextMenu.top && { top: selectedContextMenu.top }),
        ...(selectedContextMenu.left && { left: selectedContextMenu.left }),
        ...(selectedContextMenu.right && { right: selectedContextMenu.right }),
        ...(selectedContextMenu.bottom && {
          bottom: selectedContextMenu.bottom,
        }),
      }}
      className="absolute grid p-2 content-start w-[18rem] h-max text-base dark:bg-black border dark:border-black divide-y dark:divide-context-divide/30 rounded-md z-50"
    >
      <article className="grid">
        {["watch list"].map((action, index) => {
          return (
            <motion.button
              key={index}
              variants={filterVariants}
              disabled={updateWatchlist.status === "loading"}
              className="flex items-center gap-3 p-2 text-left dark:hover:bg-signin/30 duration-100 rounded-md"
              onClick={(e) => {
                e.stopPropagation();
                switch (action) {
                  case "watch list":
                    updateWatchlist.mutate({
                      elementType: "node",
                      integrationType: selectedContextMenu.integrationType,
                      resourceType: selectedContextMenu.nodeType,
                      elementID: selectedContextMenu.id,
                      action: addedToWatchlist ? "remove" : "add",
                    });
                    handleAddToWatchlist();
                    break;
                }
              }}
            >
              {added ? (
                <motion.article
                  variants={showVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faCheck} className="text-no" />
                  <p>Added to watchlist</p>
                </motion.article>
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={addedToWatchlist ? faEyeSlash : faEye}
                  />
                  <p>
                    {addedToWatchlist ? "Remove from" : "Add to"} {action}
                  </p>
                </>
              )}
            </motion.button>
          );
        })}
      </article>
      {getContextualActions?.length > 0 && (
        <article className="grid">
          {getContextualActions.map((action: KeyStringVal) => {
            return (
              <motion.button
                key={action.action_name}
                variants={filterVariants}
                className="flex items-start gap-3 p-2 text-left dark:hover:bg-signin/30 duration-100 rounded-md"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewSnapshot(
                    action.parameters,
                    setNavigationView,
                    setGraphSearch,
                    setGraphSearching,
                    setGraphSearchString,
                    navigate,
                    setSnapshotTime
                  );
                }}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} className="mt-1" />
                <p>{action.action_name}</p>
              </motion.button>
            );
          })}
        </article>
      )}
    </motion.nav>
  );
};

export default ContextMenu;
