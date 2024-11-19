import { Button, Spinner, Alert } from "react-bootstrap";
import styles from "./Home.module.css"; // Asegúrate de que este archivo exista y tenga los estilos
import { useState, useEffect } from "react";
import { EmpresaService } from "../../../services/EmpresaService";
import { SucursalService } from "../../../services/SucursalService";
import { IEmpresa } from "../../../types/dtos/empresa/IEmpresa";
import { ISucursal } from "../../../types/dtos/sucursal/ISucursal";
import { HeaderEmpresa } from "../HeaderEmpresa/HeaderEmpresa"; // Importa el HeaderEmpresa
import { ModalAgregarSucursal } from "../../modals/ModalAgregarSucursal/ModalAgregarSucursal";
import { ModalVerSucursal } from "../../modals/ModalVerSucursal/ModalVerSucursal";
import { ICreateSucursal } from "../../../types/dtos/sucursal/ICreateSucursal";
import { CardEmpresa } from "../../ui/CardEmpresa/CardEmpresa";
import { CardSucursal } from "../../ui/CardSucursal/CardSucursal";
import { ModalAgregarEmpresa } from "../../modals/ModalAgregarEmpresa/ModalAgregarEmpresa";

export const Home = () => {
  const [showModalEmpresa, setShowModalEmpresa] = useState(false);
  const [showModalSucursal, setShowModalSucursal] = useState(false);
  const [empresas, setEmpresas] = useState<IEmpresa[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<IEmpresa | null>(null);
  const [sucursales, setSucursales] = useState<ISucursal[]>([]);
  const [selectedSucursal, setSelectedSucursal] = useState<ISucursal | null>(
    null
  );
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  const [loadingSucursales, setLoadingSucursales] = useState(false);
  const [errorEmpresas, setErrorEmpresas] = useState<string | null>(null);
  const [errorSucursales, setErrorSucursales] = useState<string | null>(null);

  const empresaService = new EmpresaService();
  const sucursalService = new SucursalService();

  const fetchEmpresas = async () => {
    setLoadingEmpresas(true);
    setErrorEmpresas(null);
    try {
      const data = await empresaService.getAllEmpresas();
      console.log("Empresas: ", data);
      setEmpresas(data);
    } catch (error) {
      console.log("Error fetching empresas:", error);
      setErrorEmpresas("Error al cargar las empresas. Intenta nuevamente.");
    } finally {
      setLoadingEmpresas(false);
    }
  };

  const fetchSucursalesByEmpresa = async (idEmpresa: number) => {
    setLoadingSucursales(true);
    setErrorSucursales(null);
    try {
      const data = await sucursalService.getAllSucursalesByEmpresa(idEmpresa);
      console.log("Sucursales: ", data);
      setSucursales(data);
    } catch (error) {
      console.log("Error fetching sucursales:", error);
      setErrorSucursales("Error al cargar las sucursales. Intenta nuevamente.");
    } finally {
      setLoadingSucursales(false);
    }
  };

  const handleSaveSucursal = async (nuevaSucursal: ICreateSucursal) => {
    if (!selectedEmpresa) {
      console.error("Error: No se ha seleccionado una empresa válida.");
      return; // No proceder si no hay empresa seleccionada
    }

    try {
      const sucursalCreada = await sucursalService.createSucursal({
        ...nuevaSucursal,
        idEmpresa: selectedEmpresa.id,
      });
      console.log("Sucursal guardada: ", sucursalCreada);
      setSucursales((prev) => [...prev, sucursalCreada]);
      fetchSucursalesByEmpresa(selectedEmpresa.id);
    } catch (error) {
      console.log("Error saving new sucursal: ", error);
    }
    handleCloseSucursal();
  };

  const handleSelectEmpresa = (empresa: IEmpresa) => {
    setSelectedEmpresa(empresa);
    fetchSucursalesByEmpresa(empresa.id);
  };

  const handleSelectSucursal = (sucursal: ISucursal) => {
    setSelectedSucursal(sucursal);
  };

  const handleCloseSucursal = () => {
    setShowModalSucursal(false);
    setSelectedSucursal(null);
  };

  const handleCloseEmpresa = () => {
    setShowModalEmpresa(false);
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  return (
    <div className={styles.mainContainer}>
      {selectedEmpresa && ( // Solo muestra el HeaderEmpresa si hay una empresa seleccionada
        <HeaderEmpresa
          nombreEmpresa={selectedEmpresa.nombre}
          onAgregarSucursal={() => setShowModalSucursal(true)} // Asegúrate de que esta función esté definida
        />
      )}
      <div className={styles.contentWrapper}>
        <div className={styles.empresasSection}>
          <div className={styles.empresasHeader}>
            <h1>Empresas</h1>
            <Button
              variant="dark"
              onClick={() => setShowModalEmpresa(true)}
              className={styles.addEmpresaButton}
            >
              <span className="material-symbols-outlined">add</span>
              Agregar Empresa
            </Button>
          </div>
          {loadingEmpresas && <Spinner animation="border" />}
          {errorEmpresas && <Alert variant="danger">{errorEmpresas}</Alert>}
          <div className={styles.empresasList}>
            {empresas.map((empresa) => (
              <CardEmpresa
                key={empresa.id}
                empresa={empresa}
                onSelect={() => handleSelectEmpresa(empresa)}
              />
            ))}
          </div>
        </div>

        <div className={styles.sucursalesSection}>
          {loadingSucursales && <Spinner animation="border" />}
          {errorSucursales && <Alert variant="danger">{errorSucursales}</Alert>}
          <div className={styles.sucursalesList}>
            {sucursales.map((sucursal) => (
              <CardSucursal
                key={sucursal.id}
                sucursal={sucursal}
                onSelect={() => handleSelectSucursal(sucursal)}
              />
            ))}
          </div>
        </div>
      </div>
      <ModalAgregarEmpresa
        show={showModalEmpresa}
        handleClose={handleCloseEmpresa}
      />
      <ModalAgregarSucursal
        show={showModalSucursal}
        handleClose={handleCloseSucursal}
        onSave={handleSaveSucursal}
        idEmpresa={selectedEmpresa?.id || 0}
      />
      <ModalVerSucursal
        show={!!selectedSucursal}
        handleClose={handleCloseSucursal}
        sucursal={selectedSucursal}
      />
    </div>
  );
};
