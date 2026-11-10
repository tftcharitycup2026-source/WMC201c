import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { INTERVIEW_VIDEO_EMBED, PART4, PART4_P1_SENTENCES, PART4_TITLE, PERSON } from '../data/content'
import { MEDIA } from '../data/media'
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '../lib/gsap'
import { Caption, ImageSlot } from './ImageSlot'
import { Split } from './Split'

const STORY = [MEDIA.ch4Workshop, MEDIA.ch4Portrait, MEDIA.ch4Craft]
const STORY_LABELS = ['Những người lưu giữ kỹ thuật', 'Chủ xưởng & nghệ nhân', 'Ba đời làm nghề']

/* Tên công đoạn theo đề cương; mô tả dựa trên nội dung bài viết, không bổ sung thông tin ngoài. */
const STEPS = [
  { title: 'Lựa chọn nguyên liệu', desc: 'Công đoạn khởi đầu, dựa vào sự am hiểu về vật liệu và kinh nghiệm tích lũy qua nhiều năm của người thợ.', media: MEDIA.step1 },
  { title: 'Khai thác và cắt đá', desc: 'Đá được lấy lên từ lòng đất rồi cắt thành khối — công việc đòi hỏi kinh nghiệm và sự khéo léo.', media: MEDIA.step2 },
  { title: 'Đẽo và tạo hình', desc: 'Từ những khối đá thô, người thợ chế tác thành nhiều hình dạng và kích thước khác nhau.', media: MEDIA.step3 },
  { title: 'Hoàn thiện sản phẩm', desc: 'Bước cuối cùng để tạo ra một sản phẩm đá ong hoàn chỉnh, được ông Long trực tiếp thực hiện và giám sát.', media: MEDIA.step4 },
]
const STEP_GROUP = STEPS.map((s) => s.media)
const ease = [0.16, 1, 0.3, 1] as const

function Highlight({ text, phrase }: { text: string; phrase: string }) {
  const [a, b] = text.split(phrase)
  return (
    <>
      {a}
      <mark className="bg-transparent font-semibold text-sand underline decoration-brick decoration-2 underline-offset-[6px]">{phrase}</mark>
      {b}
    </>
  )
}

