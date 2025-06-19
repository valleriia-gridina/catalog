import { Button } from "@mui/material";
import styles from "./PageTitle.module.scss";

type TProps = {
  title: string;
  btnText?: string | null;
  onBtnClick?: () => void;
};

const PageTitle = ({ title, btnText, onBtnClick }: TProps) => (
  <div className={styles.title}>
    <h1>{title}</h1>
    {btnText && (
      <Button variant="contained" onClick={onBtnClick}>
        {btnText}
      </Button>
    )}
  </div>
);

export default PageTitle;
