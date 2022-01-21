import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading5,
  InputIcon,
} from "@material-tailwind/react";
import React from "react";
import Auth from "../layouts/Auth/Auth";

const Login = () => {
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
              type="email"
              color="lightBlue"
              placeholder="Email Address"
              iconName="email"
            />
          </div>
          <div className="mb-8 px-4">
            <InputIcon
              type="password"
              color="lightBlue"
              placeholder="Password"
              iconName="lock"
            />
          </div>
        </CardBody>
        <CardFooter>
          <div className="flex justify-center bg-bb">
            <Button
              color="lightBlue"
              buttonType="filled"
              size="lg"
              ripple="dark"
            >
              Log In
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Auth>
  );
};

export default Login;
