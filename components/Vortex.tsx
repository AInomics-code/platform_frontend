'use client';

import React from "react";

export default function Vortex() {
    return (
        <div
            className="vortex-icon active"
            style={{
                width: "60px",
                height: "60px",
                // El CSS ya define --vortex-size, pero lo forzamos aquí para consistencia
                // y para que los blades escalen bien
                // Si quieres que sea configurable, puedes exponerlo como prop
                // pero por ahora lo dejamos fijo
                // @ts-ignore
                '--vortex-size': '60px',
            } as React.CSSProperties}
        >
            <div className="vortex-blade" />
            <div className="vortex-blade" />
            <div className="vortex-blade" />
            <div className="vortex-blade" />
            <div className="vortex-blade" />
        </div>
    );
}

// Estilos en globals.css:
// .vortex-pulse {
//   background: radial-gradient(circle at 50% 50%, #f43f5e 80%, #be123c 100%);
//   border-radius: 50%;
//   box-shadow: 0 0 24px 0 #f43f5e66;
//   animation: vortex-pulse 1.2s infinite cubic-bezier(0.4,0,0.6,1);
// }
// @keyframes vortex-pulse {
//   0%, 100% { transform: scale(1); opacity: 1; }
//   50% { transform: scale(1.18); opacity: 0.65; }
// } 