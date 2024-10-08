import ReactJson from "react-json-view";
import { convertBytes, convertToUTCString } from "src/utils/general";
import { attributeColors } from "../../constants/general";
import { useState } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AttributeValue = ({
  attribute,
  specialVal,
  propertyValues,
  setPropertyValues,
  isDiff,
}: {
  attribute: any;
  specialVal?: string;
  propertyValues?: any;
  setPropertyValues?: (propertyValues?: any) => void;
  isDiff?: boolean;
}) => {
  const [showDetails, setShowDetails] = useState<boolean>(true);

  return (
    <article className="flex flex-wrap items-start gap-2 break-all">
      {(attribute.data_type === "text" &&
        String(attribute.value).length > 300) ||
      (Array.isArray(attribute.value) &&
        attribute.value.length > 3 &&
        attribute.value.every((item: any) => typeof item !== "object")) ? (
        <button
          className="pt-[0.1rem]"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? (
            <FontAwesomeIcon icon={faChevronUp} />
          ) : (
            <FontAwesomeIcon icon={faChevronDown} />
          )}
        </button>
      ) : null}
      {![null, "N/A"].includes(attribute.value) ? (
        showDetails ? (
          <article
            className={`w-full break-all ${
              specialVal
                ? attributeColors[specialVal]
                : attributeColors[String(attribute.value).toLowerCase()] || ""
            }`}
          >
            {attribute.data_type !== "json" ? (
              attribute.data_type === "date" ? (
                convertToUTCString(Number(attribute.value))
              ) : attribute.uom === "bytes" ? (
                convertBytes(Number(attribute.value))
              ) : (
                String(attribute.value)
              )
            ) : Array.isArray(attribute.value) &&
              attribute.value.every((item: any) => typeof item !== "object") ? (
              <ul className="grid gap-1">
                {attribute.value.map((item: string) => {
                  return (
                    <li
                      key={item}
                      className={`flex items-center gap-2 ${
                        attributeColors[String(item).toLowerCase()]
                      }`}
                    >
                      {!isDiff && (
                        <input
                          type="checkbox"
                          checked={propertyValues?.includes(item)}
                          className="form-checkbox w-4 h-4 border-0 dark:focus:ring-0 dark:text-checkbox dark:focus:border-checkbox focus:ring dark:focus:ring-offset-0 dark:focus:ring-checkbox focus:ring-opacity-50"
                          onChange={() => {
                            if (setPropertyValues) {
                              if (propertyValues?.includes(item)) {
                                setPropertyValues(
                                  propertyValues.filter(
                                    (value: string) => value !== item
                                  )
                                );
                              } else
                                setPropertyValues([...propertyValues, item]);
                            }
                          }}
                        />
                      )}
                      {String(item)}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ReactJson
                src={attribute.value}
                name={null}
                quotesOnKeys={false}
                displayDataTypes={false}
                theme="harmonic"
                collapsed={2}
              />
            )}
          </article>
        ) : (
          <p className="pt-[0.15rem]">Value hidden</p>
        )
      ) : null}
    </article>
  );
};

export default AttributeValue;
