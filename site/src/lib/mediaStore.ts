import { useSyncExternalStore } from 'react'
import { MEDIA, type Media } from '../data/media'
import { ScrollTrigger } from './gsap'

/**
 * KHO ẢNH & CHẾ ĐỘ CHỈNH SỬA
 * --------------------------------------------------------------
 * - Bản đã xuất bản: đọc từ /media.json (do nút "Xuất bản cập nhật" tạo ra),
 *   ghi đè lên danh mục mặc định trong src/data/media.ts.
 * - Bản nháp: chỉ có ở trình duyệt của người chỉnh sửa (IndexedDB), chỉ áp dụng
 *   khi bật chế độ chỉnh sửa. Người xem bình thường không bao giờ thấy bản nháp.
 */

export type Field = 'alt' | 'caption' | 'credit'
export const FIELDS: Field[] = ['caption', 'alt', 'credit']

type Override = { src?: string; alt?: string; caption?: string; credit?: string }
type Draft = { blob?: Blob; removed?: boolean; alt?: string; caption?: string; credit?: string }

const ALL: Media[] = Object.values(MEDIA)
const ORIGINAL = new Map<string, Media>(ALL.map((m) => [m.id, { ...m }]))
const BY_ID = new Map<string, Media>(ALL.map((m) => [m.id, m]))

/* ---------------- Chế độ chỉnh sửa ---------------- */

const EDIT_KEY = 'mega-edit-mode'

function readEditMode(): boolean {
  try {
    const url = new URL(window.location.href)
    const q = url.searchParams.get('edit')
    if (q !== null) {
      if (q === '0' || q === 'false') localStorage.removeItem(EDIT_KEY)
      else localStorage.setItem(EDIT_KEY, '1')
      url.searchParams.delete('edit')
      window.history.replaceState(null, '', url.pathname + url.search + url.hash)
    }
    return localStorage.getItem(EDIT_KEY) === '1'
  } catch {
    return false
  }
}

export const EDIT_MODE = typeof window !== 'undefined' && readEditMode()

export function setEditMode(on: boolean) {
  try {
    if (on) localStorage.setItem(EDIT_KEY, '1')
    else localStorage.removeItem(EDIT_KEY)
  } catch {
    /* bỏ qua */
  }
  window.location.reload()
}

/* ---------------- Trạng thái ---------------- */

let published: Record<string, Override> = {}
let drafts = new Map<string, Draft>()
const urls = new Map<string, string>() // id -> object URL của ảnh nháp
let version = 0
const listeners = new Set<() => void>()

const subscribe = (fn: () => void) => {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}
const getVersion = () => version

/** Hook: component gọi hook này sẽ được vẽ lại mỗi khi ảnh / chú thích thay đổi. */
export function useMediaVersion() {
  return useSyncExternalStore(subscribe, getVersion)
}

function emit() {
  version++
  listeners.forEach((l) => l())
  // Bố cục có thể thay đổi nhẹ khi ảnh thật thay khung chờ
  window.setTimeout(() => ScrollTrigger.refresh(), 400)
}

function urlFor(id: string, blob: Blob) {
  const old = urls.get(id)
  if (old) return old
  const u = URL.createObjectURL(blob)
  urls.set(id, u)
  return u
}

function dropUrl(id: string) {
  const u = urls.get(id)
  if (u) URL.revokeObjectURL(u)
  urls.delete(id)
}

function resolve(id: string): Omit<Media, 'id' | 'brief'> {
  const base = ORIGINAL.get(id)!
  const pub = published[id] ?? {}
  const next = {
    src: pub.src ?? base.src,
    alt: pub.alt ?? base.alt,
    caption: pub.caption ?? base.caption,
    credit: pub.credit ?? base.credit,
  }
  // alt vốn trùng chú thích thì tiếp tục đi theo chú thích nếu chú thích được sửa
  if (pub.caption !== undefined && pub.alt === undefined && base.alt === base.caption) next.alt = pub.caption

  const d = EDIT_MODE ? drafts.get(id) : undefined
  if (d) {
    const altFollows = next.alt === next.caption
    if (d.blob) next.src = urlFor(id, d.blob)
    else if (d.removed) next.src = ''
    if (d.caption !== undefined) next.caption = d.caption
    if (d.alt !== undefined) next.alt = d.alt
    else if (d.caption !== undefined && altFollows) next.alt = d.caption
    if (d.credit !== undefined) next.credit = d.credit
  }
  return next
}

function applyAll() {
  for (const media of ALL) {
    const r = resolve(media.id)
    media.src = r.src
    media.alt = r.alt
    media.caption = r.caption
    media.credit = r.credit || undefined
  }
  emit()
}

