/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import ErrorLayout from "../../layouts/ErrorLayout";

const NotFound: React.FC = () => {
  return <ErrorLayout errorCode="404" message="page not found" />;
};

export default NotFound;
