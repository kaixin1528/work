import { faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Sort } from "src/types/dashboard";
import { handleSort } from "src/utils/general";

const SortColumn = ({
  propertyName,
  setSort,
}: {
  propertyName: string;
  setSort: (sort: Sort) => void;
}) => {
  return (
    <button aria-label="sort">
      <FontAwesomeIcon
        icon={faSort}
        className="mt-0.5 dark:text-secondary"
        onClick={() => handleSort(propertyName, setSort)}
      />
    </button>
  );
};

export default SortColumn;
