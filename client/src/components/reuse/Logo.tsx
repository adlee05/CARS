import "./logo.css";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <>
      <Link to="/">
        <h1 className="logo-h1 text-2xl">Curatr</h1>
      </Link>
    </>
  );
}
