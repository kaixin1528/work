import { faLink, faShoePrints } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { attributeColors } from "src/constants/general";
import { convertToUTCString } from "src/utils/general";

const AuditDetail = ({ activity }: { activity: any }) => {
  return (
    <section className="grid gap-2">
      <header className="flex items-center justify-between gap-10">
        <article className="flex items-center gap-2">
          <FontAwesomeIcon icon={faShoePrints} className="text-note" />
          <h4>
            <span className="font-extrabold">{activity.user}</span>{" "}
            {activity.description}
          </h4>
        </article>
        <span>{convertToUTCString(activity.timestamp)}</span>
      </header>
      <section className="flex items-start gap-10 p-4 dark:bg-filter/80 border-l-4 dark:border-signin rounded-md">
        <article className="grid gap-2">
          <h4 className="font-extrabold">Activity Type</h4>
          <span className="w-max">
            {activity.activity_type.replaceAll("_", " ")}
          </span>
        </article>
        {(Object.entries(activity.old_value).length > 0 ||
          Object.entries(activity.new_value).length > 0) && (
          <>
            <article className="grid gap-2">
              <h4 className="font-extrabold">Before</h4>
              {activity.old_value ? (
                <ul className="grid gap-1">
                  {Object.entries(activity.old_value).map((keyVal) => {
                    return (
                      <li key={keyVal[0]} className="flex items-center gap-2">
                        <h4 className="capitalize">
                          {keyVal[0].replaceAll("_", " ")}:{" "}
                        </h4>
                        <span className={`${attributeColors.after}`}>
                          {keyVal[1]}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                "N/A"
              )}
            </article>
            <article className="grid gap-2">
              <h4 className="font-extrabold">After</h4>
              {activity.new_value ? (
                <ul className="grid gap-1">
                  {Object.entries(activity.new_value).map((keyVal) => {
                    return (
                      <li key={keyVal[0]} className="flex items-center gap-2">
                        <h4 className="capitalize">
                          {keyVal[0].replaceAll("_", " ")}:{" "}
                        </h4>
                        <span className={`${attributeColors.after}`}>
                          {keyVal[1]}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                "N/A"
              )}
            </article>
          </>
        )}
      </section>
      {activity.link && (
        <a href={activity.link} className="flex items-center gap-2">
          <FontAwesomeIcon icon={faLink} className="dark:text-checkbox" /> Link
        </a>
      )}
    </section>
  );
};

export default AuditDetail;
