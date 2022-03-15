import { Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Link = props => {
  const { children, style, ...linkProps } = props;

  return (
    <MuiLink
      component={RouterLink}
      {...linkProps}
      style={{ textDecoration: "none", ...style }}
    >
      {children}
    </MuiLink>
  );
};

export default Link;
