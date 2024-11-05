import { Button } from "react-bootstrap";
import styles from "./Home.module.css";
import { ModalAgregarEmpresa } from "../../modals/modalAgregarEmpresa/ModalAgregarEmpresa";
import { useState, useEffect } from "react";
import { CardEmpresa } from "../../CardEmpresa/CardEmpresa";
import { EmpresaService } from "../../../services/EmpresaService";
import { IEmpresa } from "../../../types/dtos/empresa/IEmpresa";
import { useAppDispatch } from "../../../hooks/redux";

export const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [empresas, setEmpresas] = useState<IEmpresa[]>([]);
  const empresaService = new EmpresaService("empresas")
  const dispatch = useAppDispatch()
  



  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const data = await empresaService.getAllEmpresas();
        console.log("Empresas: ", data);
        setEmpresas(data);
        
      } catch (error) {
        console.log("Error fetching empresas:", error);
      }
    };

fetchEmpresas();
}, []);

const handleShow = () => setShowModal(true);
const handleClose = () => setShowModal(false);

// const handleSave = async (nuevaEmpresa: IEmpresa) => {
// try {
//   const createdEmpresa = await empresaService.post(nuevaEmpresa);
//   if (createdEmpresa) {
//         setEmpresas(prevEmpresas => [...prevEmpresas, createdEmpresa]);
//       }
// } catch (error) {
//   console.error("Error saving new empresa:", error);
// }
// };

  return (
    <div className={styles.containerPrincipal}>
      <div className={styles.containerTitle}>
        <h1>Empresas</h1>
        <Button
          style={{ display: "flex", alignItems: "center", padding: "0.4rem" }}
          variant="dark"
          onClick={handleShow}
        >
          <span className="material-symbols-outlined">add</span>
          Agregar Empresa
        </Button>
      </div>
      <div>
        {empresas.map((empresa, index) => (
          <CardEmpresa key={index} empresa={empresa} />
        ))}
      </div>
      {/* <ModalAgregarEmpresa
        show={showModal}
        handleClose={handleClose}
        onSave={handleSave}
      /> */}
    </div>
  );
};
