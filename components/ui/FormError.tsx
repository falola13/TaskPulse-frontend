import React from "react";

type FormErrorProps = {
  message: string;
};
const FormError = ({ message }: FormErrorProps) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 text-sm mt-2 px-4 py-2 rounded-md ">
      {message}
    </div>
  );
};

export default FormError;
