import { FC, useEffect, useState } from "react";
import { ISucursal } from "../../../types/dtos/sucursal/ISucursal";
import { Button, Dropdown, DropdownButton, Form, ListGroup, Modal } from "react-bootstrap";

import styles from  "./ProductosSucursal.module.css"
import { ICategorias } from "../../../types/dtos/categorias/ICategorias";
import { CategoriaService } from "../../../services/CategoriaService";
import { IProductos } from "../../../types/dtos/productos/IProductos";
import { ProductService } from "../../../services/ProductService";
import { IAlergenos } from "../../../types/dtos/alergenos/IAlergenos";
import { AlergenoService } from "../../../services/AlergenoService";
import { useDispatch } from "react-redux";
import { removeImageActivo, setImageStringActivo } from "../../../redux/slices/ImageReducer";
import { UploadImageCompany } from "../../ui/UploadImage/UploadImageEmpresa";

interface TablaProductosProps {
    sucursal : ISucursal 
    onSelect: () => void;
}

export const ProductosSucursal :FC<TablaProductosProps> = ({
    sucursal,
}
) => {
    const [showModalDescripcion, setShowModalDescripcion] = useState(false);
    const [selectedProducto, setSelectedProducto] = useState<IProductos | null>(null);
    const [showModalVerProducto, setshowModalVerProducto] = useState(false);
    const [showModalDeleteProducto, setShowModalDeleteProducto] = useState(false);
    const [productoAEliminar, setProductoAEliminar] = useState<number | null>(null);
    const [showModalProducto, setShowModalProducto] = useState(false);
    const [showListProductos, setShowListProductos] = useState(true);
    
    const [alergeno, setAlergeno] = useState<IAlergenos[]>([]);
    const [categorias, setCategorias] = useState<ICategorias[]>([]);
    const [productos, setProductos] = useState<IProductos[]>([]);
    
    const alergenoService = new AlergenoService();
    const categoriaService = new CategoriaService()
    const productoService = new ProductService()   


    const [newProductoNombre, setNewProductoNombre] = useState("");
    const [newProdutoPrecio, setNewProductoPrecio] = useState<number>(0);
    const [newProductoDescripcion, setNewProductoDescripcion] = useState("");
    const [newProductoHabilitado, setNewProductoHabilitado] = useState(true);
    const [newProductoCodigo, setNewProductoCodigo] = useState("");
    const [newProductoCategoria, setNewProductoCategoria] = useState(0);
    const [newProductoAlergeno, setNewProductoAlergeno] = useState<number[]>([]);
    const [categoriaSeleccionadaId, setCategoriaSeleccionadaId] = useState<number>(0);
    const [newProductoImagen, setNewProductoImagen] = useState<{ logo: string }>({ logo: "" });
    
    const dispatch = useDispatch();

    useEffect(() => {
        if (sucursal) {
            fetchCategoriasBySucursal(sucursal.id);
            fetchProductosBySucursal(sucursal.id)
            fetchAllAlergenos()
            handleAddProducto()
            
        }
    }, [sucursal]);

    
    //---------- GET CATEGORIAS POR SUSCURSAL ----------
    const fetchCategoriasBySucursal = async (idSucursal: number) => {
        try {
            const data = await categoriaService.getAllCategoriasBySucursal(idSucursal);
            setCategorias(data);
        } catch (error) {
            console.log("Error fetching categorias:", error);
        }
    };


    const handleCategoriaSelect = (categoria: ICategorias) => {
        console.log("Categoría seleccionada:", categoria.denominacion);
        setCategoriaSeleccionadaId(categoria.id);
        if(categoria.denominacion === "MENU"){
            setShowListProductos(true)
        }else{
            setShowListProductos(false)
        }
        
        
    };

    //--------- GET ALERGENOS -----------------

    const fetchAllAlergenos = async () => {
        try {
            const data = await alergenoService.getAllAlergenos();
            setAlergeno(data);
        } catch (error) {
            console.log("Error fetching alergenos:", error);
        }
    };

    //--------- GET PRODUCTOS POR SUCURSAL ----------

    const fetchProductosBySucursal = async (idSucursal: number) => {
        try {
            const data = await productoService.getProductosPorSucursal(idSucursal)
            setProductos(data);
        } catch (error) {
            console.log("Error fetching productos:", error);
        }
    };

    // ---------- HANDLE MODAL DESCRIPCION PRODUCTO ----------

    const handleDescripcionProducto = (producto: IProductos) => {
        setSelectedProducto(producto);
        setShowModalDescripcion(true);
    }

    const handleCloseModal = () => {
        setShowModalDescripcion(false);
        setSelectedProducto(null);
    };


    // ----------- HANDLE MODAL VER PRODUCTO ----------


    const handleVerProducto = (producto: IProductos) => {
        setSelectedProducto(producto);
        setshowModalVerProducto(true)
    }

    const handleCloseModalVerProducto = () => {
        setshowModalVerProducto(false)
        setSelectedProducto(null);
    };
    

    // ---------- HANDLE MODAL ELIMINAR PRODUCTO ----------

    const handleDeleteProducto = (idProducto : number) => {
        setProductoAEliminar(idProducto)
        setShowModalDeleteProducto(true)
        
    }

    const handleConfirmDelete = async () => {
        if (productoAEliminar !== null) {
            try {
                await productoService.deleteProductoById(productoAEliminar); 
                console.log("Producto eliminado");
            } catch (error) {
                console.log("Error al eliminar producto:", error);
            } finally {
                setShowModalDeleteProducto(false); 
                setProductoAEliminar(null); 
            }
        }
    };

    const handleCloseModalDelete = () => {
        setShowModalDeleteProducto(false);  
        setProductoAEliminar(null);
    };


    // -------------- HANDLE MODAL AGREGAR PRODUCTO

    const handleAddProducto = async () => {
        if (newProductoNombre.trim() !== "") {
            try {
                const newProducto = await productoService.createProducto({
                    denominacion: newProductoNombre,
                    precioVenta: newProdutoPrecio,
                    descripcion: newProductoDescripcion,
                    habilitado: newProductoHabilitado,
                    codigo: newProductoCodigo,
                    idCategoria: newProductoCategoria,
                    idAlergenos: newProductoAlergeno,
                    imagenes: [],
                })
                setProductos([...productos, newProducto])

            } catch (error) {
                console.log("Error adding producto:", error);
            }
        }
        setShowModalProducto(false)
    }


    // --------------- HANDLE AGREGAR IMAGEN -------------

    const handleImageSet = (image: string | null) => {
		if (image) {
			setNewProductoImagen((prev) => ({ ...prev, logo: image }));
			dispatch(setImageStringActivo(image));
		} else {
			console.error("Error: la imagen no es válida.");
			setNewProductoImagen((prev) => ({ ...prev, logo: "" })); // Limpiar el logo si es `null`
			dispatch(removeImageActivo()); // Limpiar la imagen activa en el estado global
		}
	};
    
    return (
        <div className={styles.homeProductos}>
            <div className={styles.headerProductos}>
                <div className={styles.filtrarProducto}>
                    <h3>Filtrar por categoria:</h3>
                    <DropdownButton title="Selecciona una categoria" variant="dark" >
                        {categorias.map((categoria, index) => (
                            <Dropdown.Item 
                            href="#/action-1"
                            key={index}
                            onClick={() => handleCategoriaSelect(categoria)}
                            >
                                {categoria.denominacion} 
                            </Dropdown.Item>
                        ))}
                        
                    </DropdownButton>
                </div>
                <Button
                    variant="dark"
                    className={styles.buttonProductos}
                    style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#1E1E1E",
                    }}
                    onClick={()=>{
                        setShowModalProducto(true)

                    }}
                >
                    <span className="material-symbols-outlined">add</span>
                    Agregar un producto
                </Button>
                
            </div>
            <div  className={styles.listProductos}>
                <div className={styles.categoriasTabla}>
                    <h4>Nombre</h4>
                    <h4>Precio</h4>
                    <h4>Descripcion</h4>
                    <h4>Categoria</h4>
                    <h4>Habilitado</h4>
                    <h4>Acciones</h4>
                </div>
                <ListGroup className={styles.listProductos}>
                    {showListProductos
                        ? productos.map((producto, index)=>(
                        <ListGroup.Item 
                        className={styles.productoElement}
                        key={index}
                        >
                        <div>{producto.denominacion}</div>
                        <div>${producto.precioVenta}</div>
                        <div><Button onClick={() => handleDescripcionProducto(producto)}>Descripcion</Button></div>
                        <div>{producto.categoria.denominacion}</div> 
                        <div>{producto.habilitado ? "Si" : "No"}</div>
                        <div className={styles.actionsButtons}>
                            
                        
                        <Button
                            className="d-flex align-items-center"
                            onClick={()=>handleVerProducto(producto)}
                            variant="warning"
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
                        >
                            <span
                            className="material-symbols-outlined"
                            style={{ color: "black" }}
                            onClick={()=>{
                                handleDeleteProducto(producto.id)
                            }}
                            >
                            delete
                            </span>
                        </Button>
                        </div>
                        
                        </ListGroup.Item>
                    ))
                    : productos
                        .filter(producto => producto.categoria.id === categoriaSeleccionadaId) // Filtrar por la categoría seleccionada
                        .map((producto, index) => (
                            <ListGroup.Item
                            className={styles.productoElement}
                            key={index}
                            >
                            <div>{producto.denominacion}</div>
                            <div>${producto.precioVenta}</div>
                            <div><Button onClick={() => handleDescripcionProducto(producto)}>Descripcion</Button></div>
                            <div>{producto.categoria.denominacion}</div>
                            <div>{producto.habilitado ? "Si" : "No"}</div>
                            <div className={styles.actionsButtons}>
                                <Button
                                    className="d-flex align-items-center"
                                    onClick={()=>handleVerProducto(producto)}
                                    variant="warning"
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
                                >
                                    <span
                                    className="material-symbols-outlined"
                                    style={{ color: "black" }}
                                    onClick={()=>{
                                        handleDeleteProducto(producto.id)
                                    }}
                                    >
                                    delete
                                    </span>
                                </Button>
                            </div>
                            </ListGroup.Item>
                        ))}
                </ListGroup>
            </div>
            <Modal show={showModalDescripcion} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                <Modal.Title>Descripción del Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {selectedProducto?.descripcion || "No hay descripción disponible."}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Cerrar
                </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showModalVerProducto} onHide={handleCloseModalVerProducto}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedProducto?.denominacion}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <strong>Precio:</strong> ${selectedProducto?.precioVenta}
                    <br />
                    <strong>Descripcion:</strong> {selectedProducto?.descripcion || "No hay descripción disponible."}
                    <br />
                    <strong>Categoria:</strong> {selectedProducto?.categoria.denominacion}
                    <br />
                    <strong>Habilitado:</strong> {selectedProducto?.habilitado ? "Si": "No"}
                    <br />
                    <strong>Imagen:</strong> 
                        {selectedProducto?.imagenes?.length ? (
                        selectedProducto.imagenes.map((imagen, index) => (
                            <img key={index} src={imagen.url} alt={`Imagen ${index + 1}`} style={{ maxWidth: "100px", maxHeight: "100px", margin: "5px" }} />
                        ))
                        ) : (
                        <span>No hay imágenes disponibles</span>
                        )}
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalVerProducto}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showModalDeleteProducto} onHide={handleCloseModalDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que deseas eliminar este producto?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalDelete}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModalProducto} onHide={() => setShowModalProducto(false)} className={styles.modalAddProducto}>
                <Modal.Header closeButton>
                <Modal.Title>
                    Agregar Producto
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formAlergenoNombre">
                            <Form.Label>Nombre del Producto</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa el nombre del producto"
                                value={newProductoNombre}
                                onChange={(e) => setNewProductoNombre(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formProductoPrecio">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control
                                type="number" 
                                placeholder="Ingresa precio"
                                value={newProdutoPrecio}
                                onChange={(e) => setNewProductoPrecio(Number(e.target.value))}
                            />
                        </Form.Group>
                        <Form.Group controlId="formAlergenoDescripcion">
                            <Form.Label>Descripcion</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa descripcion"
                                value={newProductoDescripcion}
                                onChange={(e) => setNewProductoDescripcion(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formAlergenoHabilitado">
                            <Form.Check
                                type="checkbox"
                                label="Habilitado"
                                checked={newProductoHabilitado}
                                onChange={(e) => setNewProductoHabilitado(e.target.checked)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formProductoCodigo">
                            <Form.Label>Codigo</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa codigo"
                                value={newProductoCodigo}
                                onChange={(e) => setNewProductoCodigo(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCategoria">
                            <Form.Label>Categoria</Form.Label>
                            <Form.Control
                                as="select"
                                placeholder="Ingresa el nombre del alérgeno"
                                value={newProductoCategoria}
                                required
                                onChange={(e) => setNewProductoCategoria(Number(e.target.value))}
                            >
                                <option value="">Seleccione una categoria</option>
                                {categorias.map((categoria) => (
                                    <option key={categoria.id} value={categoria.id}>
                                        {categoria.denominacion}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        {/* <Form.Group controlId="formAlergeno">
                            <Form.Label>Alergenos</Form.Label>
                            <div>
                                {alergeno.map((alergenoItem) => (
                                    <Form.Check
                                        key={alergenoItem.id}
                                        type="checkbox"
                                        label={alergenoItem.denominacion}
                                        value={alergenoItem.id}
                                        checked={newProductoAlergeno.includes(alergenoItem.id)}
                                        onChange={(e) => {
                                            const id = Number(e.target.value);
                                            if (e.target.checked) {
                                                setNewProductoAlergeno([...newProductoAlergeno, id]);
                                            } else {
                                                setNewProductoAlergeno(newProductoAlergeno.filter((alergenoId) => alergenoId !== id));
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                        </Form.Group> */}
                        <Form.Group controlId="formLogo" className={styles.formGroup}>
                            <Form.Label className={styles.formLabel}>Logo</Form.Label>
                            <UploadImageCompany 
                            image={newProductoImagen.logo}
                            setImage={handleImageSet}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModalProducto(false)}>
                    Cancelar
                </Button>
                <Button
                    variant="primary"
                    onClick={ handleAddProducto}
                >
                    Guardar
                    
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
