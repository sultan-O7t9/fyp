import React from "react";

const Auth = props => {
  const { children } = props;

  return (
    <div className="bg-login-background bg-cover bg-center w-screen h-screen relative flex flex-col items-center justify-center">
      <div className="max-w-sm w-96 justify-center">{children}</div>
    </div>
  );
};

export default Auth;
