import { PART1, PART1_TITLE } from '../data/content'
import { MEDIA } from '../data/media'
import { ChapterHeader } from './ChapterHeader'
import { Caption, ImageSlot } from './ImageSlot'
import { Timeline } from './Timeline'

const GROUP = [MEDIA.ch1Natural, MEDIA.ch1Earth, MEDIA.ch1Wall]

/** CHƯƠNG 01 — Khởi nguồn từ lòng đất */
export function Chapter1() {
  return (
    <section id="lich-su" className="relative overflow-hidden bg-paper pb-28 pt-28 md:pb-40 md:pt-40" aria-label={PART1_TITLE}>
      {/* Số chương lớn ở nền */}
      <div className="pointer-events-none absolute -right-[4vw] top-10 text-ong/25" data-velocity aria-hidden>
        <span className="chapter-num block text-[44vw] md:text-[34vw]" data-parallax="0.35">
          01
        </span>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <ChapterHeader num="01" kicker="Khởi nguồn từ lòng đất" title={PART1_TITLE} accentWords={['đá ong']} className="max-w-5xl" />

        {/* Khối 1: ảnh lớn bên trái + đoạn văn lệch phải */}
        <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12 lg:gap-0">
          <figure className="lg:col-span-7">
            <ImageSlot media={MEDIA.ch1Natural} group={GROUP} tone="ong" className="aspect-[4/5] w-full md:aspect-[5/4] lg:aspect-[4/5]" dataAnim={{ 'data-mask': 'up' }} />
            <Caption>{MEDIA.ch1Natural.caption}</Caption>
          </figure>
          <div className="story lg:col-span-4 lg:col-start-9 lg:pt-[38%]" data-reveal="right">
            <p className="dropcap">{PART1[0]}</p>
          </div>
        </div>

        {/* Trích đoạn nổi bật (nguyên văn Phần 1) */}
        <blockquote className="relative mx-auto my-20 max-w-4xl text-center md:my-32" data-reveal="scale">
          <span className="display absolute -top-10 left-1/2 -translate-x-1/2 text-8xl text-brick/30" aria-hidden>
            “
          </span>
          <p className="quote-serif text-[clamp(1.7rem,3.6vw,3.2rem)] leading-[1.2] text-earth" data-split="lines">
            {'Những kinh nghiệm khai thác, lựa chọn và xử lý đá được tích lũy qua nhiều thế hệ.'.split(' ').map((w, i) => (
              <span key={i} className="sw">
                <span className="sw-i">{w}&nbsp;</span>
              </span>
            ))}
          </p>
        </blockquote>

        {/* Khối 2: đoạn văn trái + cụm ảnh chồng lớp bên phải */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-0">
          <div className="story lg:col-span-5 lg:col-start-2" data-reveal="left">
            <p>{PART1[1]}</p>
            <p>{PART1[2]}</p>
          </div>
          <div className="relative lg:col-span-5 lg:col-start-8">
            <figure>
              <ImageSlot media={MEDIA.ch1Earth} group={GROUP} tone="earth" className="aspect-[3/4] w-full lg:w-[85%]" dataAnim={{ 'data-mask': 'down' }} />
              <Caption>{MEDIA.ch1Earth.caption}</Caption>
            </figure>
            <figure className="relative -mt-24 ml-auto w-[62%] lg:absolute lg:-bottom-28 lg:right-0 lg:mt-0 lg:w-[52%]" data-parallax="0.4">
              <ImageSlot media={MEDIA.ch1Wall} group={GROUP} tone="brick" className="aspect-square w-full shadow-[0_30px_60px_-20px_rgb(41_38_33_/_0.5)] ring-8 ring-paper" />
            </figure>
          </div>
        </div>

        <div className="story mt-20 max-w-2xl lg:ml-[8.33%] lg:mt-40" data-reveal="up">
          <p>{PART1[3]}</p>
        </div>

        {/* Timeline tương tác */}
        <div className="mt-24 md:mt-36">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4 border-t border-earth/15 pt-8">
            <div>
              <p className="eyebrow text-ong">Dòng thời gian</p>
              <h3 className="display mt-3 text-4xl md:text-6xl">
                Hành trình của <em className="text-brick">nghề đá ong</em>
              </h3>
            </div>
            <p className="max-w-xs text-sm text-earth/70">Nhấn vào từng mốc để xem hình ảnh và nội dung tương ứng.</p>
          </div>
          <Timeline />
        </div>
      </div>
    </section>
  )
}
