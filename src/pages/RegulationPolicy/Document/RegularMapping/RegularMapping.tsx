import React, { useState } from "react";
import MappedGraph from "./MappedGraph";
import ReturnPage from "src/components/Button/ReturnPage";
import PageLayout from "src/layouts/PageLayout";
import { motion } from "framer-motion";
import { showVariants } from "src/constants/general";
import {
  faArrowRightLong,
  faDiagramProject,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MappedTable from "./MappedTable/MappedTable";
import { GetGRCMapping } from "src/services/grc";
import Loader from "src/components/Loader/Loader";
import MappingFilter from "./MappingFilter";
import { useNodesState } from "reactflow";
import NewMapping from "./NewMapping";

const RegularMapping = () => {
  const [filters, setFilters] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState("graph");
  const [selectedMappingType, setSelectedType] = useState(
    sessionStorage.mapping_type
  );
  const [nodes, setNodes, onNodesChange] = useNodesState([]);

  const documentType = sessionStorage.document_type || "";
  const documentTab = sessionStorage.document_tab || "";
  const documentID = sessionStorage.document_id || "";
  const generatedID = sessionStorage.generated_id || "";
  const documentName = sessionStorage.document_name || "";
  const policyID = sessionStorage.policy_id || "";
  const auditID = sessionStorage.audit_id || "";
  const isPolicy = documentType === "policies";

  const { data: mapping, status: mappingStatus } = GetGRCMapping(
    documentType,
    documentTab,
    documentID,
    generatedID,
    auditID,
    selectedMappingType,
    policyID
  );

  return (
    <PageLayout>
      <motion.main
        variants={showVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col flex-grow content-start gap-5 p-4 w-full h-full overflow-auto scrollbar"
      >
        <header className="flex items-center gap-5">
          <ReturnPage />
          <h3 className="flex flex-wrap items-center gap-2 text-lg">
            Mapping <FontAwesomeIcon icon={faArrowRightLong} /> {documentName}
          </h3>
        </header>
        <nav className="flex items-center gap-2 mx-auto">
          {["graph", "table"].map((view) => (
            <button
              key={view}
              className={`flex items-center gap-2 px-20 py-1 capitalize ${
                selectedFormat === view
                  ? "selected-button"
                  : "dark:hover:bg-signin/30"
              } `}
              onClick={() => setSelectedFormat(view)}
            >
              <FontAwesomeIcon
                icon={view === "graph" ? faDiagramProject : faTable}
                className="dark:text-checkbox"
              />
              <h4>{view}</h4>
            </button>
          ))}
        </nav>
        {!isPolicy && (
          <nav className="flex items-center gap-2 mx-auto text-sm">
            {["Policy", "Relevant Sections", "RFS"].map((type) => {
              if (
                (documentType === "internal-audit" &&
                  ["Policy", "RFS"].includes(type)) ||
                (documentType === "third-party" &&
                  documentTab === "Controls Coverage" &&
                  ["Policy"].includes(type)) ||
                (documentType === "third-party" &&
                  documentTab === "Audit Report" &&
                  ["Policy", "Relevant Sections"].includes(type)) ||
                (documentTab === "Sections" && type === "Relevant Sections")
              )
                return null;
              return (
                <button
                  key={type}
                  className={`px-3 py-1 capitalize ${
                    sessionStorage.mapping_type === type
                      ? "full-underlined-label"
                      : "dark:hover:border-b dark:hover:border-signin"
                  }`}
                  onClick={() => {
                    sessionStorage.mapping_type = type;
                    setSelectedType(type);
                    setFilters([]);
                  }}
                >
                  {documentTab === "Audit Report"
                    ? "Mapped To Framework"
                    : type === "Relevant Sections"
                    ? "Relevant Sections"
                    : type === "RFS"
                    ? "Overlaps with Framework"
                    : `Mapped to ${type}`}
                </button>
              );
            })}
          </nav>
        )}
        <article className="flex items-center gap-10 text-sm">
          <MappingFilter
            mapping={mapping?.data}
            nodes={nodes}
            filters={filters}
            setFilters={setFilters}
          />
          <NewMapping selectedType={selectedMappingType} />
        </article>
        {mappingStatus === "loading" ? (
          <Loader />
        ) : selectedFormat === "graph" ? (
          <MappedGraph
            mapping={mapping}
            mappingStatus={mappingStatus}
            selectedFormat={selectedFormat}
            nodes={nodes}
            setNodes={setNodes}
            onNodesChange={onNodesChange}
            filters={filters}
          />
        ) : (
          <MappedTable mapping={mapping} filters={filters} />
        )}
      </motion.main>
    </PageLayout>
  );
};

export default RegularMapping;
