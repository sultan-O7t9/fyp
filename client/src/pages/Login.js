import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading5,
  InputIcon,
} from "@material-tailwind/react";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Auth from "../layouts/Auth/Auth";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const loginHandler = () => {
    if (email === "" || password === "") {
      alert("Please fill all the fields");
      return;
    }
    setIsLoading(true);
    const data = {
      email: email,
      password: password,
    };
    console.log(data);
    setTimeout(() => {
      setIsLoading(false);
      history.push("/dashboard");
    }, 2000);
  };

  return (
    <Auth>
      <Card>
        <CardHeader color="lightBlue">
          <Heading5 color="white" style={{ marginBottom: 0 }}>
            LOGIN
          </Heading5>
        </CardHeader>

        <CardBody>
          <div className="mb-12 px-4 bg-bb">
            <InputIcon
              required={true}
              disabled={isLoading}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              color="lightBlue"
              placeholder="Email Address"
              iconName="email"
            />
          </div>
          <div className="mb-8 px-4">
            <InputIcon
              required={true}
              disabled={isLoading}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              color="lightBlue"
              placeholder="Password"
              iconName="lock"
            />
          </div>
        </CardBody>
        <CardFooter>
          <div className="flex relative justify-center bg-bb">
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <Button
                onClick={loginHandler}
                color="lightBlue"
                buttonType="filled"
                size="lg"
                ripple="dark"
              >
                Log In
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </Auth>
  );
};

export default Login;
