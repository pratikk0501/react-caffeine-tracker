import { useState } from "react";
import Modal from "./Modal";
import Authentication from "./Authentication";
import { useAuth } from "../context/AuthContext";

function Layout(props) {
  const { children } = props;

  const [showModal, setShowModal] = useState(false);

  const { globalUser, logout } = useAuth();

  const header = (
    <header>
      <div>
        <h1 className="text-gradient">Caffeinator</h1>
        <p>For Coffee Insatiates</p>
      </div>
      {globalUser ? (
        <button onClick={logout}>
          <p>Logout</p>
        </button>
      ) : (
        <button
          onClick={() => {
            setShowModal(true);
          }}
        >
          <p>Log in here!</p>
          <i className="fa-solid fa-mug-hot"></i>
        </button>
      )}
    </header>
  );

  const footer = (
    <footer>
      <p>
        Caffeinator was made by{" "}
        <a href="https://github.com/pratikk0501" target="_blank">
          Pratik
        </a>{" "}
        using{" "}
        <a href="https://github.com/jamezmca/fantacss" target="_blank">
          FantaCSS
        </a>
        ,{" "}
        <a href="https://fontawesome.com/" target="_blank">
          Font Awesome
        </a>{" "}
        and Firebase.
      </p>
    </footer>
  );

  function handleCloseModal() {
    setShowModal(false);
  }

  return (
    <>
      {showModal && (
        <Modal handleCloseModal={handleCloseModal}>
          <Authentication handleCloseModal={handleCloseModal} />
        </Modal>
      )}
      {header}
      <main>{children}</main>
      {footer}
    </>
  );
}

export default Layout;
