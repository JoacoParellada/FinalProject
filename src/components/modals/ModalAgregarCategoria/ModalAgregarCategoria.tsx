import { FC } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface ModalAgregarCategoriaProps {
  show: boolean;
  onHide: () => void;
  onSave: (denominacion: string) => void; // Cambiamos la función para recibir solo la denominación
  denominacion: string; // La denominación de la nueva categoría
  setDenominacion: (denominacion: string) => void; // Función para actualizar la denominación
}

export const ModalAgregarCategoria: FC<ModalAgregarCategoriaProps> = ({
  show,
  onHide,
  onSave,
  denominacion,
  setDenominacion,
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Categoría</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formDenominacion">
            <Form.Label>Denominación</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese la denominación"
              value={denominacion}
              onChange={(e) => setDenominacion(e.target.value)}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="success" onClick={() => onSave(denominacion)}>
          Agregar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
