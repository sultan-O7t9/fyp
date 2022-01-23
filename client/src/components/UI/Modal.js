import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading6,
  InputIcon,
  Paragraph,
} from "@material-tailwind/react";
import React from "react";

const Modal = ({ showModal, actions, title, children }) => {
  return (
    showModal && (
      <Card>
        <CardHeader color="lightBlue">
          <Heading6 color="white" style={{ marginBottom: 0 }}>
            {title}
          </Heading6>
        </CardHeader>

        <CardBody>
          <Paragraph color={"blueGray"}>{children}</Paragraph>
        </CardBody>
        <CardFooter>
          {actions &&
            actions.map(action => (
              <Button
                key={action.color + action.label}
                color={action.color}
                buttonType="filled"
                size="regular"
                ripple="dark"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
        </CardFooter>
      </Card>
    )
  );
};

export default Modal;
