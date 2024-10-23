import { Button } from "react-bootstrap";
import styles from "./Home.module.css";
import { ModalAgregarEmpresa } from "../../modals/ModalAgregarEmpresa";
import { useState } from "react";

export const Home = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  
  return (
    <div className={styles.containerPrincipal}>
      <div className={styles.containerTitle}>
        <h1>Empresas</h1>
        <Button
          style={{ display: "flex", alignItems: "center", padding: "0.4rem" }}
          variant="dark"
          onClick={handleShow}
        >
          <span className="material-symbols-outlined">add</span>
          Agregar Empresa
        </Button>
      </div>
      <ModalAgregarEmpresa show={showModal} handleClose={handleClose} />
    </div>
  );
};
