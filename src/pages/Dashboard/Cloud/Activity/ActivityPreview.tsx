/* eslint-disable no-restricted-globals */
import { useNavigate } from "react-router-dom";

const ActivityPreview = ({ integration }: { integration: string }) => {
  const navigate = useNavigate();

  return (
    <section
      className="grid p-4 z-50 cursor-pointer dark:text-white font-light dark:bg-card black-shadow"
      onClick={() =>
        navigate(`/dashboard/activity/details?integration=${integration}`)
      }
    >
      <h4>Activity</h4>
    </section>
  );
};

export default ActivityPreview;
