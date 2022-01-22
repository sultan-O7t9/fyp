import React from "react";
import LoadingSpinner from "../../components/UI/LoadingSpinner";

const Home = () => {
  return (
    <div className="h-full w-full flex- flex-row justify-center items-center">
      <h1>Dashboard home</h1>
      <LoadingSpinner />
    </div>
  );
};

export default Home;
