const Branches = ({
  selectedRepo,
  branches,
  selectedBranch,
  setSelectedBranch,
}: {
  selectedRepo: string;
  branches: string[];
  selectedBranch: string;
  setSelectedBranch: (selectedBranch: string) => void;
}) => {
  return (
    <section className="grid content-start gap-4 w-max overflow-auto scrollbar">
      <h4 className="w-max">Branches in {selectedRepo}</h4>
      <ul className="flex flex-wrap items-center gap-2 text-sm overflow-auto scrollbar">
        {branches.length > 0 ? (
          branches.map((branch: string) => {
            return (
              <li
                key={branch}
                className={`flex items-center justify-between gap-10 px-4 py-2 cursor-pointer ${
                  selectedBranch === branch
                    ? "w-max selected-button rounded-sm"
                    : "border-none dark:hover:bg-signin/30 duration-100"
                }`}
                onClick={() => setSelectedBranch(branch)}
              >
                {branch}
              </li>
            );
          })
        ) : (
          <p>No branches found</p>
        )}
      </ul>
    </section>
  );
};

export default Branches;
