import { ChevronDownIcon } from "@heroicons/react/solid";
import { motion } from "framer-motion";
import { useState } from "react";
import { filterVariants } from "../constants/general";
import { convertToUTCString } from "src/utils/general";

const DropdownLayout: React.FC<{
  label?: string;
  value?: string | number;
  header?: boolean;
  color?: string;
  width?: string;
  placeholder?: string;
  timestamp?: boolean;
  showAbove?: boolean;
  selectedTextSize?: string;
  labelAbove?: boolean;
}> = ({
  label = "",
  value = "",
  header,
  color,
  width,
  placeholder,
  timestamp,
  showAbove,
  selectedTextSize,
  labelAbove,
  children,
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  return (
    <section
      className={`${labelAbove ? "grid" : "flex items-center"} gap-3 ${
        header ? "-mt-3" : ""
      } text-sm`}
      onMouseLeave={() => setShowDropdown(false)}
    >
      {label && (
        <h4 className="max-w-60 text-sm dark:text-checkbox">{label}</h4>
      )}
      <article
        onMouseMove={() => setShowDropdown(true)}
        className={`relative py-2 px-7 ${
          width ? width : "w-full"
        } text-left cursor-pointer ${
          color
            ? color
            : "bg-gradient-to-b dark:from-tooltip dark:to-tooltip/30"
        } focus:outline-none rounded-t-sm`}
      >
        <span className={`pr-2 break-words ${selectedTextSize || ""}`}>
          {value === ""
            ? placeholder
              ? placeholder
              : "Select"
            : timestamp
            ? convertToUTCString(Number(value))
            : value}{" "}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon className="w-3 h-3" aria-hidden="true" />
        </span>
        {showDropdown && (
          <motion.article
            variants={filterVariants}
            initial="hidden"
            animate={showDropdown ? "visible" : "hidden"}
            className={`absolute ${
              showAbove
                ? "bottom-8"
                : selectedTextSize === "text-lg"
                ? "top-11"
                : "top-8"
            }  left-0 grid content-start py-2 w-full max-h-36 ${
              color ? color : "dark:bg-tooltip"
            } focus:outline-none shadow-2xl dark:shadow-checkbox/30 overflow-auto scrollbar rounded-b-sm z-50`}
          >
            {children}
          </motion.article>
        )}
      </article>
    </section>
  );
};

export default DropdownLayout;
