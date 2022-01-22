import React from "react";

export default function FormPage(props) {
  const { children } = props;
  return (
    <>
      <div className="bg-light-blue-500 pt-14 pb-28 px-3 md:px-8 h-auto">
        <div className="container mx-auto max-w-full"></div>
      </div>

      <div className="px-3 md:px-8 h-auto -mt-24">
        <div className="container mx-auto max-w-full">
          <div className="grid grid-cols-1 xl:grid-cols-1">
            <div className="col-start-1 col-end-2 px-4 mb-16">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
