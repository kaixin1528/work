const TableLayout: React.FC<{
  fullHeight?: boolean;
  height?: string;
  flexibleHeaders?: boolean;
}> = ({ fullHeight, height, flexibleHeaders, children }) => {
  return (
    <section
      className={`flex flex-col flex-grow w-full ${
        fullHeight ? "" : height ? height : "max-h-[50rem]"
      } text-[0.8rem] dark:bg-card overflow-auto scrollbar`}
    >
      <table
        className={`w-full h-full table-auto ${
          flexibleHeaders ? "" : "md:table-fixed"
        }  overflow-auto`}
      >
        {children}
      </table>
    </section>
  );
};

export default TableLayout;
