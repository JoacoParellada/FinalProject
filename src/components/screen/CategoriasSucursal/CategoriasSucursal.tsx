import { FC, useEffect, useState } from "react";
import { Accordion, Button } from "react-bootstrap";
import styles from "./CategoriaSucursal.module.css";
import { ISucursal } from "../../../types/dtos/sucursal/ISucursal";
import { CategoriaService } from "../../../services/CategoriaService";
import { ICategorias } from "../../../types/dtos/categorias/ICategorias";
import { ICreateCategoria } from "../../../types/dtos/categorias/ICreateCategoria";
import { ModalAgregarCategoria } from "../../modals/ModalAgregarCategoria/ModalAgregarCategoria";
import { ModalEditarCategoria } from "../../modals/ModalEditarCategoria/ModalEditarCategoria";

interface TablaCategoriasProps {
  sucursal: ISucursal | null;
  onSelect: () => void;
}

export const CategoriasSucursal: FC<TablaCategoriasProps> = ({ sucursal }) => {
  const categoriaService = new CategoriaService();
  const [categorias, setCategorias] = useState<ICategorias[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategoria, setSelectedCategoria] =
    useState<ICategorias | null>(null);
  const [newCategoriaDenominacion, setNewCategoriaDenominacion] = useState("");

  const fetchCategoriasBySucursal = async (idSucursal: number) => {
    try {
      const data = await categoriaService.getAllCategoriasBySucursal(
        idSucursal
      );
      setCategorias(data);
    } catch (error) {
      console.log("Error fetching categorias:", error);
    }
  };

  useEffect(() => {
    if (sucursal) {
      fetchCategoriasBySucursal(sucursal.id);
    }
  }, [sucursal]);

  const handleToggle = (key: string) => {
    setActiveKey(activeKey === key ? null : key);
  };

  const handleEditClick = (categoria: ICategorias) => {
    setSelectedCategoria(categoria);
    setNewCategoriaDenominacion(categoria.denominacion); // Establecer la denominación actual
    setShowEditModal(true); // Abrir el modal de edición
  };

  const handleSaveCategoria = async (denominacion: string) => {
    if (selectedCategoria) {
      const updatedCategoria: ICategorias = {
        ...selectedCategoria,
        denominacion,
      };

      try {
        await categoriaService.put(selectedCategoria.id, updatedCategoria); // Llama al método PUT para actualizar
        setShowEditModal(false);
        setSelectedCategoria(null);
        fetchCategoriasBySucursal(sucursal?.id || 0);
      } catch (error) {
        console.log("Error updating categoria:", error);
      }
    }
  };

  const handleAddCategoria = async () => {
    const newCategoria: ICreateCategoria = {
      denominacion: newCategoriaDenominacion,
      idEmpresa: sucursal?.empresa.id,
      idCategoriaPadre: null,
    };

    try {
      await categoriaService.post(newCategoria);
      setNewCategoriaDenominacion("");
      fetchCategoriasBySucursal(sucursal?.id || 0);
      setShowAddModal(false);
    } catch (error) {
      console.log("Error adding categoria:", error);
    }
  };

  return (
    <div className={styles.homeCategorias}>
      <div>
        <Button
          onClick={() => {
            setNewCategoriaDenominacion(""); // Limpiar el campo de denominación
            setShowAddModal(true); // Abrir el modal para agregar una nueva categoría
          }}
          variant="dark"
          className={styles.buttonCategorias}
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#1E1E1E",
          }}
        >
          <span className="material-symbols-outlined">add</span>
          Agregar una categoría
        </Button>
      </div>
      <Accordion activeKey={activeKey}>
        {categorias.map((categoria) => (
          <Accordion.Item key={categoria.id} eventKey={String(categoria.id)}>
            <Accordion.Header
              className="d-flex justify-content-between"
              onClick={() => handleToggle(String(categoria.id))}
            >
              {categoria.denominacion}
              <div className="d-flex justify-content-end w-100">
                <Button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "black",
                  }}
                  variant="primary"
                  className="me-2"
                  onClick={() => handleEditClick(categoria)}
                >
                  <span className="material-symbols-outlined">edit</span>
                </Button>
                <div style={{ display: "flex" }}>
                  <Button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "black",
                    }}
                    variant="danger"
                    onClick={async () => {
                      try {
                        await categoriaService.delete(categoria.id);
                        fetchCategoriasBySucursal(sucursal?.id || 0);
                      } catch (error) {
                        console.log("Error deleting categoria:", error);
                      }
                    }}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </Button>
                  <Button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "black",
                      marginLeft: "0.5rem",
                    }}
                    variant="success"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </Button>
                </div>
              </div>
            </Accordion.Header>
            <Accordion.Body>
              {categoria.subCategorias && categoria.subCategorias.length > 0 ? (
                <ul>
                  {categoria.subCategorias.map((subCategoria) => (
                    <li
                      key={subCategoria.id}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>{subCategoria.denominacion}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay subcategorías disponibles.</p>
              )}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      <ModalAgregarCategoria
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSave={handleAddCategoria}
        denominacion={newCategoriaDenominacion}
        setDenominacion={setNewCategoriaDenominacion}
      />

      <ModalEditarCategoria
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          setSelectedCategoria(null);
        }}
        categoria={selectedCategoria}
        onSave={handleSaveCategoria}
      />
    </div>
  );
};
