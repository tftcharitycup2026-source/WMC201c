import { Split } from './Split'

type Props = {
  num: string
  kicker: string
  title: string
  accentWords?: string[]
  light?: boolean
  className?: string
  align?: 'left' | 'center'
}

/** Nhãn chương + tiêu đề chương hiện theo từng từ. */
export function ChapterHeader({ num, kicker, title, accentWords = [], light, className = '', align = 'left' }: Props) {
  const accent = (w: string) => (accentWords.some((a) => a.split(' ').includes(w)) ? (light ? 'text-sand italic' : 'text-brick italic') : undefined)
  return (
    <header className={`${align === 'center' ? 'text-center' : ''} ${className}`}>
      <p className={`eyebrow mb-5 flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''} ${light ? 'text-sand' : 'text-ong'}`} data-reveal="fade">
        <span>Chương {num}</span>
        <span className={`h-px w-10 ${light ? 'bg-sand/60' : 'bg-ong/60'}`} />
        <span className="font-medium normal-case tracking-[0.08em]">{kicker}</span>
      </p>
      <Split as="h2" text={title} accent={accent} className="display text-[clamp(2.6rem,6.4vw,6.2rem)]" />
    </header>
  )
}
