interface ZoomImageProps {
  src: string;
  className?: string;
}

const ZoomImage = ({ src, className = '' }: ZoomImageProps) => (
  <img
    src={src}
    alt=""
    draggable={false}
    className={`block max-w-full h-auto flex-shrink-0 rounded-lg border bg-white ${className}`}
  />
);

export default ZoomImage;
