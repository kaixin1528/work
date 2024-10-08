/* eslint-disable no-restricted-globals */
import ExpandedViewLayout from "../../../../../layouts/ExpandedViewLayout";

const CNS = ({ selectedNodeID }: { selectedNodeID: string }) => {
  return (
    <ExpandedViewLayout selectedNodeID={selectedNodeID}>
      <p className="dark:text-white mx-auto">No data available</p>
    </ExpandedViewLayout>
  );
};

export default CNS;
