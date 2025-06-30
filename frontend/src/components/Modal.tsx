import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ModalProps {
  trigger: React.ReactNode;
  title: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({ trigger, title, children, open, onOpenChange }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

 
  const mobileClasses = `
    fixed left-2 top-72
    max-w-[calc(100vw-1rem)] 
    max-h-[calc(100vh-3rem)] 
    w-[calc(100vw-1rem)]
    transform-none
  `;

  const desktopClasses = `
    fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
    max-w-lg md:max-w-2xl 
    max-h-[85vh] 
    w-auto
  `;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent 
        className={`
          ${isMobile ? mobileClasses : desktopClasses}
          overflow-y-auto p-0
          z-[9999]
          bg-white shadow-2xl rounded-lg
          transition-none animate-none
        `}
        style={{
          transition: 'none !important',
          animation: 'none !important'
        }}
      >
        <DialogHeader className={`${title ? 'p-4 sm:p-6' : 'sr-only'}`}>
          <DialogTitle className="text-primary text-lg sm:text-xl">{title}</DialogTitle>
        </DialogHeader>
        <div className={`${title ? 'px-4 pb-4 sm:px-6 sm:pb-6' : 'p-4 sm:p-6'}`}>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;