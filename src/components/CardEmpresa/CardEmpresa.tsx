import { FC, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Empresa } from "../../interfaces/Empresa";
import styles from "./CardEmpresa.module.css";
import { ModalVerEmpresa } from "../modals/ModalVerEmpresa/ModalVerEmpresa";

interface CardEmpresaProps {
  empresa: Empresa;
}

export const CardEmpresa: FC<CardEmpresaProps> = ({ empresa }) => {
  const [showModal, setShowModal] = useState(false);

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
    </Card>
  );
};
