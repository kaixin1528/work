import React from "react";

const SeverityKeyPair = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <article className="flex items-center gap-2">
      <h4 className="dark:text-checkbox">{label}:</h4>
      <span
        className={`py-2 px-4 text-xs ${
          value === "COMPLETE"
            ? "text-black bg-contact"
            : value === "HIGH"
            ? "bg-critical"
            : value === "MEDIUM"
            ? "bg-medium"
            : "text-black bg-low"
        } rounded-md`}
      >
        {value}
      </span>
    </article>
  );
};

export default SeverityKeyPair;
