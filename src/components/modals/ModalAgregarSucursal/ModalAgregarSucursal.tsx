// src/components/modals/ModalAgregarSucursal/ModalAgregarSucursal.tsx
import { FC, useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { ICreateSucursal } from "../../../types/dtos/sucursal/ICreateSucursal";
import { IPais } from "../../../types/IPais";
import { IProvincia } from "../../../types/IProvincia";
import { ILocalidad } from "../../../types/ILocalidad";
import { LocalidadesService } from "../../../services/LocalidadesService";
import { ProvinciaService } from "../../../services/ProvinciaService";
import { PaisService } from "../../../services/PaisService";
import styles from "./ModalAgregarSucursal.module.css";

interface ModalAgregarSucursalProps {
  show: boolean;
  handleClose: () => void;
  onSave: (sucursal: ICreateSucursal) => void;
  idEmpresa: number;
}

export const ModalAgregarSucursal: FC<ModalAgregarSucursalProps> = ({
  show,
  handleClose,
  onSave,
  idEmpresa,
}) => {
  const [nuevaSucursal, setNuevaSucursal] = useState<ICreateSucursal>({
    nombre: "",
    horarioApertura: "",
    horarioCierre: "",
    esCasaMatriz: false,
    latitud: 0,
    longitud: 0,
    domicilio: {
      calle: "",
      numero: 0,
      cp: 0,
      piso: 0,
      nroDpto: 0,
      idLocalidad: 0,
    },
    idEmpresa: idEmpresa, // Este valor deberías establecerlo según la empresa seleccionada
    logo: null,
  });

  const [paises, setPaises] = useState<IPais[]>([]);
  const [provincias, setProvincias] = useState<IProvincia[]>([]);
  const [localidades, setLocalidades] = useState<ILocalidad[]>([]);
  const [selectedPais, setSelectedPais] = useState<number | null>(null);
  const [selectedProvincia, setSelectedProvincia] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchPaises = async () => {
      const paisService = new PaisService();
      const paisesData = await paisService.getAllPaises();
      setPaises(paisesData);
    };
    fetchPaises();
  }, []);

  useEffect(() => {
    const fetchProvincias = async () => {
      if (selectedPais) {
        const provinciaService = new ProvinciaService();
        const provinciasData = await provinciaService.getProvinciaByPais(
          selectedPais
        );
        setProvincias(provinciasData);
      }
    };
    fetchProvincias();
  }, [selectedPais]);

  useEffect(() => {
    const fetchLocalidades = async () => {
      if (selectedProvincia) {
        const localidadesService = new LocalidadesService();
        const localidadesData =
          await localidadesService.getLocalidadesByProvincia(selectedProvincia);
        setLocalidades(localidadesData);
      }
    };
    fetchLocalidades();
  }, [selectedProvincia]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevaSucursal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectPais = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const paisId = Number(e.target.value);
    setSelectedPais(paisId);
    setNuevaSucursal((prev) => ({
      ...prev,
      domicilio: { ...prev.domicilio, idLocalidad: 0 }, // Resetear localidad al cambiar país
    }));
  };

  const handleSelectProvincia = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinciaId = Number(e.target.value);
    setSelectedProvincia(provinciaId);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(nuevaSucursal);
    handleClose();
    // Reset form
    setNuevaSucursal({
      nombre: "",
      horarioApertura: "",
      horarioCierre: "",
      esCasaMatriz: false,
      latitud: 0,
      longitud: 0,
      domicilio: {
        calle: "",
        numero: 0,
        cp: 0,
        piso: 0,
        nroDpto: 0,
        idLocalidad: 0,
      },
      idEmpresa: 0,
      logo: null,
    });
    setSelectedPais(null);
    setSelectedProvincia(null);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header className={styles.modalHeader} closeButton>
        <Modal.Title className={styles.modalTitle}>
          Agregar Sucursal
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNombre" className={styles.formGroup}>
            <Form.Label className={styles.formLabel}>Nombre</Form.Label>
            <Form.Control
              className={styles.formControl}
              type="text"
              name="nombre"
              value={nuevaSucursal.nombre}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group
            controlId="formHorarioApertura"
            className={styles.formGroup}
          >
            <Form.Label className={styles.formLabel}>
              Horario de Apertura
            </Form.Label>
            <Form.Control
              className={styles.formControl}
              type="time"
              name="horarioApertura"
              value={nuevaSucursal.horarioApertura}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group
            controlId="formHorarioCierre"
            className={styles.formGroup}
          >
            <Form.Label className={styles.formLabel}>
              Horario de Cierre
            </Form.Label>
            <Form.Control
              className={styles.formControl}
              type="time"
              name="horarioCierre"
              value={nuevaSucursal.horarioCierre}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formCasaMatriz" className={styles.formGroup}>
            <Form.Check
              type="checkbox"
              label="Es Casa Matriz"
              name="esCasaMatriz"
              checked={nuevaSucursal.esCasaMatriz}
              onChange={(e) =>
                setNuevaSucursal({
                  ...nuevaSucursal,
                  esCasaMatriz: e.target.checked,
                })
              }
            />
          </Form.Group>

          <Form.Group controlId="formLatitud" className={styles.formGroup}>
            <Form.Label className={styles.formLabel}>Latitud</Form.Label>
            <Form.Control
              className={styles.formControl}
              type="text"
              name="latitud"
              value={nuevaSucursal.latitud}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formLongitud" className={styles.formGroup}>
            <Form.Label className={styles.formLabel}>Longitud</Form.Label>
            <Form.Control
              className={styles.formControl}
              type="text"
              name="longitud"
              value={nuevaSucursal.longitud}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group
            controlId="formSeleccionarPais"
            className={styles.formGroup}
          >
            <Form.Label className={styles.formLabel}>
              Seleccionar País
            </Form.Label>
            <Form.Control
              as="select"
              className={styles.formControl}
              onChange={handleSelectPais}
              required
            >
              <option value="">Seleccione un país</option>
              {paises.map((pais) => (
                <option key={pais.id} value={pais.id}>
                  {pais.nombre}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group
            controlId="formSeleccionarProvincia"
            className={styles.formGroup}
          >
            <Form.Label className={styles.formLabel}>
              Seleccionar Provincia
            </Form.Label>
            <Form.Control
              as="select"
              className={styles.formControl}
              onChange={handleSelectProvincia}
              required
            >
              <option value="">Seleccione una provincia</option>
              {provincias.map((provincia) => (
                <option key={provincia.id} value={provincia.id}>
                  {provincia.nombre}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group
            controlId="formSeleccionarLocalidad"
            className={styles.formGroup}
          >
            <Form.Label className={styles.formLabel}>
              Seleccionar Localidad
            </Form.Label>
            <Form.Control
              className={styles.formControl}
              as="select"
              onChange={(e) =>
                setNuevaSucursal({
                  ...nuevaSucursal,
                  domicilio: {
                    ...nuevaSucursal.domicilio,
                    idLocalidad: Number(e.target.value),
                  },
                })
              }
              required
            >
              <option value="">Seleccione una localidad</option>
              {localidades.map((localidad) => (
                <option key={localidad.id} value={localidad.id}>
                  {localidad.nombre}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formCalle" className={styles.formGroup}>
            <Form.Label className={styles.formLabel}>
              Nombre de la Calle
            </Form.Label>
            <Form.Control
              className={styles.formControl}
              type="text"
              name="calle"
              value={nuevaSucursal.domicilio.calle}
              onChange={(e) =>
                setNuevaSucursal({
                  ...nuevaSucursal,
                  domicilio: {
                    ...nuevaSucursal.domicilio,
                    calle: e.target.value,
                  },
                })
              }
              required
            />
          </Form.Group>

          <Form.Group controlId="formNumeroCalle" className={styles.formGroup}>
            <Form.Label className={styles.formLabel}>
              Número de la Calle
            </Form.Label>
            <Form.Control
              className={styles.formControl}
              type="text"
              name="numero"
              value={nuevaSucursal.domicilio.numero}
              onChange={(e) =>
                setNuevaSucursal({
                  ...nuevaSucursal,
                  domicilio: {
                    ...nuevaSucursal.domicilio,
                    numero: Number(e.target.value),
                  },
                })
              }
              required
            />
          </Form.Group>

          <Form.Group controlId="formCodigoPostal" className={styles.formGroup}>
            <Form.Label className={styles.formLabel}>Código Postal</Form.Label>
            <Form.Control
              className={styles.formControl}
              type="text"
              name="cp"
              value={nuevaSucursal.domicilio.cp}
              onChange={(e) =>
                setNuevaSucursal({
                  ...nuevaSucursal,
                  domicilio: { ...nuevaSucursal.domicilio, cp: e.target.value },
                })
              }
              required
            />
          </Form.Group>

          <Form.Group controlId="formNumeroPiso" className={styles.formGroup}>
            <Form.Label className={styles.formLabel}>
              Ingresar Número de Piso
            </Form.Label>
            <Form.Control
              className={styles.formControl}
              type="number"
              name="piso"
              value={nuevaSucursal.domicilio.piso}
              onChange={(e) =>
                setNuevaSucursal({
                  ...nuevaSucursal,
                  domicilio: {
                    ...nuevaSucursal.domicilio,
                    piso: Number(e.target.value),
                  },
                })
              }
            />
          </Form.Group>

          <Form.Group
            controlId="formNumeroDepartamento"
            className={styles.formGroup}
          >
            <Form.Label className={styles.formLabel}>
              Ingresar Número de Departamento
            </Form.Label>
            <Form.Control
              className={styles.formControl}
              type="number"
              name="nroDpto"
              value={nuevaSucursal.domicilio.nroDpto}
              onChange={(e) =>
                setNuevaSucursal({
                  ...nuevaSucursal,
                  domicilio: {
                    ...nuevaSucursal.domicilio,
                    nroDpto: Number(e.target.value),
                  },
                })
              }
            />
          </Form.Group>

          <Form.Group controlId="formElegirImagen" className={styles.formGroup}>
            <Form.Label className={styles.formLabel}>Elegir Imagen</Form.Label>
            <Form.Control
              className={styles.formControl}
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setNuevaSucursal({
                    ...nuevaSucursal,
                    logo: e.target.files[0],
                  });
                }
              }}
            />
          </Form.Group>

          <Button
            className={styles.buttonPrimary}
            variant="primary"
            type="submit"
          >
            Guardar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
