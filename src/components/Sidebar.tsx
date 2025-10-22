import { useMachinesStore } from '@store/machinesStore';
import { useEffect, useRef, useState } from 'react';
import MenuIcon from '../assets/img/Menu.png';
import { PackageModal } from '../screens/RodCut/components/PackageModal';

interface BasePackage {
  MachineId: string;
  Order: { OrderRef: string };
  Quantity: number;
  Time: string;
}

interface RodCutPackage extends BasePackage {
  RCPackageId: string;
  Material: { Name: string };
  Weight: number;
  BanquetteRef: string;
}

interface SchlatterPackage extends BasePackage {
  SCPackageId: string;
  ModelId: string;
  Location: string;
}

type PackageType = RodCutPackage | SchlatterPackage;

interface SidebarMenuProps {
  type: 'RodCut' | 'Schlatter';
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onStartFramework: () => void;
  packages: PackageType[];
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  title,
  isOpen,
  onClose,
  onStartFramework,
  packages = [],
}) => {
  const { machines } = useMachinesStore();

  const type = machines?.[0]?.Machine?.TypeId || '';

  const panelRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(isOpen);
  const [selectedPackage, setSelectedPackage] = useState<RodCutPackage | SchlatterPackage | null>(
    null
  );
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 350);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const handlePackageClick = (pkg: PackageType) => {
    if (type === 'RodCut') {
      onClose();
      setSelectedPackage(pkg as RodCutPackage);
      setModalOpen(true);
    } else if (type === 'Schlatter') {
      //const p = pkg as SchlatterPackage;
      //loadModal('GenericModal', `/app/EditPackage/${p.MachineId}/${p.SCPackageId}`);
      setSelectedPackage(pkg as SchlatterPackage);
      setModalOpen(true);
      onClose();
    }
  };

  const handleCloseModal = () => {
    setSelectedPackage(null);
    setModalOpen(false);
  };

  return (
    <>
      {/* Overlay */}
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
          }}
          onClick={e => e.stopPropagation()}
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
                  key={
                    type === 'RodCut'
                      ? (pkg as RodCutPackage).RCPackageId
                      : (pkg as SchlatterPackage).SCPackageId
                  }
                  className="MenuItem BanquetteTag"
                  onClick={() => handlePackageClick(pkg)}
                >
                  <div className="OrderRef">{pkg.Order.OrderRef}</div>
                  <div className="Quantity">{pkg.Quantity}</div>

                  {/* Campos específicos según tipo */}
                  {type === 'RodCut' ? (
                    <>
                      <div className="Material">{(pkg as RodCutPackage).Material.Name}</div>
                      <div className="Weight">{(pkg as RodCutPackage).Weight} Kg</div>
                      <div className="Banquette">{(pkg as RodCutPackage).BanquetteRef}</div>
                    </>
                  ) : (
                    <>
                      <div className="Material">{(pkg as SchlatterPackage).ModelId}</div>
                      <div className="Weight"></div>
                      <div className="Banquette">{(pkg as SchlatterPackage).Location}</div>
                    </>
                  )}

                  <div className="Time">{pkg.Time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal solo para RodCut */}
      {selectedPackage && isModalOpen && (
        <PackageModal type={type} pkg={selectedPackage} onClose={handleCloseModal} />
      )}
    </>
  );
};
