import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface ZoomImageProps {
  src: string;
  className?: string;
  wrapperClassName?: string;
}

const ZoomImage = ({ src, className = '', wrapperClassName = '' }: ZoomImageProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span
        role="button"
        tabIndex={0}
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          setOpen(true);
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.stopPropagation();
            e.preventDefault();
            setOpen(true);
          }
        }}
        onDragStart={e => e.preventDefault()}
        className={`group relative inline-flex flex-shrink-0 cursor-zoom-in rounded-lg border bg-white overflow-hidden ${wrapperClassName}`}
      >
        <img src={src} alt="" draggable={false} className={`object-contain ${className}`} />
        <span className="absolute right-1 bottom-1 rounded bg-black/55 text-white p-1 opacity-80 group-hover:opacity-100">
          <Icon name="ZoomIn" size={14} />
        </span>
      </span>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-[95vw] sm:max-w-4xl max-h-[92vh] p-2 sm:p-4 bg-white flex items-center justify-center"
          onClick={e => e.stopPropagation()}
        >
          <DialogTitle className="sr-only">Просмотр изображения</DialogTitle>
          <img src={src} alt="" className="max-w-full max-h-[84vh] object-contain" />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ZoomImage;
