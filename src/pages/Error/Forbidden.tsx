/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import ErrorLayout from "../../layouts/ErrorLayout";

const Forbidden: React.FC = () => {
  return <ErrorLayout errorCode="403" message="access forbidden" />;
};

export default Forbidden;
