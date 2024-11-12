import { FC, useEffect, useState } from "react";
import { ISucursal } from "../../../types/dtos/sucursal/ISucursal";
import { Button, Dropdown, DropdownButton, ListGroup, Modal } from "react-bootstrap";

import styles from  "./ProductosSucursal.module.css"
import { ICategorias } from "../../../types/dtos/categorias/ICategorias";
import { CategoriaService } from "../../../services/CategoriaService";
import { IProductos } from "../../../types/dtos/productos/IProductos";
import { ProductService } from "../../../services/ProductService";

interface TablaProductosProps {
    sucursal : ISucursal | null
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
    
    const [categorias, setCategorias] = useState<ICategorias[]>([]);
    const [productos, setProductos] = useState<IProductos[]>([]);
    

    const categoriaService = new CategoriaService()
    const productoService = new ProductService()   

    useEffect(() => {
        if (sucursal) {
            fetchCategoriasBySucursal(sucursal.id);
            fetchProductosBySucursal(sucursal.id)
        }
    }, [sucursal]);
    
    //---------- GET CATEGORIAS POR SUSCURSAL ----------
    const fetchCategoriasBySucursal = async (idSucursal: number) => {
        try {
            const data = await categoriaService.getAllCategoriasBySucursal(idSucursal);
            console.log("Categorias: ", data);
            setCategorias(data);
        } catch (error) {
            console.log("Error fetching categorias:", error);
        }
    };


    const handleCategoriaSelect = (categoria: ICategorias) => {
        console.log("Categoría seleccionada:", categoria.denominacion);
    };


    //--------- GET PRODUCTOS POR SUCURSAL ----------

    const fetchProductosBySucursal = async (idSucursal: number) => {
        try {
            const data = await productoService.getProductosPorSucursal(idSucursal)
            console.log("Productos: ", data);
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
                    {productos.map((producto, index)=>(
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
                    <strong>Habilitado</strong> {selectedProducto?.habilitado ? "Si": "No"}
                    <br />
                    //FALTA IMAGEN
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
        </div>
    )
}
