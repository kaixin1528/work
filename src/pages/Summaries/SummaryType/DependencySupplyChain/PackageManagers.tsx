const PackageManagers = ({
  selectedBranch,
  packageManagers,
  selectedPackageManager,
  setSelectedPackageManager,
}: {
  selectedBranch: string;
  packageManagers: string[];
  selectedPackageManager: string;
  setSelectedPackageManager: (selectedPackageManager: string) => void;
}) => {
  return (
    <section className="grid content-start gap-4 w-max overflow-auto scrollbar">
      <h4 className="w-max">Package managers in {selectedBranch} branch</h4>
      <ul className="flex flex-wrap items-center gap-2 text-sm overflow-auto scrollbar">
        {packageManagers.length > 0 ? (
          packageManagers.map((packageManager: string) => {
            return (
              <li
                key={packageManager}
                className={`px-4 py-2 cursor-pointer ${
                  selectedPackageManager === packageManager
                    ? "w-max selected-button rounded-sm"
                    : "border-none dark:hover:bg-signin/30 duration-100"
                }`}
                onClick={() => setSelectedPackageManager(packageManager)}
              >
                <img
                  src={`/summaries/dependency/${packageManager.toLowerCase()}.svg`}
                  alt={packageManager}
                  className="w-7 h-7"
                />
              </li>
            );
          })
        ) : (
          <p>No package managers found</p>
        )}
      </ul>
    </section>
  );
};

export default PackageManagers;
