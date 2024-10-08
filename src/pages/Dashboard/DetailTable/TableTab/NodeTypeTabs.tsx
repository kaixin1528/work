/* eslint-disable no-restricted-globals */
import { useNavigate } from "react-router-dom";
import { InfraNodeSummary } from "../../../../types/dashboard";
import { parseURL } from "../../../../utils/general";
import { useGeneralStore } from "src/stores/general";
import { GetInfraSummary } from "src/services/dashboard/infra";

const NodeTypeTabs = ({
  setSelectedNodeType,
}: {
  setSelectedNodeType: (selectedNodeType: string) => void;
}) => {
  const navigate = useNavigate();
  const parsed = parseURL();

  const { env } = useGeneralStore();

  const { data } = GetInfraSummary(env, parsed.integration);

  const nodeTypes =
    data?.cloud_infras.metadata.dash_mapping[String(parsed.category)] &&
    Object.keys(
      data.cloud_infras.metadata.dash_mapping[String(parsed.category)]
    );

  return (
    <nav className="flex items-stretch w-full text-[0.8rem] dark:text-secondary overflow-auto scrollbar">
      {nodeTypes?.map((nodeType: string) => {
        const nodeTypeName =
          data.cloud_infras.metadata.dash_mapping[String(parsed.category)][
            nodeType
          ];
        const nodeTypeCount = data?.cloud_infras.inventory.find(
          (nodeSummary: InfraNodeSummary) => nodeSummary.type === nodeTypeName
        )?.count;
        return (
          <button
            data-test="node-type-tabs"
            key={nodeType}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 ${
              parsed.node_type === nodeType
                ? "dark:text-white dark:border-signin"
                : "dark:text-checkbox dark:hover:text-white dark:border-checkbox"
            } duration-100`}
            onClick={() => {
              setSelectedNodeType(nodeType);
              navigate(
                `/dashboard/table/details?integration=${parsed.integration}&widget=infra&category=${parsed.category}&node_type=${nodeType}`
              );
            }}
          >
            <img
              src={`/graph/nodes/${
                parsed.integration
              }/${nodeType.toLowerCase()}.svg`}
              alt={String(parsed.node_type)}
              className={`mx-auto w-4 h-4 ${
                nodeType === parsed.node_type ? "clicked" : ""
              }`}
            />
            <article className="flex items-center gap-1">
              <span className="font-medium">{nodeTypeCount}</span>
              <p className="w-max">{nodeTypeName}</p>
            </article>
          </button>
        );
      })}
    </nav>
  );
};

export default NodeTypeTabs;
