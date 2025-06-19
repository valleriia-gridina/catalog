import { Button as MuiButton, ButtonProps } from "@mui/material";

interface TProps extends ButtonProps {
  testProp?: string;
}

const Button = ({ children, ...rest }: TProps) => {
  return <MuiButton {...rest}>{children}</MuiButton>;
};

export default Button;
