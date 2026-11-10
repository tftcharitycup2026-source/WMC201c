import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '../lib/gsap'

const FROM: Record<string, gsap.TweenVars> = {
  up: { y: 70 },
  down: { y: -70 },
  left: { x: -90 },
  right: { x: 90 },
  scale: { scale: 0.9 },
  fade: {},
}
const CLIP_FROM: Record<string, string> = {
  up: 'inset(100% 0% 0% 0%)',
  down: 'inset(0% 0% 100% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
  center: 'inset(18% 18% 18% 18%)',
}

/**
 * Bộ hiệu ứng cuộn dùng chung, kích hoạt bằng thuộc tính:
 *  data-split="words|chars|lines"  – chữ xuất hiện theo từ / chữ / dòng
 *  data-reveal="up|down|left|right|scale|fade" – khối nội dung xuất hiện từ nhiều hướng
 *  data-mask="up|down|left|right|center" – ảnh mở dần bằng mặt nạ
 *  data-parallax="0.2" – parallax theo tiến trình cuộn
 *  data-zoom="1.25" – ảnh thu dần theo tiến trình cuộn
 *  data-velocity – chi tiết trang trí nghiêng nhẹ theo tốc độ cuộn
 * Được render cuối cùng để các ScrollTrigger có pin phía trên được tính trước.
 */
export function AutoAnimations() {
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.utils.toArray<HTMLElement>('[data-split="words"]:not([data-manual]),[data-split="chars"]:not([data-manual])').forEach((el) => {
        gsap.from(el.querySelectorAll('.sw-i'), {
          yPercent: 115,
          duration: 1.15,
          ease: 'expo.out',
          stagger: el.dataset.split === 'chars' ? 0.022 : 0.045,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-split="lines"]:not([data-manual])').forEach((el) => {
        const lines = groupLines(el)
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
        lines.forEach((line, i) => {
          tl.from(line, { yPercent: 115, opacity: 0, duration: 1.1, ease: 'expo.out' }, i * 0.16)
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        const from = FROM[el.dataset.reveal ?? 'up'] ?? FROM.up
        gsap.from(el, {
          ...from,
          opacity: 0,
          duration: 1.3,
          delay: Number(el.dataset.delay ?? 0),
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-mask]').forEach((el) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
        tl.fromTo(
          el,
          { clipPath: CLIP_FROM[el.dataset.mask ?? 'up'] ?? CLIP_FROM.up },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut', delay: Number(el.dataset.delay ?? 0) },
        )
        const inner = el.querySelector('.media-inner > *')
        if (inner) tl.from(inner, { scale: 1.35, duration: 2, ease: 'expo.out' }, '<0.15')
      })

      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const speed = Number(el.dataset.parallax ?? 0.2)
        gsap.fromTo(
          el,
          { yPercent: -speed * 50 },
          {
            yPercent: speed * 50,
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })

      gsap.utils.toArray<HTMLElement>('[data-zoom]').forEach((el) => {
        const inner = el.querySelector('.media-inner > *') ?? el
        gsap.fromTo(
          inner,
          { scale: Number(el.dataset.zoom ?? 1.25) },
          { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom 40%', scrub: true } },
        )
      })

      const velo = gsap.utils.toArray<HTMLElement>('[data-velocity]')
      if (velo.length) {
        const setters = velo.map((el) => gsap.quickTo(el, 'skewY', { duration: 0.7, ease: 'power3.out' }))
        let reset: gsap.core.Tween | null = null
        ScrollTrigger.create({
          onUpdate: (self) => {
            const v = gsap.utils.clamp(-7, 7, self.getVelocity() / 350)
            setters.forEach((s) => s(v))
            reset?.kill()
            reset = gsap.delayedCall(0.12, () => setters.forEach((s) => s(0)))
          },
        })
      }
    })

    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  })
  return null
}

/** Gom các từ đã tách thành từng dòng hiển thị thực tế. */
export function groupLines(el: HTMLElement) {
  const words = Array.from(el.querySelectorAll<HTMLElement>('.sw'))
  const lines: HTMLElement[][] = []
  let lastTop: number | null = null
  words.forEach((w) => {
    const top = w.offsetTop
    if (lastTop === null || Math.abs(top - lastTop) > 4) {
      lines.push([])
      lastTop = top
    }
    lines[lines.length - 1].push(w.querySelector('.sw-i') as HTMLElement)
  })
  return lines
}
