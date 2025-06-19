import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <>
      <h1>Page is not found</h1>
      <Link to="/">Back to home page</Link>
    </>
  );
};

export default ErrorPage;
