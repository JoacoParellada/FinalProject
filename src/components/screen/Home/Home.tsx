import { Button, Navbar } from "react-bootstrap";
import styles from "./Home.module.css";
import { ModalAgregarEmpresa } from "../../modals/modalAgregarEmpresa/ModalAgregarEmpresa";
import { useState, useEffect } from "react";
import { CardEmpresa } from "../../CardEmpresa/CardEmpresa";
import { EmpresaService } from "../../../services/EmpresaService";
import { SucursalService } from "../../../services/SucursalService";
import { IEmpresa } from "../../../types/dtos/empresa/IEmpresa";
import { ISucursal } from "../../../types/dtos/sucursal/ISucursal";
import { HeaderEmpresa } from "../HeaderEmpresa/HeaderEmpresa";
import { CardSucursal } from "../../CardSucursal/CardSucursal";
import { ModalAgregarSucursal } from "../../modals/ModalAgregarSucursal/ModalAgregarSucursal";
import { ModalVerSucursal } from "../../modals/ModalVerSucursal/ModalVerSucursal";
import { ICreateSucursal } from "../../../types/dtos/sucursal/ICreateSucursal";

export const Home = () => {
	const [showModalEmpresa, setShowModalEmpresa] = useState(false);
	const [showModalSucursal, setShowModalSucursal] = useState(false);
	const [empresas, setEmpresas] = useState<IEmpresa[]>([]);

	const [selectedEmpresa, setSelectedEmpresa] = useState<IEmpresa | null>(null);
	const [sucursales, setSucursales] = useState<ISucursal[]>([]);
	const [selectedSucursal, setSelectedSucursal] = useState<ISucursal | null>(
		null
	);

	const empresaService = new EmpresaService("empresas");
	const sucursalService = new SucursalService();

	const fetchEmpresas = async () => {
		try {
			const data = await empresaService.getAllEmpresas();
			console.log("Empresas: ", data);
			setEmpresas(data);
		} catch (error) {
			console.log("Error fetching empresas:", error);
		}
	};

	const fetchSucursalesByEmpresa = async (idEmpresa: number) => {
		try {
			const data = await sucursalService.getAllSucursalesByEmpresa(idEmpresa);
			console.log("Sucursales: ", data);
			setSucursales(data);
		} catch (error) {
			console.log("Error fetching sucursales:", error);
		}
	};

	useEffect(() => {
		if (!showModalEmpresa) fetchEmpresas();
	}, [showModalEmpresa]);

	const handleShowEmpresa = () => setShowModalEmpresa(true);
	const handleCloseEmpresa = () => setShowModalEmpresa(false);

	const handleShowSucursal = () => setShowModalSucursal(true);
	const handleCloseSucursal = () => setShowModalSucursal(false);

	/*
	const handleSaveEmpresa = async (nuevaEmpresa: IEmpresa) => {
		try {
			await empresaService.post(nuevaEmpresa).then(() => {
				fetchEmpresas();
			});
		} catch (error) {
			console.log("Error saving new empresa:", error);
		}
	};
	*/

	const handleSaveSucursal = async (nuevaSucursal: ICreateSucursal) => {
		try {
			await sucursalService.createSucursal(nuevaSucursal);
			console.log("Sucursal guardad: ", nuevaSucursal);
			fetchSucursalesByEmpresa(nuevaSucursal.idEmpresa);
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

	return (
		<div className={styles.mainContainer}>
			<div className={styles.contentWrapper}>
				{/* Contenedor de Empresas */}
				<div className={styles.empresasSection}>
					<div className={styles.empresasHeader}>
						<h1>Empresas</h1>
						<Button
							variant="dark"
							onClick={handleShowEmpresa}
							className={styles.addEmpresaButton}>
							<span className="material-symbols-outlined">add</span>
							Agregar Empresa
						</Button>
					</div>

					<div className={styles.empresasList}>
						{empresas.map((empresa, index) => (
							<CardEmpresa
								key={index}
								empresa={empresa}
								onSelect={() => handleSelectEmpresa(empresa)}
							/>
						))}
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
							{sucursales.map((sucursal) => (
								<CardSucursal
									key={sucursal.id}
									sucursal={sucursal}
									onSelect={() => handleSelectSucursal(sucursal)}
								/>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Modales */}
			<ModalAgregarEmpresa
				show={showModalEmpresa}
				handleClose={handleCloseEmpresa}
				//onSave={handleSaveEmpresa}
			/>
			{/* Modales */}
			<ModalAgregarSucursal
				show={showModalSucursal}
				handleClose={handleCloseSucursal}
				onSave={handleSaveSucursal}
				idEmpresa={selectedEmpresa?.id || 0} // Pasa el id de la empresa al modal
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
