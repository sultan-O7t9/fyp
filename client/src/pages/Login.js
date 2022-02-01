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
import { EMAIL, PASSWORD } from "../constants";
import { AuthLayout } from "../layouts";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const onSubmitLoginHandler = event => {
    event.preventDefault();
    // if (email === "" || password === "") {
    //   alert("Please fill all the fields");
    //   return;
    // }
    setIsLoading(true);
    const data = {
      email: email,
      password: password,
    };
    console.log(data);
    setTimeout(() => {
      setIsLoading(false);
      history.replace("/dashboard");
    }, 2000);
  };

  return (
    <AuthLayout>
      <Card>
        <CardHeader color="lightBlue">
          <Heading5 color="white" style={{ marginBottom: 0 }}>
            LOGIN
          </Heading5>
        </CardHeader>
        <form onSubmit={onSubmitLoginHandler}>
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
                pattern={EMAIL}
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
                max={15}
                min={6}
                maxLength={15}
                pattern={PASSWORD}
              />
            </div>
          </CardBody>
          <CardFooter>
            <div className="flex relative justify-center bg-bb">
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <Button
                  // onClick={loginHandler}
                  type="submit"
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
        </form>
      </Card>
    </AuthLayout>
  );
};

export default Login;
