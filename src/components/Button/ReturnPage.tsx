/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ReturnPage = () => {
  const navigate = useNavigate();

  const handleNavigateBack = () => {
    switch (window.location.pathname) {
      case "/dashboard/table/details":
        navigate("/dashboard/summary");
        break;
      case "/dashboard/en/details":
        navigate("/dashboard/summary");
        break;
      case "/summaries/details":
        if (
          window.location.href.includes("&") &&
          !window.location.href.includes("vulnerability_summary_lineage")
        )
          navigate(-1);
        else navigate("/summaries/summary");
        break;
      case "/investigation/diary/details":
        navigate("/investigation/summary");
        break;
      case "/business-continuity/sop/details":
        if (window.location.href.includes("sop_version_id"))
          navigate("/business-continuity/summary");
        else navigate(-1);
        break;
      case "/regulation-policy/document/details":
        if (window.location.href.includes("policy_version_id"))
          navigate("/regulation-policy/summary");
        else navigate(-1);
        break;
      case "/grc/mapping":
        sessionStorage.clicked_mapping = "true";
        navigate(-1);
        break;
      default:
        if (sessionStorage.clicked_mapping)
          sessionStorage.removeItem("clicked_mapping");
        navigate(-1);
    }
  };

  useEffect(() => {
    // navigate to previous page if press escape
    const handleBackSpace = (event: {
      [x: string]: any;
      key: string;
      preventDefault: () => void;
    }) => {
      if (event.key === "Backspace" && !event.target.type.includes("text")) {
        event.preventDefault();
        handleNavigateBack();
      }
    };
    document.addEventListener("keydown", handleBackSpace);
    return () => {
      document.removeEventListener("keydown", handleBackSpace);
    };
  }, []);

  return (
    <button
      className="flex gap-2 items-center w-max tracking-wide text-xs dark:text-checkbox dark:hover:text-checkbox/50 duration-100"
      onClick={handleNavigateBack}
    >
      <FontAwesomeIcon icon={faArrowRotateLeft} />
      BACK
    </button>
  );
};

export default ReturnPage;
