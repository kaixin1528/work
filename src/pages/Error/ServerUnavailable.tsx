/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import ErrorLayout from "../../layouts/ErrorLayout";

const ServerUnavailable: React.FC = () => {
  return (
    <ErrorLayout
      errorCode="503"
      message="Service Unavailable. Please try again..."
    />
  );
};

export default ServerUnavailable;
