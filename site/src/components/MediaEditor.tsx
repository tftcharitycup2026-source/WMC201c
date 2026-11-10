import { useRef, useState } from 'react'
import { Download, ImagePlus, PackageOpen, Pencil, Trash2, Undo2, X } from 'lucide-react'
import {
  allMedia,
  downloadImage,
  draftCount,
  exportPackage,
  FIELDS,
  hasDraft,
  removeImage,
  resetAllDrafts,
  resetDraft,
  setEditMode,
  setImage,
  setText,
  useMediaVersion,
  type Field,
} from '../lib/mediaStore'
import type { Media } from '../data/media'

const GROUPS: { title: string; test: (id: string) => boolean }[] = [
  { title: 'Mở đầu', test: (id) => id === 'hero' },
  { title: 'Chương 01', test: (id) => id.startsWith('ch1-') || id.startsWith('tl-') },
  { title: 'Chương 02', test: (id) => id.startsWith('ch2-') },
  { title: 'Chương 03', test: (id) => id.startsWith('ch3-') || id === 'tay-phuong' || id.startsWith('g-') },
  { title: 'Chương 04', test: (id) => id.startsWith('ch4-') || id.startsWith('step-') },
  { title: 'Chương 05', test: (id) => id.startsWith('ch5-') || id.startsWith('dir-') || id === 'panorama' },
  { title: 'Lời kết', test: (id) => id === 'epilogue' },
]

const LABEL: Record<Field, string> = { caption: 'Chú thích', alt: 'Mô tả thay thế (alt)', credit: 'Nguồn / tác giả ảnh' }

function Item({ media, onError }: { media: Media; onError: (m: string) => void }) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [drag, setDrag] = useState(false)
  const draft = hasDraft(media.id)

  const pick = async (file?: File) => {
    if (!file) return
    setBusy(true)
    try {
      await setImage(media.id, file)
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Không thể đọc ảnh này.')
    } finally {
      setBusy(false)
      if (input.current) input.current.value = ''
    }
  }

  return (
    <li
      className={`rounded-xl border p-3 transition ${drag ? 'border-brick bg-brick/10' : 'border-coal/15 bg-white/50'}`}
      onDragOver={(e) => {
        e.preventDefault()
        setDrag(true)
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDrag(false)
        void pick(e.dataTransfer.files[0])
      }}
    >
      <div className="flex gap-3">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-sand">
          {media.src ? (
            <img src={media.src} alt="" className="size-full object-cover" />
          ) : (
            <div className="laterite tone-ong grid size-full place-items-center text-paper/80">
              <ImagePlus size={20} strokeWidth={1.5} />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <code className="truncate text-[0.7rem] text-earth/70">{media.id}</code>
            {draft && <span className="rounded-full bg-brick px-2 py-0.5 text-[0.6rem] font-semibold text-paper">Bản nháp</span>}
          </div>
          <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-coal/80">{media.brief}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => input.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-full bg-coal px-3 py-1.5 text-xs font-medium text-paper transition hover:bg-brick disabled:opacity-50"
        >
          <ImagePlus size={14} /> {busy ? 'Đang xử lý…' : media.src ? 'Thay ảnh' : 'Tải ảnh lên'}
        </button>
        {media.src && (
          <>
            <button
              type="button"
              onClick={() => void downloadImage(media.id)}
              className="inline-flex items-center gap-1.5 rounded-full border border-coal/25 px-3 py-1.5 text-xs transition hover:border-brick hover:text-brick"
            >
              <Download size={14} /> Tải xuống
            </button>
            <button
              type="button"
              onClick={() => removeImage(media.id)}
              className="inline-flex items-center gap-1.5 rounded-full border border-coal/25 px-3 py-1.5 text-xs transition hover:border-brick hover:text-brick"
            >
              <Trash2 size={14} /> Gỡ ảnh
            </button>
          </>
        )}
        {draft && (
          <button
            type="button"
            onClick={() => resetDraft(media.id)}
            className="inline-flex items-center gap-1.5 rounded-full border border-coal/25 px-3 py-1.5 text-xs transition hover:border-brick hover:text-brick"
          >
            <Undo2 size={14} /> Hoàn tác
          </button>
        )}
        <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => void pick(e.target.files?.[0])} />
      </div>

      <details className="mt-2">
        <summary className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-earth/80 hover:text-brick">
          <Pencil size={12} /> Sửa chú thích
        </summary>
        <div className="mt-2 space-y-2">
          {FIELDS.map((f) => (
            <label key={f} className="block text-[0.7rem] text-earth/70">
              {LABEL[f]}
              <textarea
                rows={f === 'caption' ? 2 : 1}
                value={media[f] ?? ''}
                onChange={(e) => setText(media.id, f, e.target.value)}
                className="mt-1 w-full resize-y rounded-md border border-coal/20 bg-paper px-2 py-1.5 text-xs text-coal focus:border-brick focus:outline-none"
              />
            </label>
          ))}
        </div>
      </details>
    </li>
  )
}