/* ---------------- IndexedDB (bản nháp) ---------------- */

const DB = 'mega-story-media'
const STORE = 'drafts'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolveDb, reject) => {
    const req = indexedDB.open(DB, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolveDb(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function idb<T>(mode: IDBTransactionMode, run: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb()
  return new Promise<T>((resolveReq, reject) => {
    const tx = db.transaction(STORE, mode)
    const req = run(tx.objectStore(STORE))
    tx.oncomplete = () => {
      db.close()
      resolveReq(req.result)
    }
    tx.onerror = () => reject(tx.error)
  })
}

async function loadDrafts() {
  try {
    const db = await openDb()
    await new Promise<void>((done) => {
      const tx = db.transaction(STORE, 'readonly')
      const store = tx.objectStore(STORE)
      const cur = store.openCursor()
      cur.onsuccess = () => {
        const c = cur.result
        if (c) {
          drafts.set(String(c.key), c.value as Draft)
          c.continue()
        }
      }
      tx.oncomplete = () => {
        db.close()
        done()
      }
      tx.onerror = () => done()
    })
  } catch {
    drafts = new Map() // trình duyệt chặn IndexedDB (chế độ riêng tư…)
  }
}

function saveDraft(id: string) {
  const d = drafts.get(id)
  if (!d || (!d.blob && !d.removed && d.alt === undefined && d.caption === undefined && d.credit === undefined)) {
    drafts.delete(id)
    dropUrl(id)
    void idb('readwrite', (s) => s.delete(id)).catch(() => {})
  } else {
    void idb('readwrite', (s) => s.put(d, id)).catch(() => {})
  }
}

/* ---------------- Khởi tạo ---------------- */

async function fetchPublished() {
  try {
    const r = await fetch(`${import.meta.env.BASE_URL}media.json`, { cache: 'no-cache' })
    if (!r.ok) return
    const data = (await r.json()) as Record<string, Override>
    if (data && typeof data === 'object') published = data
  } catch {
    /* chưa có media.json hoặc không phải JSON: dùng danh mục mặc định */
  }
}

/** Gọi một lần trước khi vẽ giao diện. Không chờ quá 2 giây. */
export async function initMedia() {
  const work = (async () => {
    await fetchPublished()
    if (EDIT_MODE) await loadDrafts()
    applyAll()
  })()
  await Promise.race([work, new Promise((r) => window.setTimeout(r, 2000))])
  void work
}

/* ---------------- Thao tác của người chỉnh sửa ---------------- */

export const getMedia = (id: string) => BY_ID.get(id)!
export const allMedia = () => ALL
export const hasDraft = (id: string) => drafts.has(id)
export const draftCount = () => drafts.size

function draftOf(id: string): Draft {
  let d = drafts.get(id)
  if (!d) {
    d = {}
    drafts.set(id, d)
  }
  return d
}

const MAX_SIDE = 2000

/** Thu nhỏ (cạnh dài tối đa 2000px) và nén WebP để trang tải nhanh. SVG/GIF giữ nguyên. */
export async function processImage(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/')) throw new Error('Tệp được chọn không phải là ảnh.')
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return file
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height))
  const w = Math.max(1, Math.round(bmp.width * scale))
  const h = Math.max(1, Math.round(bmp.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Trình duyệt không xử lý được ảnh.')
  ctx.drawImage(bmp, 0, 0, w, h)
  bmp.close()
  const toBlob = (type: string, q: number) => new Promise<Blob | null>((r) => canvas.toBlob(r, type, q))
  const webp = await toBlob('image/webp', 0.86)
  if (webp && webp.type === 'image/webp') return webp
  const jpg = await toBlob('image/jpeg', 0.88)
  if (!jpg) throw new Error('Không nén được ảnh.')
  return jpg
}

export async function setImage(id: string, file: File) {
  const blob = await processImage(file)
  const d = draftOf(id)
  dropUrl(id)
  d.blob = blob
  d.removed = false
  saveDraft(id)
  applyAll()
}

export function removeImage(id: string) {
  const d = draftOf(id)
  dropUrl(id)
  delete d.blob
  d.removed = true
  saveDraft(id)
  applyAll()
}

export function setText(id: string, field: Field, value: string) {
  const d = draftOf(id)
  d[field] = value
  saveDraft(id)
  applyAll()
}

export function resetDraft(id: string) {
  drafts.delete(id)
  dropUrl(id)
  void idb('readwrite', (s) => s.delete(id)).catch(() => {})
  applyAll()
}

export function resetAllDrafts() {
  for (const id of [...drafts.keys()]) dropUrl(id)
  drafts = new Map()
  void idb('readwrite', (s) => s.clear()).catch(() => {})
  applyAll()
}

/* ---------------- Tải ảnh xuống ---------------- */

const EXT: Record<string, string> = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'image/avif': 'avif',
}

function saveBlob(blob: Blob, name: string) {
  const u = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = u
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(u), 5000)
}

export async function downloadImage(id: string) {
  const media = getMedia(id)
  if (!media.src) return
  const res = await fetch(media.src)
  const blob = await res.blob()
  saveBlob(blob, `${id}.${EXT[blob.type] ?? 'jpg'}`)
}

/* ---------------- Xuất bản (zip) ---------------- */

const enc = new TextEncoder()

const CRC = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()

function crc32(buf: Uint8Array): number {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

/** Tạo tệp .zip (không nén) — đủ cho ảnh đã nén sẵn, không cần thư viện ngoài. */
function makeZip(files: { name: string; data: Uint8Array<ArrayBuffer> }[]): Blob {
  const now = new Date()
  const time = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)
  const date = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()
  const parts: Uint8Array<ArrayBuffer>[] = []
  const central: Uint8Array<ArrayBuffer>[] = []
  let offset = 0

  for (const f of files) {
    const name = enc.encode(f.name)
    const crc = crc32(f.data)
    const local = new Uint8Array(30 + name.length)
    const lv = new DataView(local.buffer)
    lv.setUint32(0, 0x04034b50, true)
    lv.setUint16(4, 20, true)
    lv.setUint16(6, 0x0800, true) // tên tệp UTF-8
    lv.setUint16(8, 0, true) // không nén
    lv.setUint16(10, time, true)
    lv.setUint16(12, date, true)
    lv.setUint32(14, crc, true)
    lv.setUint32(18, f.data.length, true)
    lv.setUint32(22, f.data.length, true)
    lv.setUint16(26, name.length, true)
    local.set(name, 30)
    parts.push(local, f.data)

    const cen = new Uint8Array(46 + name.length)
    const cv = new DataView(cen.buffer)
    cv.setUint32(0, 0x02014b50, true)
    cv.setUint16(4, 20, true)
    cv.setUint16(6, 20, true)
    cv.setUint16(8, 0x0800, true)
    cv.setUint16(10, 0, true)
    cv.setUint16(12, time, true)
    cv.setUint16(14, date, true)
    cv.setUint32(16, crc, true)
    cv.setUint32(20, f.data.length, true)
    cv.setUint32(24, f.data.length, true)
    cv.setUint16(28, name.length, true)
    cv.setUint32(42, offset, true)
    cen.set(name, 46)
    central.push(cen)

    offset += local.length + f.data.length
  }

  const cdSize = central.reduce((s, c) => s + c.length, 0)
  const end = new Uint8Array(22)
  const ev = new DataView(end.buffer)
  ev.setUint32(0, 0x06054b50, true)
  ev.setUint16(8, files.length, true)
  ev.setUint16(10, files.length, true)
  ev.setUint32(12, cdSize, true)
  ev.setUint32(16, offset, true)

  return new Blob([...parts, ...central, end], { type: 'application/zip' })
}

/**
 * Tạo gói cập nhật: public/media.json + public/images/*.
 * Giải nén vào thư mục `public/` của dự án (hoặc tải lên thư mục gốc của website) rồi triển khai lại.
 */
export async function exportPackage(): Promise<{ images: number; entries: number }> {
  const stamp = Date.now()
  const json: Record<string, Override> = {}
  const files: { name: string; data: Uint8Array<ArrayBuffer> }[] = []

  for (const media of ALL) {
    const base = ORIGINAL.get(media.id)!
    const d = drafts.get(media.id)
    const r = resolve(media.id)
    const entry: Override = {}

    if (d?.blob) {
      const ext = EXT[d.blob.type] ?? 'jpg'
      files.push({ name: `images/${media.id}.${ext}`, data: new Uint8Array(await d.blob.arrayBuffer()) })
      entry.src = `/images/${media.id}.${ext}?v=${stamp}`
    } else if (r.src !== base.src) {
      entry.src = r.src // giữ ảnh đã xuất bản trước đó (hoặc '' nếu đã gỡ)
    }
    if (r.caption !== base.caption) entry.caption = r.caption
    if (r.alt !== base.alt) entry.alt = r.alt
    if ((r.credit || '') !== (base.credit || '')) entry.credit = r.credit ?? ''
    if (Object.keys(entry).length) json[media.id] = entry
  }

  files.unshift({ name: 'media.json', data: enc.encode(JSON.stringify(json, null, 2) + '\n') })
  saveBlob(makeZip(files), `cap-nhat-anh-${new Date().toISOString().slice(0, 10)}.zip`)
  return { images: files.length - 1, entries: Object.keys(json).length }
}
