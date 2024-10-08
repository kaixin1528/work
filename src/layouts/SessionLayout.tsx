import UnoLogo from "../components/General/UnoLogo";

const SessionLayout: React.FC = ({ children }) => {
  return (
    <section
      tabIndex={0}
      className="grid content-center w-screen h-screen text-center dark:text-white dark:bg-card"
    >
      <section className="grid gap-5 w-3/5 lg:w-2/6 mx-auto">
        <UnoLogo />
        {children}
      </section>
    </section>
  );
};

export default SessionLayout;
