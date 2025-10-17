import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as useMenuHook from '../../../hooks/useMenu';
import * as appStore from '../../../store/appStore';
import { type AppContextType } from '../../../store/appStore';
import { AppContent } from '../AppContent';

// Mocks de hooks
vi.mock('../../hooks/useBackButton', () => ({ useBackButton: vi.fn() }));
vi.mock('../../hooks/useDeviceEvents', () => ({ useDeviceEvents: vi.fn() }));
vi.mock('../../hooks/useMainFramework', () => ({
  useMainFramework: () => ({
    startFramework: vi.fn() as () => void,
    endThird: vi.fn() as () => void,
    startMenu: vi.fn() as () => void,
    endMenu: vi.fn() as () => void,
    hideModal: vi.fn() as () => void,
  }),
}));
vi.mock('../../hooks/useMenu');
vi.mock('../../store/appStore');
vi.mock('../modals/OperatorModal', () => ({
  OperatorModal: ({ stationId }: { stationId: number; onClose: () => void }) => (
    <div data-testid="operator-modal">OperatorModal {stationId}</div>
  ),
}));
vi.mock('../HeaderContent', () => ({ HeaderContent: () => <div>HeaderContent</div> }));
vi.mock('../DevideDetails', () => ({ DeviceDetails: () => <div>DeviceDetails</div> }));
vi.mock('../../pages/StationsList/StationsList', () => ({
  StationsList: () => <div>StationsList</div>,
}));

describe('AppContent', () => {
  let startMenuMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock del hook useMenu
    startMenuMock = vi.fn();
    vi.spyOn(useMenuHook, 'useMenu').mockReturnValue({ startMenu: startMenuMock });

    // Mock del hook useAppContext
    vi.spyOn(appStore, 'useAppContext').mockReturnValue({
      title: { stationId: 1 },
      showOperatorModal: true,
      setShowOperatorModal: vi.fn(),
      setTitle: vi.fn(),
    } as unknown as AppContextType);
  });

  // it('renders main components', () => {
  //   render(<AppContent />);
  //   expect(screen.getByText('HeaderContent')).toBeDefined();
  //   expect(screen.getByText('StationsList')).toBeDefined();
  //   expect(screen.getByTestId('operator-modal')).toHaveTextContent('OperatorModal 1');
  // });

  it('calls startMenu when MenuButton is clicked', () => {
    render(<AppContent />);
    const menuButton = screen.getByAltText('Menu');
    fireEvent.click(menuButton);
    expect(startMenuMock).toHaveBeenCalled();
  });
});
