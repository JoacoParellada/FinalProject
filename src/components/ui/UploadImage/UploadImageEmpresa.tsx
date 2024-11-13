import { FC } from "react";
import { IImagen } from "../../../types/IImagen";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { ImageService } from "../../../services/ImageService";
import Swal from "sweetalert2";
import {
	removeImageActivo,
	setImageStringActivo,
} from "../../../redux/slices/ImageReducer";
import { Button } from "@mui/material";
import imageProblem from "../../../assets/images/imageProblem.jpg";

interface IUploadImage {
	image?: string | null; // URL de la imagen cargada, opcional
	setImage?: (image: string | null) => void; // Función para actualizar la imagen cargada
	imageObjeto?: IImagen | null; // Objeto de tipo IImagen que representa la imagen cargada
	setImageObjeto?: (image: IImagen | null) => void; // Función para actualizar el objeto de imagen
	typeElement?: string; // Tipo de elemento que se utilizará al eliminar la imagen
}

// Componente funcional que permite subir y eliminar imágenes
export const UploadImageCompany: FC<IUploadImage> = ({
	image,
	setImage,
	imageObjeto,
	setImageObjeto,
	typeElement,
}) => {
	// Instanciamos el servicio para manejar las imágenes
	const imageService = new ImageService("images");
	const empresaActiva = useAppSelector((state) => state.empresas.empresaActiva);
	const dispatch = useAppDispatch();

	// Función para manejar el cambio de archivo en el input de carga de imágenes
	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		// Verificamos si existe un archivo seleccionado
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0];
			const formData = new FormData();
			formData.append("uploads", file); // Agregamos el archivo al FormData para enviarlo

			// Muestra un mensaje de carga con SweetAlert2
			Swal.fire({
				title: "Subiendo...",
				didOpen: () => {
					Swal.showLoading(); // Activa el icono de carga
				},
			});

			try {
				// Subimos la imagen utilizando el servicio y obtenemos la URL de la imagen cargada
				const data = await imageService.uploadImage(formData);

				// Si setImage está definido, actualizamos la URL de la imagen cargada
				if (setImage) {
					setImage(data);
					dispatch(setImageStringActivo(data));
				}

				// Si setImageObjeto está definido, actualizamos el objeto de imagen con la URL y el nombre del archivo
				if (setImageObjeto) {
					setImageObjeto({
						url: data,
						name: file.name,
					});
				}
			} catch (error) {
				console.log(error); // En caso de error, lo mostramos en la consola
			}

			Swal.close(); // Cerramos el mensaje de carga
		}
	};

	// Objeto de ejemplo para identificar el elemento activo (simulado)

	// Función para manejar la eliminación de la imagen
	const handleDeleteImagen = async () => {
		// Si existe un objeto de imagen y la función para actualizarlo
		if (imageObjeto && setImageObjeto && empresaActiva && typeElement) {
			await imageService
				.deleteImgItems(empresaActiva.id, imageObjeto.url, typeElement)
				.then(() => {
					setImageObjeto(null); // Eliminamos el objeto de imagen
					dispatch(removeImageActivo());
				});
		}
		// Si existe solo la URL de la imagen
		else if (image && setImage) {
			await imageService.deleteImgCloudinary(image).then(() => {
				setImage(null); // Eliminamos la URL de la imagen
			});
		}
	};

	return (
		<div
			style={{
				width: "100%",
				border: "1px solid #9d9d9d",
				borderRadius: ".4rem",
				padding: ".4rem",
				height: "155px",
				display: "flex",
				flexWrap: "wrap",
				alignItems: "center",
				justifyContent: "center",
				flexDirection: "column",
			}}>
			{/* Si hay una imagen cargada, mostramos la vista con la imagen y el botón para eliminarla */}
			{image || imageObjeto ? (
				<div
					style={{
						borderRadius: ".4rem",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
						padding: ".4rem",
					}}>
					<div style={{ width: "100%" }}>
						<Button
							onClick={handleDeleteImagen} // Ejecuta la función de eliminación de imagen
							variant="outlined"
							color="error">
							Eliminar imagen
						</Button>
					</div>
					<img
						src={imageObjeto ? imageObjeto.url : image!} // Muestra la imagen desde el objeto o URL
						alt="Uploaded"
						style={{
							backgroundColor: "#ccc",
							width: "10vw",
							borderRadius: ".4rem",
							height: "10vh",
							objectFit: "fill",
							marginTop: "10px",
						}}
					/>
				</div>
			) : (
				<>
					{/* Si no hay imagen cargada, mostramos el input para seleccionar una nueva imagen */}
					<input
						accept="image/*"
						style={{ display: "none" }}
						id="contained-button-file"
						type="file"
						onChange={handleFileChange} // Ejecuta la función de cambio de archivo
					/>
					<label htmlFor="contained-button-file">
						<Button variant="outlined" component="span">
							Elige una imagen
						</Button>
					</label>
					<div>
						<img
							src={imageProblem} // Muestra una imagen de reemplazo si no hay imagen cargada
							alt="Uploaded"
							style={{ maxWidth: "100px", height: "auto" }}
						/>
					</div>
				</>
			)}
		</div>
	);
};
