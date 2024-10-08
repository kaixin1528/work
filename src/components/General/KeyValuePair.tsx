import { convertToUTCString, isEpoch } from "src/utils/general";

const KeyValuePair = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  const isDate = isEpoch(value);

  return (
    <article className="flex items-center gap-2 break-all dark:text-white">
      <h4 className="w-max dark:text-checkbox capitalize">
        {label.replaceAll("_", " ")}:
      </h4>
      <p className="px-2 py-1 text-xs break-all dark:bg-account">
        {isDate ? convertToUTCString(Number(value)) : value}
      </p>
    </article>
  );
};

export default KeyValuePair;
