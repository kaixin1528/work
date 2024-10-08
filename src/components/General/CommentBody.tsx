import parse from "html-react-parser";

export const CommentBody = ({
  text,
  userEmails,
}: {
  text: string;
  userEmails: string[];
}) => {
  return (
    <section className="grid gap-4 mx-2 p-4 text-[0.83rem] leading-5 bg-gradient-to-b dark:from-expand dark:to-expand/60">
      {text.includes("<div>")
        ? parse(text || "")
        : text.split("\n").map((paragraph, index) => {
            return (
              <article
                key={index}
                className="flex flex-wrap items-center gap-1"
              >
                {paragraph.split(" ").map((word, i) => {
                  const filteredWord = word.replace("@", "");
                  return userEmails?.includes(filteredWord) ? (
                    <span key={i} className="dark:text-signin">
                      {word.replace("@", "")}
                    </span>
                  ) : (
                    <span key={i}>{word}</span>
                  );
                })}
              </article>
            );
          })}
    </section>
  );
};
