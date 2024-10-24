import { FC } from "react";
import { Button, Modal } from "react-bootstrap";
import style from "./ModalAgregarEmpresa.module.css";

interface ModalAgregarEmpresaProps {
  show: boolean;
  handleClose: () => void;
}

export const ModalAgregarEmpresa: FC<ModalAgregarEmpresaProps> = ({
  show,
  handleClose,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header className={style.modalHeader}>
        <Modal.Title>Agregar Empresa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Ingrese un nombre"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Ingrese razon social"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Ingrese CUIT"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="file"
              className="form-control"
              placeholder="Ingrese una imagen"
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer className={style.modalFooter}>
        <Button
          variant="danger"
          className={style.closeButton}
          onClick={handleClose}
        >
          CERRAR
        </Button>
        <Button variant="success" className={style.confirmButton} type="submit">
          CONFIRMAR
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
