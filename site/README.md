# Mega Story: Đá ong Thạch Thất

Đây là website báo chí kể chuyện tương tác về đá ong Thạch Thất, gồm phần mở đầu, 5 chương và lời kết.

**Công nghệ:** React 19, TypeScript, Vite, Tailwind CSS v4, GSAP + ScrollTrigger, Motion, Lenis (cuộn mượt), Lucide React. Website được triển khai trên Netlify.

## Chạy trên máy

```bash
npm install
npm run dev
```

## Chỉnh sửa / thay / tải ảnh ngay trên website
1. Mở website với địa chỉ có thêm `?edit` (ví dụ `https://ten-mien.netlify.app/?edit`) hoặc nhấn **Ctrl + Shift + E**. Nút **Chỉnh ảnh** xuất hiện ở góc trái dưới.
2. Trong bảng chỉnh sửa, mỗi vị trí ảnh có: **Tải ảnh lên / Thay ảnh** (hoặc kéo-thả tệp vào ô), **Tải xuống**, **Gỡ ảnh**, **Hoàn tác**, và **Sửa chú thích** (chú thích, alt, nguồn ảnh). Ảnh được tự thu nhỏ (cạnh dài ≤ 2000px) và nén WebP.
3. Thay đổi lưu thành **bản nháp** trong trình duyệt của bạn — chỉ bạn thấy, người xem website chưa thấy.
4. Muốn công khai: bấm **Xuất bản cập nhật (.zip)**, giải nén vào thư mục `public/` của dự án (sẽ có `public/media.json` và `public/images/...`), rồi commit/triển khai lại lên Netlify.
5. Tắt chế độ chỉnh sửa bằng nút **Thoát chế độ chỉnh sửa** hoặc `?edit=0`.

Website đọc `public/media.json` khi tải trang và ghi đè lên danh mục mặc định trong `src/data/media.ts`.

### Cách làm thủ công (không dùng bảng chỉnh sửa)
Mọi ảnh được khai báo trong `src/data/media.ts`. Đặt ảnh đã nén vào `public/images/`, sau đó điền `src: '/images/ten-anh.webp'` và chỉnh lại `caption`. Vị trí nào chưa có ảnh sẽ tự hiển thị khung chờ.

## Lộ trình
- Bổ sung ảnh tư liệu thực tế cho toàn bộ 45 vị trí ảnh.
- Rà soát chú thích ảnh và ghi nguồn (`credit`).
