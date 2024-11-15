import { FC } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { ICategorias } from "../../../types/dtos/categorias/ICategorias";

interface ModalAgregarCategoriaProps {
  show: boolean;
  handleClose: () => void;
  categoria: ICategorias | null;
  newCategoriaDenominacion: string;
  setNewCategoriaDenominacion: (denominacion: string) => void;
  onAddCategoria: () => Promise<void>;
}

export const ModalAgregarCategoria: FC<ModalAgregarCategoriaProps> = ({
  show,
  handleClose,
  categoria,
  newCategoriaDenominacion,
  setNewCategoriaDenominacion,
  onAddCategoria,
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddCategoria();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Categoría</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNombre">
            <Form.Label>Nombre de la Categoría</Form.Label>
            <Form.Control
              type="text"
              value={newCategoriaDenominacion}
              onChange={(e) => setNewCategoriaDenominacion(e.target.value)}
              required
            />
          </Form.Group>
          <div className="containerButtons" style={{ gap: "1rem" }}>
            <Button
              style={{ margin: "1rem" }}
              variant="danger"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              style={{ marginRight: "1rem" }}
              variant="success"
              type="submit"
            >
              Guardar
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
