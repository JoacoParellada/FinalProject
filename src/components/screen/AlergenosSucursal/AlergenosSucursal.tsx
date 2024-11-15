import { FC, useEffect, useState } from "react";
import { Button, ListGroup, Modal, Form } from "react-bootstrap";
import styles from "./AlergenosSucursal.module.css";
import { ISucursal } from "../../../types/dtos/sucursal/ISucursal";
import { AlergenoService } from "../../../services/AlergenoService";
import { IAlergenos } from "../../../types/dtos/alergenos/IAlergenos";

// Definición de la interfaz para los props
interface TablaAlergenosProps {
  sucursal: ISucursal | null;
  onSelect: () => void;
}

export const AlergenosSucursal: FC<TablaAlergenosProps> = () => {
  const [alergenos, setAlergenos] = useState<IAlergenos[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newAlergenoNombre, setNewAlergenoNombre] = useState("");
  const [editingAlergeno, setEditingAlergeno] = useState<IAlergenos | null>(
    null
  );

  const alergenoService = new AlergenoService();

  // Función para obtener todos los alérgenos desde la API
  const fetchAllAlergenos = async () => {
    try {
      const data = await alergenoService.getAllAlergenos();
      setAlergenos(data);
    } catch (error) {
      console.log("Error fetching alergenos:", error);
    }
  };

  // Función para agregar un nuevo alérgeno a través de la API
  const handleAddAlergeno = async () => {
    if (newAlergenoNombre.trim() !== "") {
      try {
        const newAlergeno = await alergenoService.createAlergeno({
          denominacion: newAlergenoNombre,
          imagen: null,
        });
        setAlergenos([...alergenos, newAlergeno]);
        setShowModal(false);
        setNewAlergenoNombre("");
      } catch (error) {
        console.log("Error adding alergeno:", error);
      }
    }
  };

  // Función para editar un alérgeno desde la API
  const handleEditAlergeno = (alergeno: IAlergenos) => {
    setEditingAlergeno(alergeno);
    setNewAlergenoNombre(alergeno.denominacion);
    setShowModal(true);
  };

  // Función para guardar el alérgeno editado
  const handleSaveAlergeno = async () => {
    if (editingAlergeno) {
      try {
        const updatedAlergeno = await alergenoService.updateAlergeno(
          editingAlergeno.id,
          {
            denominacion: newAlergenoNombre,
            imagen: editingAlergeno.imagen, // Mantener la imagen actual si no se actualiza
          }
        );
        const updatedAlergenos = alergenos.map((alergeno) =>
          alergeno.id === updatedAlergeno.id ? updatedAlergeno : alergeno
        );
        setAlergenos(updatedAlergenos);
        setShowModal(false);
        setEditingAlergeno(null);
        setNewAlergenoNombre("");
      } catch (error) {
        console.log("Error updating alergeno:", error);
      }
    }
  };

  // Función para eliminar un alérgeno a través de la API
  const handleDeleteAlergeno = async (id: number) => {
    try {
      await alergenoService.deleteAlergenoById(id);
      setAlergenos(alergenos.filter((alergeno) => alergeno.id !== id));
    } catch (error) {
      console.log("Error deleting alergeno:", error);
    }
  };

  // useEffect para cargar los alérgenos al iniciar el componente
  useEffect(() => {
    fetchAllAlergenos();
  }, []);

  return (
    <div className={styles.headerContainer}>
      <div className={styles.buttonAgregarAlergeno}>
        <Button
          variant="dark"
          onClick={() => {
            setShowModal(true);
            setEditingAlergeno(null); // Resetear estado de edición cuando agregamos un nuevo alérgeno
            setNewAlergenoNombre(""); // Limpiar el campo de nombre
          }}
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#1E1E1E",
          }}
        >
          <span className="material-symbols-outlined">add</span>
          Agregar Alergeno
        </Button>
      </div>

      <div className={styles.listAlergenos}>
        <div className={styles.categoriasTabla}>
          <h4>Nombre</h4>
          <h4>Acciones</h4>
        </div>
        <ListGroup>
          {alergenos.map((alergeno, index) => (
            <ListGroup.Item key={index} className={styles.alergenoElement}>
              {alergeno.denominacion}
              <div className={styles.alergenoButtons}>
                <Button
                  className="d-flex align-items-center"
                  variant="warning"
                  onClick={() => handleEditAlergeno(alergeno)}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "black" }}
                  >
                    visibility
                  </span>
                </Button>
                <Button
                  className="d-flex align-items-center"
                  variant="primary"
                  onClick={() => handleEditAlergeno(alergeno)}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "black" }}
                  >
                    edit
                  </span>
                </Button>
                <Button
                  className="d-flex align-items-center"
                  variant="danger"
                  onClick={() => handleDeleteAlergeno(alergeno.id)}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "black" }}
                  >
                    delete
                  </span>
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>

      {/* Modal para agregar o editar alérgeno */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingAlergeno ? "Editar Alergeno" : "Agregar Alergeno"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAlergenoNombre">
              <Form.Label>Nombre del Alergeno</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa el nombre del alérgeno"
                value={newAlergenoNombre}
                onChange={(e) => setNewAlergenoNombre(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={editingAlergeno ? handleSaveAlergeno : handleAddAlergeno}
          >
            {editingAlergeno ? "Guardar" : "Agregar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
