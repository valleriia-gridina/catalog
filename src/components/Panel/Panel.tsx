import React from "react";
import styles from "./Panel.module.scss";

type TProps = {
  children: React.ReactNode;
};

const Panel = ({ children }: TProps) => (
  <div className={styles.panel}>{children}</div>
);

export default Panel;
