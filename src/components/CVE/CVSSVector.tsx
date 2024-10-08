import { GetMetadata } from "src/services/general/general";

const CVSSVector = ({ cvssVector }: { cvssVector: string[] }) => {
  const { data: cvssMetadata } = GetMetadata("cvss_vector");

  return (
    <article className="flex items-center gap-2">
      <h4 className="dark:text-checkbox">CVSS Vector:</h4>
      <ul className="flex flex-wrap items-center gap-1 break-all">
        {cvssVector?.map((metricValue: string, index: number) => {
          const metric = cvssMetadata?.find(
            (obj: { key: string }) =>
              obj.key === metricValue.split(":")[0].toLowerCase()
          )?.value;
          const value = cvssMetadata?.find(
            (obj: { key: string }) => obj.key === metricValue.toLowerCase()
          )?.value;

          return (
            <li
              key={metricValue}
              className="relative group flex items-center gap-2 cursor-pointer"
            >
              <p className="flex items-center gap-2">
                <span className="px-2 py-1 w-max dark:bg-info">
                  {metricValue}
                </span>
                {index < cvssVector.length - 1 && (
                  <span className="dark:text-checkbox">/</span>
                )}
              </p>
              {metric && value && (
                <article className="absolute top-8 left-2 hidden group-hover:block z-50">
                  <svg
                    width="23"
                    height="23"
                    viewBox="0 0 23 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.3132 22.6282L22.627 11.3145L11.3132 0.00074482L-0.000463486 11.3145L11.3132 22.6282Z"
                      fill="#23394F"
                    />
                  </svg>
                  <p className="absolute top-2 -left-2 grid gap-2 p-4 w-[15rem] dark:bg-tooltip rounded-sm">
                    {metric}: {value}
                  </p>
                </article>
              )}
            </li>
          );
        })}
      </ul>
    </article>
  );
};

export default CVSSVector;
