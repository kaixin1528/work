const ScoreKeyPair = ({ label, value }: { label: string; value: number }) => {
  return (
    <article className="flex items-center gap-2">
      <h4 className="dark:text-checkbox">{label}:</h4>
      <span
        className={`py-2 px-4 text-xs ${
          value > 3.3
            ? value > 6.7
              ? "bg-critical"
              : "text-black bg-medium"
            : "text-black bg-low"
        } rounded-md`}
      >
        {value}
      </span>
    </article>
  );
};

export default ScoreKeyPair;
