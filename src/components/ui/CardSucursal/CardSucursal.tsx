// src/components/SucursalCard/SucursalCard.tsx
import React from "react";
import { Card, Button } from "react-bootstrap";
import { ISucursal } from "../../../types/dtos/sucursal/ISucursal";
import styles from "./CardSucursal.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSucursalActivo } from "../../../redux/slices/SucursalReducer";

interface CardSucursalProps {
  sucursal: ISucursal;
  onSelect?: () => void;
}



export const CardSucursal: React.FC<CardSucursalProps> = ({
  sucursal,
  onSelect,
}) => {


  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(setSucursalActivo({sucursalActivo: sucursal}))
    navigate('/sucursal');
  };


  return (
    <div className="card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <Card className={styles.sucursalCard}>
        <Card.Body>
          <div className={styles.cardHeader}>
            <Card.Title>{sucursal.nombre}</Card.Title>
            {sucursal.esCasaMatriz && (
              <span className={styles.casaMatrizBadge}>Casa Matriz</span>
            )}
          </div>
          <Card.Text>
            <strong>Dirección:</strong> {sucursal.calle}
            <br />
            <strong>Horario:</strong> {sucursal.horarioApertura} -{" "}
            {sucursal.horarioCierre}
          </Card.Text>
          <div className={styles.cardActions}>
            <Button variant="primary" onClick={onSelect}>
              Ver Detalles
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
    
  );
};
