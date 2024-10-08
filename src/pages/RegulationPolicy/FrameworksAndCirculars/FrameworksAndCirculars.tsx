import React, { useState } from "react";
import Documents from "./Documents";

const FrameworksAndCirculars = () => {
  const [selectedDocumentType, setSelectedDocumentType] =
    useState<string>("frameworks");

  return (
    <section className="flex flex-col flex-grow gap-5">
      <nav className="flex flex-wrap items-center gap-5">
        {["frameworks", "circulars"].map((tab) => {
          return (
            <button
              key={tab}
              className={`px-8 py-2 text-center capitalize border-b-2 ${
                selectedDocumentType === tab
                  ? "dark:bg-signin/30 dark:border-signin"
                  : "dark:bg-filter/10 dark:hover:bg-filter/30 duration-100 dark:border-checkbox"
              } rounded-full`}
              onClick={() => setSelectedDocumentType(tab)}
            >
              {tab}
            </button>
          );
        })}
      </nav>
      <Documents documentType={selectedDocumentType} />
    </section>
  );
};

export default FrameworksAndCirculars;
