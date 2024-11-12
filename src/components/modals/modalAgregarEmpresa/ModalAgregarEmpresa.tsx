import { FC, useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { IEmpresa } from "../../../types/dtos/empresa/IEmpresa";
import { EmpresaService } from "../../../services/EmpresaService";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import {
	removeImageActivo,
	setImageStringActivo,
} from "../../../redux/slices/ImageReducer";
import { removeEmpresaActiva } from "../../../redux/slices/empresasSlice";
import { ICreateEmpresaDto } from "../../../types/dtos/empresa/ICreateEmpresaDto";

interface ModalAgregarEmpresaProps {
	show: boolean;
	handleClose: () => void;
	//onSave: (empresa: IEmpresa) => void; // Updated for conditional save
}

export const ModalAgregarEmpresa: FC<ModalAgregarEmpresaProps> = ({
	show,
	handleClose,
	//onSave,
}) => {
	const empresaService = new EmpresaService();
	const dispatch = useAppDispatch();
	const empresaActiva = useAppSelector((state) => state.empresas.empresaActiva);
	const imageActivo = useAppSelector((state) => state.image.imageStringActivo);

	const [nuevaEmpresa, setNuevaEmpresa] = useState<ICreateEmpresaDto>({
		nombre: "",
		razonSocial: "",
		cuit: "",
		logo: "",
	});

	// Rellenar la empresa cuando hay una empresa activa
	useEffect(() => {
		if (empresaActiva) {
			setNuevaEmpresa({
				nombre: empresaActiva.nombre,
				razonSocial: empresaActiva.razonSocial,
				cuit: empresaActiva.cuit,
				logo: empresaActiva.logo || "",
			});
			if (empresaActiva.logo) {
				dispatch(setImageStringActivo(empresaActiva.logo));
			}
		}
	}, [empresaActiva, dispatch]);

	// Manejo del cambio de campos de formulario
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setNuevaEmpresa((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Manejo del cambio de imagen
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				const result = reader.result as string;
				setNuevaEmpresa((prev) => ({ ...prev, logo: result }));
				dispatch(setImageStringActivo(result));
			};
			reader.readAsDataURL(file);
		}
	};

	// Manejo de la presentación del formulario
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			if (empresaActiva) {
				// Actualizar empresa existente
				await empresaService.updateEmpresa(empresaActiva.id, {
					...nuevaEmpresa,
					logo: imageActivo,
				});
			} else {
				// Crear nueva empresa
				await empresaService.createEmpresa({
					...nuevaEmpresa,
					logo: imageActivo,
				});
			}
			// onSave(nuevaEmpresa);  // Llamar la función de onSave para actualizar la lista
			handleClose(); // Cerrar el modal
			setNuevaEmpresa({
				nombre: "",
				razonSocial: "",
				cuit: "",
				logo: "",
			}); // Resetear estado de la empresa
			dispatch(removeImageActivo()); // Limpiar la imagen activa
			dispatch(removeEmpresaActiva()); // Limpiar la empresa activa
		} catch (error) {
			console.error("Error al guardar la empresa:", error);
		}
	};

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>
					{empresaActiva ? "Editar Empresa" : "Agregar Nueva Empresa"}
				</Modal.Title>
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
						{empresaActiva ? "Actualizar" : "Guardar"}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};
