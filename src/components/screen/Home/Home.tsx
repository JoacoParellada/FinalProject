import { Button } from "react-bootstrap";
import styles from "./Home.module.css";
import { ModalAgregarEmpresa } from "../../modals/modalAgregarEmpresa/ModalAgregarEmpresa";
import { useState, useEffect } from "react";
import { CardEmpresa } from "../../CardEmpresa/CardEmpresa";
import { Empresa } from "../../../interfaces/Empresa";

export const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  useEffect(() => {
    const empresasGuardadas = JSON.parse(localStorage.getItem("empresas") || "[]");
    setEmpresas(empresasGuardadas);
  }, []);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleSave = (nuevaEmpresa: Empresa) => {
    const nuevasEmpresas = [...empresas, nuevaEmpresa];
    setEmpresas(nuevasEmpresas);
    localStorage.setItem("empresas", JSON.stringify(nuevasEmpresas));
  };

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
      <div>
        {empresas.map((empresa, index) => (
          <CardEmpresa key={index} empresa={empresa} />
        ))}
      </div>
      <ModalAgregarEmpresa
        show={showModal}
        handleClose={handleClose}
        onSave={handleSave}
      />
    </div>
  );
};
