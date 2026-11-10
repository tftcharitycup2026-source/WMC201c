import { Fragment, type ElementType, type ReactNode } from 'react'

type Props = {
  text: string
  as?: ElementType
  className?: string
  /** 'word' – tách theo từ, 'char' – tách theo từng chữ cái */
  by?: 'word' | 'char'
  /** Kiểu hiệu ứng được AutoAnimations nhận diện */
  anim?: 'words' | 'chars' | 'lines' | 'none'
  /** Hàm tô điểm cho một số từ khóa (trả về className) */
  accent?: (word: string, index: number) => string | undefined
  children?: ReactNode
  id?: string
}

/**
 * Tách chữ thành các span có mặt nạ để GSAP làm chữ xuất hiện
 * theo từng từ / từng chữ / từng dòng. Văn bản gốc được giữ nguyên
 * cho trình đọc màn hình qua aria-label.
 */
export function Split({ text, as: Tag = 'span', className, by = 'word', anim = by === 'char' ? 'chars' : 'words', accent, id }: Props) {
  const words = text.split(' ')
  return (
    <Tag className={className} data-split={anim} aria-label={text} id={id}>
      {words.map((w, i) => {
        const accentCls = accent?.(w, i)
        return (
          <Fragment key={i}>
            {by === 'char' ? (
              <span className={`word-nowrap ${accentCls ?? ''}`} aria-hidden>
                {Array.from(w).map((c, j) => (
                  <span className="sw" key={j}>
                    <span className="sw-i">{c}</span>
                  </span>
                ))}
              </span>
            ) : (
              <span className={`sw ${accentCls ?? ''}`} aria-hidden>
                <span className="sw-i">{w}</span>
              </span>
            )}
            {i < words.length - 1 ? ' ' : null}
          </Fragment>
        )
      })}
    </Tag>
  )
}
