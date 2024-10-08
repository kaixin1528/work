/* eslint-disable no-restricted-globals */

const NumericFilter = ({
  label,
  value,
  setValue,
  max,
}: {
  label?: string;
  value: number;
  setValue: (value: number) => void;
  max?: number;
}) => {
  return (
    <section className="flex items-center gap-3 text-sm dark:text-white">
      <h4>{label}</h4>
      <article className="flex items-center gap-2 dark:text-white">
        <button
          disabled={value < 2}
          className="px-1 dark:disabled:text-filter dark:bg-signin/30 dark:disabled:bg-filter/30 dark:disabled:border-filter border dark:border-signin dark:hover:border-signin/60 duration-100 rounded-sm"
          onClick={() => setValue(value - 1)}
        >
          -
        </button>
        <input
          type="input"
          inputMode="numeric"
          value={value}
          onChange={(e) => {
            if ((max && Number(e.target.value) < max) || !max)
              setValue(Number(e.target.value));
          }}
          className="px-2 w-12 h-5 text-center dark:disabled:text-filter dark:bg-signin/30 dark:disabled:bg-filter/30 focus:outline-none"
        />
        <button
          disabled={max ? value >= max : false}
          className="px-1 dark:disabled:text-filter dark:bg-signin/30 dark:disabled:bg-filter/30 dark:disabled:border-filter border dark:border-signin dark:hover:border-signin/60 duration-100 rounded-sm"
          onClick={() => {
            if ((max && value < max) || !max) setValue(value + 1);
          }}
        >
          +
        </button>
      </article>
    </section>
  );
};

export default NumericFilter;
