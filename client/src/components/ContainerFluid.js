import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import InnerAppbar from "./InnerAppbar";
import { CssBaseline } from "@mui/material";

export default function ContainerFluid(props) {
  const { children, title, appbarActions, maxWidth, ...restProps } = props;
  return (
    <>
      <CssBaseline />
      <Container maxWidth={maxWidth ? maxWidth : "md"} {...restProps}>
        <InnerAppbar title={title} actions={appbarActions} />
        <Box>{children}</Box>
      </Container>
    </>
  );
}
