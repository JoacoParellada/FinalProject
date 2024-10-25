import { Modal } from "react-bootstrap";
import { Empresa } from "../../../interfaces/Empresa";
import { FC } from "react";

interface ModalVerEmpresaProps {
  showModal: boolean;
  handleClose: () => void;
  empresa: Empresa;
}

export const ModalVerEmpresa: FC<ModalVerEmpresaProps> = ({
  showModal,
  handleClose,
  empresa,
}) => {
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{empresa.nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Razón Social: {empresa.razonSocial}</p>
        <p>CUIT: {empresa.cuit}</p>
        {empresa.logo && (
          <img src={empresa.logo} alt="Logo" style={{ width: "100%" }} />
        )}
      </Modal.Body>
    </Modal>
  );
};
