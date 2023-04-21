import React, { useLayoutEffect } from 'react';
import Modal from 'react-modal';

interface ModalProps {
  visible: boolean;
  close: () => void;
  children: React.ReactNode;
}
export const Moddal: React.FC<ModalProps> = ({ visible, children, close }) => {
  useLayoutEffect(() => {
    if (visible) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [visible]);
  return (
    <Modal
      isOpen={visible}
      style={{
        overlay: {
          zIndex: 1001,
          backgroundColor: 'rgba(0,0,0,.75)',
        },
        content: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          width: '100%',
          borderRadius: 0,
          background: 'transparent',
          border: 'none',
          padding: 0,
        },
      }}
    >
      <div
        onClick={close}
        className="z-1002 xl:absolute w-100% h-100% overflow-y-auto pt-61px xl:py-96px flex flex-col xl:items-center xl:justify-start"
      >
        <div className="xl:hidden pointer-events-none flex-1"></div>
        <div
          onClick={(e) => e.stopPropagation()}
          className="xl:p-20px p-14px rounded-t-10px xl:rounded-20px bg-#34343B"
        >
          <div>{children}</div>
        </div>
      </div>
    </Modal>
  );
};
