import { motion } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";
import { pointerVariants, showVariants } from "src/constants/general";
import { ArchiveTask, GetTasks } from "src/services/getting-started";
import { GetQueryLookup } from "src/services/graph/search";
import { useGeneralStore } from "src/stores/general";
import { useGraphStore } from "src/stores/graph";
import { useInvestigationStore } from "src/stores/investigation";
import { handleViewSnapshot } from "src/utils/graph";

const NeedsAttention = () => {
  const navigate = useNavigate();

  const { env } = useGeneralStore();
  const {
    setSelectedPanelTab,
    setElementType,
    graphInfo,
    setGraphInfo,
    setSelectedNode,
    setSelectedEdge,
    setNavigationView,
    setGraphSearch,
    setGraphSearching,
    setGraphSearchString,
    setSnapshotTime,
  } = useGraphStore();
  const {
    setShowEvidencePanel,
    setSelectedEvidencePanelTab,
    setSelectedEvidenceID,
  } = useInvestigationStore();

  const { data: tasks } = GetTasks(env, 3);
  const archiveTask = ArchiveTask(env);
  const queryLookup = GetQueryLookup();

  return (
    <motion.section
      variants={pointerVariants}
      className="flex flex-col flex-grow content-start gap-3 p-4 w-full h-full text-center text-sm bg-gradient-to-b dark:bg-main border-1 dark:border-filter overflow-auto scrollbar z-20"
    >
      <h3 className="text-xl">Needs Attention</h3>
      {tasks?.length > 0 ? (
        <motion.ul
          variants={showVariants}
          initial="hidden"
          animate="visible"
          className="grid text-sm divide-y dark:divide-checkbox/20"
        >
          {tasks.map((task: any) => {
            return (
              <motion.li
                variants={showVariants}
                key={task.diary_id}
                className="grid gap-2 p-4 place-items-center cursor-pointer dark:hover:bg-filter/30 duration-100"
                onClick={() => {
                  archiveTask.mutate({
                    taskID: task.task_id,
                  });
                  switch (task.task_type) {
                    case "GRAPH_ARTIFACT_NOTE":
                      setElementType(task.task_metadata.graph_artifact_type);
                      if (task.task_metadata.graph_artifact_type === "node")
                        setSelectedNode({
                          id: task.task_metadata.graph_artifact_id,
                        });
                      else
                        setSelectedEdge({
                          id: task.task_metadata.graph_artifact_id,
                        });
                      setSelectedPanelTab("Notes");
                      setGraphInfo({
                        ...graphInfo,
                        showPanel: true,
                      });
                      queryLookup.mutate(
                        {
                          requestData: {
                            query_type: "view_in_graph",
                            id: task.task_metadata.graph_artifact_id,
                          },
                        },
                        {
                          onSuccess: (queryString) =>
                            handleViewSnapshot(
                              queryString,
                              setNavigationView,
                              setGraphSearch,
                              setGraphSearching,
                              setGraphSearchString,
                              navigate,
                              setSnapshotTime
                            ),
                        }
                      );
                      sessionStorage.page = "Enterprise Knowledge Graph";
                      break;
                    case "DIARY_COLLABORATOR":
                      navigate(task.task_metadata.url);
                      sessionStorage.page = "Investigation";
                      break;
                    case "DIARY_EVIDENCE_PANEL":
                      setShowEvidencePanel(true);
                      setSelectedEvidenceID(task.task_metadata.evidence_id);
                      setSelectedEvidencePanelTab(task.task_metadata.tab);
                      navigate(task.task_metadata.url);
                      sessionStorage.page = "Investigation";
                      break;
                  }
                }}
              >
                <p className="text-center text-base">{task.task_title}</p>
                {task.task_metadata.graph_artifact_id && (
                  <article className="grid gap-2">
                    {task.task_metadata.node_type && (
                      <img
                        src={`/graph/nodes/${task.task_metadata.integration_type.toLowerCase()}/${task.task_metadata.node_type.toLowerCase()}.svg`}
                        alt={task.task_metadata.node_type}
                        className="w-10 h-10 mx-auto"
                      />
                    )}
                    <p>{task.task_metadata.graph_artifact_id}</p>
                  </article>
                )}
                {task.task_metadata.image_url && (
                  <span
                    style={{
                      backgroundImage: `url(${task.task_metadata.image_url})`,
                    }}
                    className="mx-auto w-10 h-10 bg-no-repeat bg-cover bg-center rounded-full"
                  ></span>
                )}
                {task.task_metadata.diary_title && (
                  <p className="w-60 truncate text-ellipsis">
                    {task.task_metadata.diary_title}
                  </p>
                )}
              </motion.li>
            );
          })}
        </motion.ul>
      ) : (
        <p>You have no tasks as of now</p>
      )}
    </motion.section>
  );
};

export default NeedsAttention;
