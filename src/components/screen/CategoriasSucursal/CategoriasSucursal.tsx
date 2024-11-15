import { FC, useEffect, useState } from "react";
import { Accordion, Button } from "react-bootstrap";
import styles from "./CategoriaSucursal.module.css";
import { ISucursal } from "../../../types/dtos/sucursal/ISucursal";
import { CategoriaService } from "../../../services/CategoriaService";
import { ICategorias } from "../../../types/dtos/categorias/ICategorias";
import { ModalAgregarCategoria } from "../../modals/ModalEditarCategoria/ModalAgregarCategoria";
import { ICreateCategoria } from "../../../types/dtos/categorias/ICreateCategoria";

interface TablaCategoriasProps {
  sucursal: ISucursal | null;
  onSelect: () => void;
}

export const CategoriasSucursal: FC<TablaCategoriasProps> = ({ sucursal }) => {
  const categoriaService = new CategoriaService();

  const [categorias, setCategorias] = useState<ICategorias[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedCategoria, setSelectedCategoria] =
    useState<ICategorias | null>(null);
  const [newCategoriaDenominacion, setNewCategoriaDenominacion] = useState("");

  const fetchCategoriasBySucursal = async (idSucursal: number) => {
    try {
      const data = await categoriaService.getAllCategoriasBySucursal(
        idSucursal
      );
      console.log("Categorias: ", data);
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
    setShowEditModal(true);
  };

  const handleSaveCategoria = (categoria: ICategorias) => {
    console.log("Categoría actualizada:", categoria);
    setShowEditModal(false);
    setSelectedCategoria(null);
    fetchCategoriasBySucursal(sucursal?.id || 0);
  };

  const handleAddCategoria = async () => {
    if (newCategoriaDenominacion.trim() === "") {
      alert("El nombre de la categoría es requerido");
      return;
    }

    try {
      const newCategoria: ICreateCategoria = {
        denominacion: newCategoriaDenominacion,
        idEmpresa: sucursal?.empresa.id,
        idCategoriaPadre: null,
      };

      await categoriaService.post(newCategoria);
      setNewCategoriaDenominacion("");
      fetchCategoriasBySucursal(sucursal?.id || 0);
    } catch (error) {
      console.log("Error adding categoria:", error);
    }
  };

  return (
    <div className={styles.homeCategorias}>
      <div>
        <Button
          onClick={() => setShowEditModal(true)}
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
                  variant="primary"
                  className="me-2"
                  onClick={() => handleEditClick(categoria)}
                >
                  <span
                    className="material-symbols-outlined d-flex align-items-center"
                    style={{ color: "black" }}
                  >
                    edit
                  </span>
                </Button>
                <Button
                  className="me-2"
                  variant="success"
                  onClick={() => console.log("Eliminar", categoria)}
                >
                  <span
                    className="material-symbols-outlined d-flex align-items-center"
                    style={{ color: "black" }}
                  >
                    add
                  </span>
                </Button>
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
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        categoria={selectedCategoria}
        newCategoriaDenominacion={newCategoriaDenominacion}
        setNewCategoriaDenominacion={setNewCategoriaDenominacion}
        onAddCategoria={handleAddCategoria}
      />
    </div>
  );
};
