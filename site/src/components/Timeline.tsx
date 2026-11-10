import { useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MEDIA, type Media } from '../data/media'
import { ImageSlot } from './ImageSlot'

type Stage = { label: string; summary: string; excerpt: string; media: Media }

/* Nhãn & tóm tắt theo đề cương; phần trích là nguyên văn Phần 1. */
const STAGES: Stage[] = [
  {
    label: 'Khởi nguồn',
    summary: 'Đá ong trong đời sống xây dựng truyền thống.',
    excerpt: 'Với đặc điểm dễ khai thác, có độ bền cao và khả năng thích nghi với điều kiện khí hậu, đá ong từng được người dân sử dụng rộng rãi trong xây dựng.',
    media: MEDIA.tl1,
  },
  {
    label: 'Hình thành nghề',
    summary: 'Kinh nghiệm khai thác và xử lý đá được tích lũy qua nhiều thế hệ.',
    excerpt: 'Ban đầu, người dân chủ yếu lấy đá từ lòng đất để xây dựng nhà ở, tường rào, giếng nước và các công trình sinh hoạt.',
    media: MEDIA.tl2,
  },
  {
    label: 'Phát triển',
    summary: 'Hoạt động khai thác và chế tác ngày càng đa dạng.',
    excerpt: 'Hoạt động khai thác, gia công từng bước phát triển thành nghề truyền thống tại một số địa phương thuộc Thạch Thất.',
    media: MEDIA.tl3,
  },
  {
    label: 'Hiện tại',
    summary: 'Nghề đá ong tiếp tục được duy trì trong bối cảnh vật liệu hiện đại phát triển.',
    excerpt: 'Ngày nay, dù vật liệu xây dựng hiện đại ngày càng phổ biến, nghề đá ong vẫn được duy trì tại địa phương.',
    media: MEDIA.tl4,
  },
]
const GROUP = STAGES.map((s) => s.media)
const ease = [0.16, 1, 0.3, 1] as const

function Panel({ s, i }: { s: Stage; i: number }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
      <motion.div
        initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        exit={{ clipPath: 'inset(0% 0% 0% 100%)' }}
        transition={{ duration: 0.9, ease }}
      >
        <ImageSlot media={s.media} group={GROUP} tone={(['earth', 'ong', 'brick', 'sand'] as const)[i]} className="aspect-[4/3] w-full" />
      </motion.div>
      <motion.div
        className="flex flex-col justify-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.7, delay: 0.15, ease }}
      >
        <span className="display text-7xl text-brick/90 lg:text-9xl">{String(i + 1).padStart(2, '0')}</span>
        <h4 className="display mt-2 text-4xl lg:text-5xl">{s.label}</h4>
        <p className="mt-4 text-lg font-medium leading-relaxed text-earth">{s.summary}</p>
        <blockquote className="mt-6 border-l-2 border-brick pl-5">
          <p className="quote-serif text-xl leading-snug text-coal/80 lg:text-2xl">“{s.excerpt}”</p>
        </blockquote>
      </motion.div>
    </div>
  )
}

export function Timeline() {
  const [active, setActive] = useState(0)
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(STAGES.length - 1, a + 1))
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(0, a - 1))
    }
  }

  return (
    <div className="relative">
      {/* --- Máy tính: dòng thời gian ngang --- */}
      <div className="hidden lg:block">
        <div className="relative" role="tablist" aria-label="Các giai đoạn phát triển nghề đá ong" onKeyDown={onKey}>
          <div className="absolute left-0 right-0 top-[27px] h-px bg-earth/20" />
          <motion.div
            className="absolute left-0 top-[26px] h-[3px] origin-left bg-brick"
            style={{ right: 0 }}
            animate={{ scaleX: (active + 0.5) / STAGES.length }}
            transition={{ duration: 0.9, ease }}
          />
          <ol className="relative grid grid-cols-4">
            {STAGES.map((s, i) => (
              <li key={s.label} className="flex justify-center">
                <button
                  role="tab"
                  aria-selected={active === i}
                  tabIndex={active === i ? 0 : -1}
                  onClick={() => setActive(i)}
                  className="group flex flex-col items-center gap-4 px-4 text-center"
                >
                  <span className="relative grid size-14 place-items-center">
                    {active === i && <span className="absolute inset-2 animate-[pulse-ring_2s_ease-out_infinite] rounded-full bg-brick" />}
                    <span
                      className={`relative grid size-10 place-items-center rounded-full border text-xs font-semibold transition-all duration-500 ${
                        active === i
                          ? 'scale-110 border-brick bg-brick text-paper'
                          : i < active
                            ? 'border-brick bg-paper text-brick'
                            : 'border-earth/30 bg-paper text-earth/60 group-hover:scale-110 group-hover:border-brick'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </span>
                  <span className={`display text-2xl transition-colors xl:text-3xl ${active === i ? 'text-brick' : 'text-coal/60 group-hover:text-coal'}`}>{s.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-14 min-h-[420px]" role="tabpanel" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div key={active}>
              <Panel s={STAGES[active]} i={active} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* --- Điện thoại / máy tính bảng: dòng thời gian dọc --- */}
      <ol className="relative border-l border-earth/20 pl-8 lg:hidden">
        <motion.span
          className="absolute -left-px top-0 w-[3px] origin-top bg-brick"
          style={{ bottom: 0 }}
          animate={{ scaleY: (active + 1) / STAGES.length }}
          transition={{ duration: 0.8, ease }}
          aria-hidden
        />
        {STAGES.map((s, i) => (
          <li key={s.label} className="relative pb-8 last:pb-0">
            <span
              className={`absolute -left-[45px] top-1 grid size-7 place-items-center rounded-full border text-[0.6rem] font-semibold transition-colors ${
                active === i ? 'border-brick bg-brick text-paper' : i < active ? 'border-brick bg-paper text-brick' : 'border-earth/30 bg-paper text-earth/60'
              }`}
            >
              {i + 1}
            </span>
            <button onClick={() => setActive(i)} aria-expanded={active === i} className="w-full text-left">
              <span className={`display block text-3xl ${active === i ? 'text-brick' : 'text-coal/70'}`}>{s.label}</span>
              <span className="mt-1 block text-sm text-earth/80">{s.summary}</span>
            </button>
            <AnimatePresence initial={false}>
              {active === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease }}
                  className="overflow-hidden"
                >
                  <div className="pt-5">
                    <ImageSlot media={s.media} group={GROUP} tone={(['earth', 'ong', 'brick', 'sand'] as const)[i]} className="aspect-[4/3] w-full" />
                    <p className="quote-serif mt-4 text-xl leading-snug text-coal/80">“{s.excerpt}”</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ol>
    </div>
  )
}
