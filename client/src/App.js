import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [helloWorld, setHelloWorld] = useState("");

  const getHelloWorldHandler = async () => {
    const response = await axios.get("http://localhost:8080/");
    setHelloWorld(response.data.msg);
  };

  useEffect(() => {
    getHelloWorldHandler();
  }, []);

  return (
    <div className="App">
      <h1>{helloWorld}</h1>
    </div>
  );
};

export default App;
