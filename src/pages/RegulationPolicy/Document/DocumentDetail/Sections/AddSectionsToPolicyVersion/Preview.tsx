import React from "react";

const Preview = ({
  selectedAddedSections,
}: {
  selectedAddedSections: any[];
}) => {
  return (
    <section className="grid gap-3">
      <h4 className="text-lg underlined-label">Preview</h4>
      <ul className="flex flex-col flex-grow gap-3 text-base max-h-[20rem] overflow-auto scrollbar">
        {selectedAddedSections.map((section) => {
          return (
            <li
              key={section.index}
              className="grid gap-3 p-4 bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 rounded-2xl"
            >
              <h4>Section number: {section.section_number}</h4>
              <p className="p-3 break-words dark:bg-black/60 rounded-md">
                {section.content}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Preview;
