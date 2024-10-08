/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "src/utils/general";

const ErrorLayout: React.FC<{ errorCode: string; message?: string }> = ({
  errorCode,
  message,
}) => {
  const navigate = useNavigate();
  const accessToken = getAccessToken();

  useEffect(() => {
    navigate(`/${errorCode}`);
  }, []);

  return (
    <section className="grid gap-2 justify-center content-center h-screen w-screen dark:text-white bg-gradient-to-b dark:from-main dark:via-gradient dark:to-main">
      <img
        src={`/errors/${errorCode}.svg`}
        alt={errorCode}
        className="w-[40rem] h-96"
      />
      {message && (
        <span className="grid justify-center content-center">{message}</span>
      )}
      <button
        className="grid justify-center content-center mt-5 mx-auto py-2 px-4 font-extralight dark:text-signin dark:hover:text-signin/70 border-1 dark:border-signin dark:hover:border-sigin/70"
        onClick={() => {
          if (accessToken !== "") navigate(-1);
          else navigate("/signin");
        }}
      >
        Return
      </button>
    </section>
  );
};

export default ErrorLayout;
