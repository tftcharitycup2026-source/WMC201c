import type { ReactNode } from 'react'
import { ImagePlus } from 'lucide-react'
import type { Media } from '../data/media'
import { useLightbox } from './Lightbox'

type Tone = 'ong' | 'earth' | 'brick' | 'sand' | 'coal'
type LabelPos = 'center' | 'corner' | 'none'

/** Khung chờ ảnh thật: họa tiết đá ong + mô tả ảnh cần bổ sung. */
export function Placeholder({ media, tone = 'ong', label = 'center' }: { media: Media; tone?: Tone; label?: LabelPos }) {
  return (
    <div className={`laterite tone-${tone} absolute inset-0`} role="img" aria-label={`Khung ảnh tư liệu: ${media.brief}`}>
      {label === 'center' && (
        <div className="absolute inset-0 grid place-items-center p-5">
          <div className="flex max-w-xs flex-col items-center gap-2 text-center text-paper/85">
            <span className="grid size-11 place-items-center rounded-full border border-paper/40 bg-coal/20 backdrop-blur-[2px]">
              <ImagePlus size={18} strokeWidth={1.5} />
            </span>
            <span className="eyebrow text-[0.6rem] text-paper/70">Khung ảnh tư liệu</span>
            <span className="text-xs leading-relaxed text-paper/80 md:text-[0.8rem]">{media.brief}</span>
          </div>
        </div>
      )}
      {label === 'corner' && (
        <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-paper/25 bg-coal/30 px-3 py-1.5 text-[0.65rem] text-paper/75 backdrop-blur-sm md:bottom-6 md:left-6">
          <ImagePlus size={13} strokeWidth={1.5} />
          <span>Khung ảnh tư liệu · {media.brief}</span>
        </div>
      )}
    </div>
  )
}

type Props = {
  media: Media
  className?: string
  innerClassName?: string
  tone?: Tone
  label?: LabelPos
  /** Cho phép nhấn để mở chế độ xem toàn màn hình */
  interactive?: boolean
  /** Bộ ảnh để chuyển qua lại trong chế độ xem toàn màn hình */
  group?: Media[]
  /** Hiện chú thích phủ khi rê chuột */
  hoverCaption?: boolean
  priority?: boolean
  children?: ReactNode
  /** Thuộc tính data-* bổ sung cho hiệu ứng cuộn */
  dataAnim?: Record<string, string>
}

export function ImageSlot({
  media,
  className = '',
  innerClassName = '',
  tone = 'ong',
  label = 'center',
  interactive = true,
  group,
  hoverCaption = false,
  priority = false,
  children,
  dataAnim,
}: Props) {
  const { open } = useLightbox()
  const items = group ?? [media]
  const openIt = () => open(items, Math.max(0, items.findIndex((x) => x.id === media.id)))

  return (
    <div
      className={`group relative overflow-hidden ${interactive ? 'media-hover' : ''} ${className}`}
      {...(interactive
        ? {
            role: 'button',
            tabIndex: 0,
            'aria-label': `Xem ảnh: ${media.caption}`,
            'data-cursor': 'image',
            onClick: openIt,
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                openIt()
              }
            },
          }
        : {})}
      {...dataAnim}
    >
      <div className={`media-inner absolute inset-0 ${innerClassName}`}>
        {media.src ? (
          <img
            src={media.src}
            alt={media.alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            className="size-full object-cover"
          />
        ) : (
          <Placeholder media={media} tone={tone} label={label} />
        )}
      </div>
      {hoverCaption && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-coal/85 to-transparent p-5 pt-14 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          <p className="quote-serif text-xl text-paper">{media.caption}</p>
        </div>
      )}
      {children}
    </div>
  )
}

/** Chú thích ảnh nhỏ kiểu tạp chí */
export function Caption({ children, className = '', light = false }: { children: ReactNode; className?: string; light?: boolean }) {
  return (
    <p className={`mt-3 flex items-baseline gap-2 text-[0.78rem] leading-snug ${light ? 'text-sand/80' : 'text-earth/70'} ${className}`}>
      <span className={`inline-block h-px w-6 shrink-0 translate-y-[-3px] ${light ? 'bg-sand/60' : 'bg-brick'}`} />
      <span>{children}</span>
    </p>
  )
}
