import { FC, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { IEmpresa } from "../../../types/dtos/empresa/IEmpresa";

interface ModalAgregarEmpresaProps {
  show: boolean;
  handleClose: () => void;
  onSave: (empresa: IEmpresa) => void;
}

export const ModalAgregarEmpresa: FC<ModalAgregarEmpresaProps> = ({
  show,
  handleClose,
  onSave,
}) => {
  const [nuevaEmpresa, setNuevaEmpresa] = useState<IEmpresa>({
    id: 0, // This will be set by the backend
    nombre: "",
    razonSocial: "",
    cuit: "",
    logo: "",
    sucursales: [],
    pais: null,
    
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevaEmpresa((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setNuevaEmpresa((prev) => ({ ...prev, logo: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(nuevaEmpresa);
    handleClose();
    // Reset form
    setNuevaEmpresa({
      id: 0,
      nombre: "",
      razonSocial: "",
      cuit: "",
      logo: null,
      sucursales: [],
      pais: null,
    });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nueva Empresa</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={nuevaEmpresa.nombre}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Razón Social</Form.Label>
            <Form.Control
              type="text"
              name="razonSocial"
              value={nuevaEmpresa.razonSocial}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>CUIT</Form.Label>
            <Form.Control
              type="text"
              name="cuit"
              value={nuevaEmpresa.cuit}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Logo</Form.Label>
            <Form.Control
              type="file"
              onChange={handleImageChange}
              accept="image/*"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};