import { FC, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { IEmpresa } from "../../types/dtos/empresa/IEmpresa";
import styles from "./CardEmpresa.module.css";
import { ModalVerEmpresa } from "../modals/ModalVerEmpresa/ModalVerEmpresa";
import { ModalEditarEmpresa } from "../modals/ModalEditarEmpresa/ModalEditarEmpresa";

interface CardEmpresaProps {
  empresa: IEmpresa;
}

export const CardEmpresa: FC<CardEmpresaProps> = ({ empresa }) => {
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);

  const handleSave = (empresaEditada: IEmpresa) => {
    // Implement the logic to update the empresa
    console.log("Empresa editada:", empresaEditada);
  };

  return (
    <Card className="m-4 p-2 bg-white">
      <Card.Body className={styles.bodyCard}>
        <Card.Title className="text-black">{empresa.nombre}</Card.Title>
        <div className={styles.containerButtons}>
          <Button
            className="d-flex align-items-center"
            onClick={() => setShowModal(true)}
            variant="warning"
          >
            <span className="material-symbols-outlined" style={{ color: "black" }}>
              visibility
            </span>
          </Button>
          <Button className="d-flex align-items-center" variant="primary" onClick={() => setShowModalEdit(true)}>
            <span className="material-symbols-outlined" style={{ color: "black" }}>
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