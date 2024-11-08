// src/components/SucursalCard/SucursalCard.tsx
import React from "react";
import { Card, Button } from "react-bootstrap";
import { ISucursal } from "../../types/dtos/sucursal/ISucursal";
import styles from "./CardSucursal.module.css";

interface CardSucursalProps {
  sucursal: ISucursal;
  onSelect?: () => void;
}

export const CardSucursal: React.FC<CardSucursalProps> = ({
  sucursal,
  onSelect,
}) => {
  return (
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
  );
};
