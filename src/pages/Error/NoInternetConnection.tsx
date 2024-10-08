/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ErrorLayout from "../../layouts/ErrorLayout";

const NoInternetConnection: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/graph/summary");
    }, 3000);
  }, []);

  return <ErrorLayout errorCode="502" message="Oops! something went wrong" />;
};

export default NoInternetConnection;
