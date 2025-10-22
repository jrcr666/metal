import React, { type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  onClose?: () => void;
  width?: number;
  height?: number;
  children: ReactNode;
  padding?: number;
}

export const Modal: React.FC<ModalProps> = ({
  onClose,
  width = 500,
  height,
  children,
  padding = 0,
}) => {
  return createPortal(
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
          // display: 'flex',
          // flexDirection: 'column',
          // alignItems: 'center',
          padding,
        }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};
