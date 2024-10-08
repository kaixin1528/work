/* eslint-disable react-hooks/exhaustive-deps */

const Columns = ({
  label,
  headers,
  sheet,
  markedAsQuestionCol,
  setMarkedAsQuestionCol,
  markedAsAnswerCol,
  setMarkedAsAnswerCol,
}: {
  label: string;
  headers: any;
  sheet: any;
  markedAsQuestionCol: any;
  setMarkedAsQuestionCol: any;
  markedAsAnswerCol: any;
  setMarkedAsAnswerCol: any;
}) => {
  const filteredHeaders = headers[sheet];

  return (
    <section className="grid content-start gap-3 overflow-auto scrollbar">
      <h4 className="full-underlined-label">{label} Columns</h4>
      <ul className="grid content-start gap-1 h-[3rem] overflow-auto scrollbar">
        {filteredHeaders?.map((col: string, colIndex: number) => {
          if (col === "--row_id--" || col === "") return null;
          const markedAsQuestion = markedAsQuestionCol[sheet] === colIndex;
          const markedAsAnswer = markedAsAnswerCol[sheet] === colIndex;
          return (
            <li
              key={colIndex}
              className="flex items-center gap-5 text-left font-semibold"
            >
              {colIndex}. {col}
              <article className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={markedAsQuestion}
                  onChange={() => {
                    setMarkedAsQuestionCol({
                      ...markedAsQuestionCol,
                      [sheet]: colIndex,
                    });
                    if (markedAsAnswerCol[sheet] === colIndex)
                      setMarkedAsAnswerCol({
                        ...markedAsAnswerCol,
                        [sheet]: -1,
                      });
                  }}
                  className="form-radio w-4 h-4 dark:ring-0 dark:text-signin dark:focus:border-signin focus:ring dark:focus:ring-offset-0 dark:focus:ring-signin focus:ring-opacity-50 rounded-full"
                />
                <label htmlFor="">Questions?</label>
              </article>
              <article className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={markedAsAnswer}
                  onChange={() => {
                    setMarkedAsAnswerCol({
                      ...markedAsAnswerCol,
                      [sheet]: colIndex,
                    });
                    if (markedAsQuestionCol[sheet] === colIndex)
                      setMarkedAsQuestionCol({
                        ...markedAsQuestionCol,
                        [sheet]: -1,
                      });
                  }}
                  className="form-radio w-4 h-4 dark:ring-0 dark:text-signin dark:focus:border-signin focus:ring dark:focus:ring-offset-0 dark:focus:ring-signin focus:ring-opacity-50 rounded-full"
                />
                <label htmlFor="">Answers?</label>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Columns;
