/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import ErrorLayout from "../../layouts/ErrorLayout";

const InternalServer: React.FC = () => {
  return <ErrorLayout errorCode="500" message="Please try again later..." />;
};

export default InternalServer;
