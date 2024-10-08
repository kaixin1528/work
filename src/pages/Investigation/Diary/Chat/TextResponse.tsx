import React from "react";

const TextResponse = ({ message }: { message: any }) => {
  return (
    <p className="flex items-center gap-1 p-2 max-w-[30rem] rounded-md">
      {message.response}
    </p>
  );
};

export default TextResponse;
