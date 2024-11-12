import { FC, useEffect, useState } from "react";
import { Button, ListGroup } from "react-bootstrap";
import styles from "./AlergenosSucursal.module.css";
import { ISucursal } from "../../../types/dtos/sucursal/ISucursal";
import { AlergenoService } from "../../../services/AlergenoService";
import { IAlergenos } from "../../../types/dtos/alergenos/IAlergenos";

interface TablaAlergenosProps {
  sucursal: ISucursal | null;
  onSelect: () => void;
}

export const AlergenosSucursal: FC<TablaAlergenosProps> = () => {
  const [alergenos, setAlergenos] = useState<IAlergenos[]>([]);

  const alergenoService = new AlergenoService();

  const fecthAllAlergenos = async () => {
    try {
      const data = await alergenoService.getAllAlergenos();
      setAlergenos(data);
    } catch (error) {
      console.log("Error fetching alergenos:", error);
    }
  };

  useEffect(() => {
    fecthAllAlergenos();
  });

  return (
    <div className={styles.headerContainer}>
      <div className={styles.buttonAgregarAlergeno}>
        <Button
          variant="dark"
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#1E1E1E",
          }}
        >
          <span className="material-symbols-outlined">add</span>
          Agregar Alergeno
        </Button>
      </div>
      <div className={styles.listAlergenos}>
        <div className={styles.categoriasTabla}>
          <h4>Nombre</h4>
          <h4>Acciones</h4>
        </div>
        <ListGroup>
          {alergenos.map((alergeno, index) => (
            <ListGroup.Item key={index} className={styles.alergenoElement}>
              {alergeno.denominacion}
              <div className={styles.alergenoButtons}>
                <Button className="d-flex align-items-center" variant="warning">
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "black" }}
                  >
                    visibility
                  </span>
                </Button>
                <Button className="d-flex align-items-center" variant="primary">
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "black" }}
                  >
                    edit
                  </span>
                </Button>
                <Button className="d-flex align-items-center" variant="danger">
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "black" }}
                  >
                    delete
                  </span>
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
};
