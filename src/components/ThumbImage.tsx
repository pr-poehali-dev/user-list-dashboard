import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const ThumbImage = ({ src }: { src: string }) => (
  <span onClick={e => e.stopPropagation()} className="flex-shrink-0">
    <Dialog>
      <ThumbTrigger src={src} />
      <DialogContent className="max-w-[95vw] w-auto p-2 sm:max-w-fit max-h-[95vh] overflow-auto">
        <DialogTitle className="sr-only">Изображение</DialogTitle>
        <img src={src} alt="" className="block max-w-full h-auto mx-auto" />
      </DialogContent>
    </Dialog>
  </span>
);

const ThumbTrigger = ({ src }: { src: string }) => (
  <DialogTrigger asChild>
    <span
      role="button"
      tabIndex={0}
      title="Открыть полностью"
      className="block w-24 h-24 sm:w-28 sm:h-28 rounded-lg border bg-white overflow-hidden cursor-zoom-in"
    >
      <img src={src} alt="" draggable={false} className="w-full h-full object-contain" />
    </span>
  </DialogTrigger>
);

export default ThumbImage;
