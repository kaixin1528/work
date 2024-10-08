import { MouseEventHandler } from "react";

const TestButton = ({
  disabled,
  handleOnClick,
}: {
  disabled: boolean;
  handleOnClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      onClick={handleOnClick}
      className="grid py-2 px-16 mt-3 text-sm mx-auto gradient-button rounded-sm"
    >
      Test Credentials
    </button>
  );
};

export default TestButton;
