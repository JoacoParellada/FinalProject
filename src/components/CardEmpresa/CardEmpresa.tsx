import { FC, useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Empresa } from "../../interfaces/Empresa";
import styles from "./CardEmpresa.module.css";
import { ModalVerEmpresa } from "../modals/ModalVerEmpresa/ModalVerEmpresa";
import { ModalEditarEmpresa } from "../modals/ModalEditarEmpresa/ModalEditarEmpresa";

interface CardEmpresaProps {
  empresa: Empresa;
}

export const CardEmpresa: FC<CardEmpresaProps> = ({ empresa }) => {
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  useEffect(() => {
    const empresasGuardadas = JSON.parse(localStorage.getItem("empresas") || "[]");
    setEmpresas(empresasGuardadas);
  }, []);

  const handleSave = (empresaEditada: Empresa) => {
    const nuevasEmpresas = empresas.map(emp => 
        emp.cuit === empresaEditada.cuit ? empresaEditada : emp
    );
    setEmpresas(nuevasEmpresas);
    localStorage.setItem("empresas", JSON.stringify(nuevasEmpresas));
};

  

  
  return (
    <Card className="m-4 p-2 bg-white">
      <Card.Body className={styles.bodyCard}>
        <Card.Title className="text-black">{empresa.nombre}</Card.Title>{" "}
        <div className={styles.containerButtons}>
          <Button
            className="d-flex align-items-center"
            onClick={() => setShowModal(true)}
            variant="warning"
          >
            <span
              className="material-symbols-outlined"
              style={{ color: "black" }}
            >
              visibility
            </span>
          </Button>
          <Button className="d-flex align-items-center" variant="primary">
            <span
              className="material-symbols-outlined"
              style={{ color: "black" }}
              onClick={() => setShowModalEdit(true)}
            >
              edit
            </span>
          </Button>
        </div>
      </Card.Body>
      <ModalVerEmpresa
        showModal={showModal}
        handleClose={() => setShowModal(false)}
        empresa={empresa}
      />

      <ModalEditarEmpresa
        show={showModalEdit}
        handleClose={() => setShowModalEdit(false)}
        onSave={handleSave}
        empresaInicial={empresa}
      />
      
    </Card>
  );
};