export function Chapter4() {
  const root = useRef<HTMLElement>(null)
  const [story, setStory] = useState(0)
  const [step, setStep] = useState(0)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      // Bước kể chuyện: ảnh cố định đổi theo đoạn văn đang đọc
      q('.c4-step').forEach((el: Element, i: number) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 60%',
          end: 'bottom 60%',
          onToggle: (self) => self.isActive && setStory(i),
        })
      })

      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // Chuyển nền từ kem sang nâu đất đậm
        gsap.fromTo(
          root.current,
          { backgroundColor: '#F3EBDD' },
          { backgroundColor: '#493326', ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 95%', end: 'top 35%', scrub: true } },
        )
        // Ảnh xưởng hiện dần phía sau tiêu đề
        gsap.fromTo(
          q('.c4-bg'),
          { opacity: 0, scale: 1.15 },
          { opacity: 1, scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 60%', end: 'top -30%', scrub: true } },
        )
        gsap.from(q('.c4-video'), {
          y: 80,
          opacity: 0,
          duration: 1.4,
          ease: 'expo.out',
          scrollTrigger: { trigger: q('.c4-video')[0], start: 'top 90%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="nguoi-giu-nghe" ref={root} className="relative bg-earth text-paper" aria-label={PART4_TITLE}>
      {/* --- Tiêu đề + nhân vật --- */}
      <div className="relative overflow-hidden">
        <div className="c4-bg pointer-events-none absolute inset-0 opacity-100" aria-hidden>
          <ImageSlot media={MEDIA.ch4Workshop} tone="earth" label="none" interactive={false} className="size-full opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-earth/40 via-earth/70 to-earth" />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-32 text-center md:px-10 md:pt-48">
          <p className="eyebrow text-sand" data-reveal="fade">
            Chương 04
          </p>
          <Split as="h2" text={PART4_TITLE} className="display mx-auto mt-6 max-w-5xl text-[clamp(2.6rem,6.6vw,6.6rem)] uppercase" accent={(w) => (w === 'lửa' ? 'text-brick italic' : undefined)} />
          <div className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-2" data-reveal="up">
            <span className="h-px w-16 bg-brick" />
            <p className="quote-serif mt-3 text-3xl text-sand md:text-4xl">{PERSON.name}</p>
            <p className="text-sm tracking-wide text-paper/75">{PERSON.role}</p>
          </div>
        </div>

        {/* --- Video phỏng vấn (nhúng nguyên bản) --- */}
        <div className="c4-video relative mx-auto max-w-5xl px-5 pb-24 md:px-10 md:pb-36">
          <div className="relative aspect-video w-full overflow-hidden bg-coal shadow-[0_40px_80px_-30px_rgb(0_0_0_/_0.6)]">
            <iframe
              src={INTERVIEW_VIDEO_EMBED}
              title={`Video phỏng vấn ${PERSON.name}`}
              className="absolute inset-0 size-full"
              allow="autoplay; fullscreen"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <p className="mt-4 text-center text-xs text-sand/70">Video phỏng vấn {PERSON.name}, {PERSON.role.replace(/\.$/, '')}</p>
        </div>
      </div>

      {/* --- Câu chuyện ba thế hệ: ảnh cố định + chữ đổi theo cuộn --- */}
      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="mb-10 flex items-center gap-4 lg:mb-0">
          <span className="eyebrow text-sand">Câu chuyện ba thế hệ</span>
          <span className="h-px flex-1 bg-sand/20" />
        </div>
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="hidden lg:col-span-6 lg:block">
            <div className="sticky top-0 flex h-svh items-center py-24">
              <div className="relative aspect-[4/5] w-full">
                {STORY.map((m, i) => (
                  <div
                    key={m.id}
                    className={`absolute inset-0 transition-[opacity,clip-path] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      story === i ? 'opacity-100 [clip-path:inset(0_0_0_0)]' : 'pointer-events-none opacity-0 [clip-path:inset(8%_8%_8%_8%)]'
                    }`}
                  >
                    <ImageSlot media={m} group={STORY} tone={(['earth', 'ong', 'brick'] as const)[i]} className="size-full" />
                  </div>
                ))}
                <div className="absolute -bottom-6 -right-6 z-10 grid size-28 place-items-center rounded-full bg-brick text-center text-paper shadow-xl">
                  <span>
                    <span className="display block text-5xl leading-none">{String(story + 1).padStart(2, '0')}</span>
                    <span className="text-[0.6rem] tracking-[0.2em] text-paper/80">/ 03</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            {PART4_P1_SENTENCES.map((s, i) => (
              <article key={i} className="c4-step flex flex-col justify-center py-10 lg:min-h-[85svh] lg:py-0">
                <ImageSlot media={STORY[i]} group={STORY} tone={(['earth', 'ong', 'brick'] as const)[i]} className="mb-6 aspect-[4/3] w-full lg:hidden" />
                <p className={`eyebrow mb-5 transition-colors duration-700 ${story === i ? 'text-brick' : 'text-sand/60'}`}>
                  {String(i + 1).padStart(2, '0')} — {STORY_LABELS[i]}
                </p>
                {i === 2 && (
                  <div className="mb-8 flex items-end gap-4" data-reveal="up">
                    <span className="display text-[8rem] leading-[0.75] text-brick md:text-[11rem]">3</span>
                    <span className="quote-serif pb-2 text-3xl leading-tight text-sand md:text-4xl">
                      đời làm
                      <br />
                      nghề đá ong
                    </span>
                  </div>
                )}
                <p
                  className={`story text-justify transition-opacity duration-700 ${i === 0 ? 'text-[1.15rem]' : 'text-[1.2rem] md:!text-[1.4rem]'} !leading-[1.7] ${
                    story === i ? 'opacity-100' : 'lg:opacity-35'
                  }`}
                >
                  {i === 2 ? <Highlight text={s} phrase="có tới ba đời làm nghề đá ong" /> : s}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* --- Quy trình chế tác --- */}
      <div className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-sand" data-reveal="fade">Quy trình chế tác đá ong</p>
            <h3 className="display mt-4 text-[clamp(2.4rem,5vw,4.6rem)]" data-split="words">
              Bốn công đoạn của một khối đá
            </h3>
          </div>
          <div className="story text-paper/85 lg:col-span-6 lg:col-start-7 lg:pt-8" data-reveal="right">
            <p>{PART4.p2}</p>
          </div>
        </div>

        {/* Máy tính: các tấm mở rộng ngang */}
        <div className="mt-16 hidden h-[560px] gap-3 lg:flex" role="tablist" aria-label="Các công đoạn chế tác" data-reveal="up">
          {STEPS.map((s, i) => {
            const on = step === i
            return (
              <motion.div
                key={s.title}
                layout
                transition={{ duration: 0.8, ease }}
                className={`relative overflow-hidden ${on ? 'flex-[4]' : 'flex-1'} min-w-0`}
              >
                <button
                  role="tab"
                  aria-selected={on}
                  onClick={() => setStep(i)}
                  onMouseEnter={() => setStep(i)}
                  className="absolute inset-0 z-20 text-left"
                  aria-label={`Công đoạn ${i + 1}: ${s.title}`}
                  data-cursor="hover"
                />
                <ImageSlot media={s.media} tone={(['ong', 'brick', 'earth', 'sand'] as const)[i]} label={on ? 'center' : 'none'} interactive={false} className="absolute inset-0" />
                <div className={`absolute inset-0 transition-colors duration-700 ${on ? 'bg-gradient-to-t from-coal/90 via-coal/20 to-transparent' : 'bg-coal/55'}`} />
                <span className={`display absolute left-6 top-4 z-10 leading-none transition-all duration-700 ${on ? 'text-[9rem] text-sand' : 'text-7xl text-paper/70'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {!on && (
                  <span className="absolute bottom-8 left-6 z-10 origin-bottom-left -rotate-90 translate-x-6 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.2em] text-paper/80">
                    {s.title}
                  </span>
                )}
                <AnimatePresence>
                  {on && (
                    <motion.div
                      key="c"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.6, delay: 0.25, ease }}
                      className="absolute inset-x-0 bottom-0 z-10 max-w-xl p-8"
                    >
                      <h4 className="display text-4xl">{s.title}</h4>
                      <p className="mt-3 text-[0.95rem] leading-relaxed text-paper/85">{s.desc}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Điện thoại / máy tính bảng: danh sách mở rộng dọc */}
        <ol className="mt-12 space-y-3 lg:hidden">
          {STEPS.map((s, i) => {
            const on = step === i
            return (
              <li key={s.title} className="overflow-hidden border border-sand/20">
                <button onClick={() => setStep(i)} aria-expanded={on} className="flex w-full items-center gap-5 p-4 text-left">
                  <span className={`display text-5xl leading-none ${on ? 'text-brick' : 'text-sand/60'}`}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="display text-2xl">{s.title}</span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.6, ease }} className="overflow-hidden">
                      <ImageSlot media={s.media} group={STEP_GROUP} tone={(['ong', 'brick', 'earth', 'sand'] as const)[i]} className="aspect-[16/10] w-full" />
                      <p className="p-4 text-[0.95rem] leading-relaxed text-paper/85">{s.desc}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ol>

        {/* Trực tiếp thực hiện và giám sát */}
        <div className="mt-24 grid items-center gap-10 md:mt-36 lg:grid-cols-12">
          <figure className="lg:col-span-5">
            <ImageSlot media={MEDIA.ch4Supervise} tone="ong" className="aspect-[4/5] w-full" dataAnim={{ 'data-mask': 'left' }} />
            <Caption light>{MEDIA.ch4Supervise.caption}</Caption>
          </figure>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="quote-serif text-[clamp(1.8rem,3vw,2.8rem)] leading-tight text-sand" data-split="words">
              Tay nghề của một nghệ nhân gắn bó với nghề truyền thống
            </p>
            <div className="story mt-8 text-paper/85" data-reveal="up">
              <p>{PART4.p3}</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Những thách thức trong việc giữ nghề --- */}
      <div className="relative overflow-hidden bg-coal py-24 md:py-40">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 md:px-10 lg:grid-cols-12">
          <figure className="relative lg:col-span-7">
            <ImageSlot media={MEDIA.ch4Hands} tone="coal" className="aspect-[4/3] w-full lg:aspect-[5/4]" dataAnim={{ 'data-mask': 'center' }} />
            <Caption light>{MEDIA.ch4Hands.caption}</Caption>
          </figure>
          <div className="flex flex-col justify-center lg:col-span-5">
            <p className="eyebrow text-brick" data-reveal="fade">Những thách thức trong việc giữ nghề</p>
            <p className="display mt-6 text-[clamp(2rem,3.6vw,3.4rem)] leading-[1.05] text-paper" data-split="words">
              Khi lớp thợ trẻ chọn những con đường khác
            </p>
            <div className="story mt-8 text-paper/80" data-reveal="up">
              <p>
                <Highlight text={PART4.p4} phrase="lực lượng lao động trẻ có xu hướng lựa chọn những công việc khác" />
              </p>
            </div>
          </div>
        </div>

        <blockquote className="mx-auto mt-24 max-w-5xl px-5 text-center md:mt-36 md:px-10">
          <span className="mx-auto mb-8 block h-16 w-px bg-brick" aria-hidden />
          <p className="quote-serif text-[clamp(1.6rem,3.2vw,3rem)] leading-[1.3] text-sand" data-split="lines">
            {PART4.closing.split(' ').map((w, i) => (
              <span key={i} className="sw">
                <span className="sw-i">{w}&nbsp;</span>
              </span>
            ))}
          </p>
        </blockquote>
      </div>
    </section>
  )
}
