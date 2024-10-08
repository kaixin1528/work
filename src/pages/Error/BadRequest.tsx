/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import ErrorLayout from "../../layouts/ErrorLayout";

const BadRequest: React.FC = () => {
  return <ErrorLayout errorCode="400" />;
};

export default BadRequest;
