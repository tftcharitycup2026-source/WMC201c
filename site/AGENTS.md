# AGENTS.md

- Đây là SPA React + Vite. `src/App.tsx` ghép các phần theo thứ tự: Hero → Chapter1..5 → Epilogue.
- `src/data/content.ts`: chứa **nguyên văn** bài viết. Không được rút gọn hay sửa câu chữ, không tự thêm thông tin.
- `src/data/media.ts`: danh mục ảnh. Khi `src` rỗng, `ImageSlot` sẽ hiển thị khung chờ (`Placeholder`). Không được tạo ảnh giả rồi chú thích như ảnh tư liệu thực tế.
- `src/components/AutoAnimations.tsx`: hiệu ứng dùng chung, khai báo bằng thuộc tính `data-split`, `data-reveal`, `data-mask`, `data-parallax`, `data-zoom`, `data-velocity`. Component này phải được render **sau** các section, vì các ScrollTrigger có pin cần được tạo trước.
- Khi một component tự viết timeline riêng cho chữ đã tách, dùng `Split anim="none"` để tránh bị hai hiệu ứng chồng nhau.
- Mọi hiệu ứng đều được bọc trong `gsap.matchMedia` (`MOTION_OK` / `DESKTOP`) để tôn trọng cài đặt giảm chuyển động. Trên điện thoại, cuộn ngang được thay bằng bố cục dọc.
- `src/lib/scroll.ts` chứa Lenis, `scrollToTarget` và `lockScroll` (dùng cho lightbox và menu).
- Video phỏng vấn được nhúng bằng iframe Google Drive (`INTERVIEW_VIDEO_EMBED`). Giữ nguyên, không thiết kế lại.
- Họa tiết đá ong là `public/textures/laterite.svg`, được sinh bằng script.
- `src/lib/mediaStore.ts` + `src/components/MediaEditor.tsx`: chế độ chỉnh sửa ảnh (`?edit` / Ctrl+Shift+E). Hàm `initMedia()` đọc `public/media.json` rồi **ghi đè trực tiếp** lên các đối tượng trong `MEDIA` (nên các component vẫn dùng `MEDIA.x.src/caption` như cũ). Bản nháp nằm trong IndexedDB, chỉ áp dụng khi bật chế độ chỉnh sửa.
