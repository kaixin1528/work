/* eslint-disable no-restricted-globals */
import React from "react";
import ViewInGraph from "src/components/Button/ViewInGraph";

const ExpandedViewLayout: React.FC<{ selectedNodeID: string }> = ({
  selectedNodeID,
  children,
}) => {
  return (
    <section className="grid gap-5">
      <header className="justify-self-end dark:text-checkbox">
        <ViewInGraph
          requestData={{
            query_type: "view_in_graph",
            id: selectedNodeID,
          }}
        />
      </header>
      {children}
    </section>
  );
};

export default ExpandedViewLayout;
