import { Button, Modal } from "react-bootstrap";
import { FC } from "react";
import { ISucursal } from "../../../types/dtos/sucursal/ISucursal";

interface ModalVerSucursalProps {
  show: boolean;
  handleClose: () => void;
  sucursal: ISucursal | null; // Asegúrate de que sucursal puede ser null
}

export const ModalVerSucursal: FC<ModalVerSucursalProps> = ({
  show,
  handleClose,
  sucursal,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{sucursal ? sucursal.nombre : "Sucursal"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {sucursal ? (
          <>
            <p>
              <strong>Horario Apertura:</strong> {sucursal.horarioApertura}
            </p>
            <p>
              <strong>Horario Cierre:</strong> {sucursal.horarioCierre}
            </p>
            <p>
              <strong>Dirección:</strong> {sucursal.domicilio.calle}{" "}
              {sucursal.domicilio.numero}, {sucursal.domicilio.cp}
            </p>
            {sucursal.logo && (
              <img
                src={sucursal.logo}
                alt="Logo de Sucursal"
                style={{ width: "100%" }}
              />
            )}
          </>
        ) : (
          <p>No hay información disponible.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
