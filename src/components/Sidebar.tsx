import { useEffect, useRef, useState } from 'react';
import MenuIcon from '../assets/img/Menu.png';
import { PackageModal } from './modals/PackageModal';

interface PackageRodCut {
  MachineId: string;
  RCPackageId: string;
  Order: { OrderRef: string };
  Quantity: number;
  Material: { Name: string };
  Weight: number;
  Location: string;
  Time: string;
  BanquetteRef: string;
}

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onStartFramework: () => void;
  packages: PackageRodCut[];
  title: string;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  title,
  isOpen,
  onClose,
  onStartFramework,
  packages = [],
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(isOpen);

  // Modal local
  const [selectedPackage, setSelectedPackage] = useState<PackageRodCut | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 350);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const handlePackageClick = (pkg: PackageRodCut) => {
    setSelectedPackage(pkg);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPackage(null);
    setModalOpen(false);
  };

  return (
    <>
      {/* Overlay + Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: isOpen ? 'rgba(0,0,0,0.3)' : 'transparent',
          opacity: isOpen ? 1 : 0,
          visibility: visible ? 'visible' : 'hidden',
          transition: 'opacity 0.35s ease, background 0.35s ease',
          zIndex: 9998,
        }}
        onClick={onClose}
      >
        {/* Sidebar Panel */}
        <div
          ref={panelRef}
          className="MENU_Frame"
          style={{
            position: 'absolute',
            top: 0,
            left: isOpen ? '0px' : '-300px',
            width: '300px',
            height: '100vh',
            boxShadow: '2px 0 8px rgba(0,0,0,0.3)',
            transition: 'left 0.35s ease',
            zIndex: 9999,
            background: 'white',
          }}
          onClick={e => e.stopPropagation()} // evita cerrar al hacer clic dentro
        >
          <div className="MENU_TopBar" id="MENU_TopBar" onClick={onClose}>
            <div className="Menu_Title" id="Name_Zone" onClick={onStartFramework}>
              {title ?? 'Menú'}
            </div>
            <img className="MainScreen_MenuIcon" src={MenuIcon} alt="Menu Icon" />
          </div>

          <div className="MENU_Body" id="MENU_ScrollContainer">
            <div className="MENU_Scroll" id="MENU_bodyFramework">
              {packages.map(pkg => (
                <div
                  key={pkg.RCPackageId}
                  className="MenuItem BanquetteTag"
                  onClick={() => {
                    onClose();
                    handlePackageClick(pkg);
                  }}
                >
                  <div className="OrderRef">{pkg.Order.OrderRef}</div>
                  <div className="Quantity">{pkg.Quantity}</div>
                  <div className="Material">{pkg.Material.Name}</div>
                  <div className="Weight">{pkg.Weight} Kg</div>
                  <div className="Banquette">{pkg.BanquetteRef}</div>
                  <div className="Time">{pkg.Time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedPackage && isModalOpen && (
        <PackageModal pkg={selectedPackage} onClose={handleCloseModal} />
      )}
    </>
  );
};
