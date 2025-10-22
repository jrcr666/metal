import { useServerManager } from '@hooks/screens/useServerManager';
import React, { useState } from 'react';
import { Modal } from '@components/modals/Modal';

type AdminAccessModalProps = {
  onClose?: () => void;
};

const AdminAccessModal: React.FC<AdminAccessModalProps> = ({ onClose }) => {
  const { getAdmin } = useServerManager();
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    await getAdmin(password);
    onClose?.();
  };

  return (
    <Modal onClose={onClose}>
      <div className="SP_MachineName">Contraseña administración</div>
      <input
        className="form-control NB_AdminPw"
        id="AdminPw"
        name="AdminPw"
        type="password"
        placeholder="Introduce contraseña administración"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="button" className="btn btn-primary NB_BanquetteBtn" onClick={handleSubmit}>
        Entrar
      </button>
    </Modal>
  );
};

export default AdminAccessModal;