export function MediaEditor() {
  useMediaVersion()
  const [open, setOpen] = useState(false)
  const [onlyEmpty, setOnlyEmpty] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const list = allMedia()
  const filled = list.filter((m) => m.src).length
  const drafts = draftCount()

  const doExport = async () => {
    setExporting(true)
    try {
      const r = await exportPackage()
      setMsg(`Đã tải gói cập nhật (${r.images} ảnh, ${r.entries} mục). Giải nén vào thư mục public/ rồi triển khai lại website.`)
    } catch {
      setMsg('Không tạo được gói cập nhật.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="media-editor" data-cursor="none">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-[130] inline-flex items-center gap-2 rounded-full bg-brick px-4 py-3 text-sm font-medium text-paper shadow-xl transition hover:bg-coal"
      >
        <Pencil size={16} /> Chỉnh ảnh
        {drafts > 0 && <span className="rounded-full bg-paper px-2 text-xs font-semibold text-brick">{drafts}</span>}
      </button>

      {open && (
        <aside
          data-lenis-prevent
          role="dialog"
          aria-label="Chỉnh sửa ảnh"
          className="fixed inset-y-0 left-0 z-[140] flex w-full max-w-md flex-col bg-paper text-coal shadow-2xl"
        >
          <header className="flex items-start justify-between gap-3 border-b border-coal/15 px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold">Chỉnh sửa ảnh</h2>
              <p className="text-xs text-earth/70">
                {filled}/{list.length} vị trí đã có ảnh · {drafts} thay đổi chưa xuất bản
              </p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Đóng" className="grid size-9 place-items-center rounded-full border border-coal/20 hover:border-brick hover:text-brick">
              <X size={16} />
            </button>
          </header>

          <div className="space-y-3 border-b border-coal/15 px-5 py-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void doExport()}
                disabled={exporting}
                className="inline-flex items-center gap-1.5 rounded-full bg-brick px-4 py-2 text-xs font-medium text-paper transition hover:bg-coal disabled:opacity-50"
              >
                <PackageOpen size={14} /> {exporting ? 'Đang tạo…' : 'Xuất bản cập nhật (.zip)'}
              </button>
              {drafts > 0 && (
                <button
                  type="button"
                  onClick={() => window.confirm('Bỏ toàn bộ bản nháp chưa xuất bản?') && resetAllDrafts()}
                  className="inline-flex items-center gap-1.5 rounded-full border border-coal/25 px-3 py-2 text-xs transition hover:border-brick hover:text-brick"
                >
                  <Undo2 size={14} /> Bỏ hết bản nháp
                </button>
              )}
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="inline-flex items-center gap-1.5 rounded-full border border-coal/25 px-3 py-2 text-xs transition hover:border-brick hover:text-brick"
              >
                Thoát chế độ chỉnh sửa
              </button>
            </div>
            <label className="flex items-center gap-2 text-xs text-earth/80">
              <input type="checkbox" checked={onlyEmpty} onChange={(e) => setOnlyEmpty(e.target.checked)} /> Chỉ hiện vị trí chưa có ảnh
            </label>
            {msg && (
              <p className="rounded-md bg-sand/50 px-3 py-2 text-xs leading-relaxed text-earth" role="status">
                {msg}
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {GROUPS.map((g) => {
              const items = list.filter((m) => g.test(m.id) && (!onlyEmpty || !m.src))
              if (!items.length) return null
              return (
                <section key={g.title} className="mb-6">
                  <h3 className="eyebrow mb-2 text-brick">{g.title}</h3>
                  <ul className="space-y-3">
                    {items.map((m) => (
                      <Item key={m.id} media={m} onError={setMsg} />
                    ))}
                  </ul>
                </section>
              )
            })}
          </div>
        </aside>
      )}
    </div>
  )
}
