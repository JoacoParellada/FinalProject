import { Button, Spinner, Alert } from "react-bootstrap";
import styles from "./Home.module.css";
import { ModalAgregarEmpresa } from "../../modals/modalAgregarEmpresa/ModalAgregarEmpresa";
import { useState, useEffect } from "react";
import { EmpresaService } from "../../../services/EmpresaService";
import { SucursalService } from "../../../services/SucursalService";
import { IEmpresa } from "../../../types/dtos/empresa/IEmpresa";
import { ISucursal } from "../../../types/dtos/sucursal/ISucursal";
import { HeaderEmpresa } from "../HeaderEmpresa/HeaderEmpresa";
import { ModalAgregarSucursal } from "../../modals/ModalAgregarSucursal/ModalAgregarSucursal";
import { ModalVerSucursal } from "../../modals/ModalVerSucursal/ModalVerSucursal";
import { ICreateSucursal } from "../../../types/dtos/sucursal/ICreateSucursal";
import { CardEmpresa } from "../../ui/CardEmpresa/CardEmpresa";
import { CardSucursal } from "../../ui/CardSucursal/CardSucursal";

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
    try {
      // Crear la nueva sucursal en el backend
      await sucursalService.createSucursal(nuevaSucursal);
      console.log("Sucursal guardada: ", nuevaSucursal);

      // Recargar las sucursales para la empresa seleccionada
      if (selectedEmpresa) {
        fetchSucursalesByEmpresa(selectedEmpresa.id);
      }
    } catch (error) {
      console.log("Error saving new sucursal: ", error);
    }
    handleCloseSucursal(); // Cerrar el modal después de guardar la sucursal
  };

  const handleSelectEmpresa = (empresa: IEmpresa) => {
    setSelectedEmpresa(empresa);
    fetchSucursalesByEmpresa(empresa.id); // Cargar las sucursales de la empresa seleccionada
  };

  const handleSelectSucursal = (sucursal: ISucursal) => {
    setSelectedSucursal(sucursal);
  };

  const handleShowSucursal = () => setShowModalSucursal(true);
  const handleCloseSucursal = () => setShowModalSucursal(false);

  useEffect(() => {
    if (!showModalEmpresa) fetchEmpresas();
  }, [showModalEmpresa]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.contentWrapper}>
        {/* Contenedor de Empresas */}
        <div className={styles.empresasSection}>
          <div className={styles.empresasHeader}>
            <h1>Empresas</h1>
            <Button
              variant="dark"
              onClick={() => setShowModalEmpresa(true)}
              className={styles.addEmpresaButton}>
              <span className="material-symbols-outlined">add</span>
              Agregar Empresa
            </Button>
          </div>

          <div className={styles.empresasList}>
            {loadingEmpresas ? (
              <Spinner animation="border" variant="primary" />
            ) : errorEmpresas ? (
              <Alert variant="danger">{errorEmpresas}</Alert>
            ) : empresas.length === 0 ? (
              <p>No hay empresas disponibles.</p>
            ) : (
              empresas.map((empresa, index) => (
                <CardEmpresa
                  key={index}
                  empresa={empresa}
                  onSelect={() => handleSelectEmpresa(empresa)}
                />
              ))
            )}
          </div>
        </div>

        {/* Contenedor de Sucursales */}
        {selectedEmpresa && (
          <div className={styles.sucursalesSection}>
            <HeaderEmpresa
              nombreEmpresa={selectedEmpresa.nombre}
              onAgregarSucursal={handleShowSucursal}
            />

            <div className={styles.sucursalesList}>
              {loadingSucursales ? (
                <Spinner animation="border" variant="primary" />
              ) : errorSucursales ? (
                <Alert variant="danger">{errorSucursales}</Alert>
              ) : sucursales.length === 0 ? (
                <p>No hay sucursales para esta empresa.</p>
              ) : (
                sucursales.map((sucursal) => (
                  <CardSucursal
                    key={sucursal.id}
                    sucursal={sucursal}
                    onSelect={() => handleSelectSucursal(sucursal)}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modales */}
      <ModalAgregarEmpresa
        show={showModalEmpresa}
        handleClose={() => setShowModalEmpresa(false)}
      />
      <ModalAgregarSucursal
        show={showModalSucursal}
        handleClose={handleCloseSucursal}
        onSave={handleSaveSucursal}
        idEmpresa={selectedEmpresa?.id || 0}
      />
      {selectedSucursal && (
        <ModalVerSucursal
          show={!!selectedSucursal}
          handleClose={() => setSelectedSucursal(null)}
          sucursal={selectedSucursal}
        />
      )}
    </div>
  );
};
