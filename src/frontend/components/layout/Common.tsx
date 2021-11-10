import { Modal, Notification } from '@src/frontend/components/ui';
import { useModal } from '@src/frontend/hooks/use-modal';
import { useNoti } from '@src/frontend/hooks/use-noti';

export default function CommonLayout({ children }: { children: React.ReactNode }) {
  const { modal, closeModal } = useModal();
  const { noti, closeNoti } = useNoti();

  return (
    <div className="relative h-full w-full">
      <main className="relative h-full">{children}</main>

      <Modal {...modal} close={closeModal} />
      <Notification {...noti} close={closeNoti} />
    </div>
  );
}
