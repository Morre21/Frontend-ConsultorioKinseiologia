import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Turno {
  id: number;
  fecha: string;
  hora: string;
  estado: string;
  importeTotal: number;
  paciente: number;
  kinesiologo: number;
}

const PacienteDashboard: React.FC = () => {
  const [turnosPendientes, setTurnosPendientes] = useState<Turno[]>([]);
  const [turnosRealizados, setTurnosRealizados] = useState<Turno[]>([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerDatosPaciente = async () => {
      try {
        const response = await fetch('/api/pacientes/turnos', {
          method: 'GET',
          credentials: 'include', // Incluye cookies en la solicitud
        });
        if (!response.ok) {
          throw new Error('Error en la respuesta de la API');
        }
        const data = await response.json();

        // Almacena nombre y apellido del paciente
        setNombre(data.nombre);
        setApellido(data.apellido);

        // Divide los turnos en pendientes y realizados
        setTurnosPendientes(data.turnos.filter((turno: Turno) => turno.estado === 'Activo'));
        setTurnosRealizados(data.turnos.filter((turno: Turno) => turno.estado === 'Realizado'));
      } catch (error) {
        console.error('Error al obtener los datos del paciente:', error);
        navigate('/login'); // Redirige al login si hay un error
      }
    };

    obtenerDatosPaciente();
  }, [navigate]);

  return (
    <div className="dashboard">
      <div className="container pt-4 pb-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="dashboard-title">Bienvenido, {nombre} {apellido}</h1>
        </div>
  
        {/* Turnos Pendientes */}
        <div className="dashboard-card mb-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="pending-icon">
              <i className="bi bi-clock-history"></i>
            </span>
            <h2 className="section-title">Turnos Pendientes</h2>
          </div>
  
          {turnosPendientes.map((turno, index) => (
            <div key={index} className="appointment-row">
              <div className="d-flex align-items-center">
                <span className="appointment-icon">
                  <i className="bi bi-calendar"></i>
                </span>
                <span className="me-2">{new Date(turno.fecha).toLocaleDateString()}</span>
                <span className="appointment-icon me-2">
                  <i className="bi bi-clock"></i>
                </span>
                <span className="me-2">{turno.hora}</span>
                <span className="text-secondary">- Kinesiologo #{turno.kinesiologo}</span>
              </div>
  
              <div className="appointment-actions">
                <button className="btn btn-link text-primary p-1">
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button className="btn btn-link text-danger p-1">
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          ))}
  
          <button className="btn btn-dark w-100 mt-3">Solicitar Nuevo Turno</button>
        </div>
  
        {/* Turnos Realizados */}
        <div className="dashboard-card mb-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="check-icon">
              <i className="bi bi-check-lg"></i>
            </span>
            <h2 className="section-title">Turnos Asistidos</h2>
          </div>
  
          {turnosRealizados.map((turno, index) => (
            <div key={index} className="appointment-row">
              <div className="d-flex align-items-center">
                <span className="appointment-icon me-2">
                  <i className="bi bi-calendar"></i>
                </span>
                <span className="me-2">{new Date(turno.fecha).toLocaleDateString()}</span>
                <span className="appointment-icon me-2">
                  <i className="bi bi-clock"></i>
                </span>
                <span className="me-2">{turno.hora}</span>
                <span className="text-secondary">- Kinesiologo #{turno.kinesiologo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
};

export default PacienteDashboard;
