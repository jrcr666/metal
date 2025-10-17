import React from 'react';
import type { ReactNode } from 'react';

interface ModalProps {
  onClose?: () => void;
  width?: number;
  height?: number;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ onClose, width = 500, height, children }) => {
  return (
    <div
      id="ModalBack"
      onClick={() => onClose?.()}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: 10,
        zIndex: 1000,
      }}
    >
      <div
        id="ModalZone"
        onClick={e => e.stopPropagation()}
        style={{
          width,
          height: height ?? 'auto',
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 20,
        }}
      >
        {children}
      </div>
    </div>
  );
};
