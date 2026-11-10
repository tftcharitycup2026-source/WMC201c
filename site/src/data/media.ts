/**
 * DANH MỤC ẢNH TƯ LIỆU
 * --------------------------------------------------------------
 * Website hiện hiển thị KHUNG CHỜ ẢNH THẬT cho mọi vị trí bên dưới.
 * Để thay bằng ảnh tư liệu:
 *   1. Đặt tệp ảnh (khuyến nghị .webp/.jpg, cạnh dài ~2000px, đã nén)
 *      vào thư mục  public/images/
 *   2. Điền đường dẫn vào trường `src`, ví dụ: src: '/images/hero-tuong-da-ong.webp'
 *   3. Cập nhật `caption` / `credit` cho đúng với ảnh thực tế.
 * Ảnh được tải lười (lazy) và giải mã bất đồng bộ.
 */

export type Media = {
  id: string
  src: string
  alt: string
  /** Chú thích hiển thị dưới ảnh / trong chế độ xem toàn màn hình */
  caption: string
  /** Mô tả ảnh cần bổ sung — chỉ hiển thị khi chưa có ảnh */
  brief: string
  credit?: string
}

const m = (id: string, brief: string, caption: string, alt = caption): Media => ({
  id,
  src: '',
  alt,
  caption,
  brief,
})

export const MEDIA = {
  /* Mở đầu */
  hero: m('hero', 'Toàn cảnh bức tường đá ong cổ tại Thạch Thất, ảnh ngang khổ lớn', 'Tường đá ong tại Thạch Thất'),

  /* Chương 01 */
  ch1Natural: m('ch1-natural', 'Cận cảnh khối đá ong tự nhiên, thấy rõ kết cấu lỗ rỗng', 'Đá ong tự nhiên với kết cấu đặc trưng'),
  ch1Earth: m('ch1-earth', 'Lớp đá ong lộ ra trong lòng đất tại khu vực khai thác', 'Đá ong trong lòng đất'),
  ch1Wall: m('ch1-wall', 'Tường rào hoặc giếng nước xây bằng đá ong trong làng', 'Tường rào, giếng nước – công trình sinh hoạt từ đá ong'),
  tl1: m('tl-1', 'Ngôi nhà/tường xây đá ong cổ trong làng', 'Khởi nguồn: đá ong trong xây dựng truyền thống'),
  tl2: m('tl-2', 'Người thợ lựa chọn, xử lý đá tại bãi khai thác', 'Hình thành nghề: kinh nghiệm qua nhiều thế hệ'),
  tl3: m('tl-3', 'Các khối đá ong được chế tác nhiều hình dạng, kích thước', 'Phát triển: chế tác ngày càng đa dạng'),
  tl4: m('tl-4', 'Xưởng đá ong đang hoạt động hiện nay', 'Hiện tại: nghề được duy trì tại địa phương'),

  /* Chương 02 */
  ch2Village: m('ch2-village', 'Ảnh toàn cảnh không gian làng quê xứ Đoài có tường, cổng đá ong', 'Không gian làng quê xứ Đoài'),
  ch2Life1: m('ch2-life-1', 'Sinh hoạt thường ngày của người dân bên tường đá ong', 'Đời sống thường ngày bên những bức tường đá ong'),
  ch2Life2: m('ch2-life-2', 'Ngõ làng lát/xây đá ong, có người qua lại', 'Ngõ làng xứ Đoài'),
  ch2Eco1: m('ch2-eco-1', 'Hoạt động khai thác đá ong tại bãi đá', 'Hoạt động khai thác đá ong'),
  ch2Eco2: m('ch2-eco-2', 'Người thợ đang chế tác khối đá ong', 'Người thợ chế tác đá'),
  ch2Hands: m('ch2-hands', 'Cận cảnh bàn tay người thợ đẽo đá (làm nền trích dẫn)', 'Bàn tay người thợ đẽo đá'),
  ch2Culture1: m('ch2-culture-1', 'Cổng làng xây bằng đá ong', 'Cổng làng đá ong'),
  ch2Culture2: m('ch2-culture-2', 'Giếng đá ong cổ trong làng', 'Giếng đá ong'),
  ch2Culture3: m('ch2-culture-3', 'Bức tường đá ong mộc mạc phủ rêu', 'Tường đá ong mộc mạc'),

  /* Chương 03 */
  ch3Opener: m('ch3-opener', 'Ảnh kiến trúc đá ong toàn màn hình (đình/chùa/cổng làng)', 'Kiến trúc đá ong xứ Đoài'),
  ch3House: m('ch3-house', 'Nhà ở truyền thống có tường đá ong', 'Nhà ở truyền thống'),
  ch3Dinh: m('ch3-dinh', 'Đình làng có móng, tường hoặc cổng bằng đá ong', 'Đình làng – công trình tín ngưỡng'),
  ch3Foundation: m('ch3-foundation', 'Cận cảnh móng/chân tường đá ong', 'Móng và chân tường đá ong'),
  taiPhuong: m('tay-phuong', 'Chùa Tây Phương – ảnh kiến trúc tổng thể hoặc chi tiết đá ong', 'Chùa Tây Phương'),
  ch3Gate: m('ch3-gate', 'Cổng làng đá ong được bảo tồn', 'Cổng làng được bảo tồn'),
  ch3Fence: m('ch3-fence', 'Hàng rào đá ong trong khu dân cư', 'Hàng rào đá ong'),
  g1: m('g-1', 'Ảnh ngang toàn chiều rộng: công trình mới sử dụng đá ong', 'Đá ong trong công trình kiến trúc mới'),
  g2: m('g-2', 'Ảnh dọc khổ lớn: mặt tiền ốp đá ong kết hợp kính/bê tông', 'Đá ong kết hợp vật liệu hiện đại'),
  g3: m('g-3', 'Ảnh vuông: cận cảnh bề mặt đá ong', 'Bề mặt đá ong'),
  g4: m('g-4', 'Ảnh vuông: không gian nội thất có tường đá ong', 'Đá ong trong không gian nội thất'),
  g5: m('g-5', 'Ảnh ngang: sân vườn/không gian theo phong cách truyền thống', 'Không gian hướng đến phong cách truyền thống'),
  g6: m('g-6', 'Ảnh dọc: chi tiết ghép đá ong trong công trình mới', 'Chi tiết ghép đá ong'),

  /* Chương 04 */
  ch4Workshop: m('ch4-workshop', 'Toàn cảnh xưởng đá ong Hiển Long', 'Xưởng đá ong Hiển Long, Bình Yên, Thạch Thất'),
  ch4Portrait: m('ch4-portrait', 'Chân dung ông Nguyễn Thành Long tại xưởng', 'Ông Nguyễn Thành Long'),
  ch4Craft: m('ch4-craft', 'Ông Long trực tiếp chế tác đá ong', 'Hoạt động chế tác tại xưởng Hiển Long'),
  step1: m('step-1', 'Lựa chọn khối đá nguyên liệu', 'Lựa chọn nguyên liệu'),
  step2: m('step-2', 'Khai thác và cắt đá', 'Khai thác và cắt đá'),
  step3: m('step-3', 'Đẽo và tạo hình khối đá', 'Đẽo và tạo hình'),
  step4: m('step-4', 'Sản phẩm đá ong hoàn thiện', 'Hoàn thiện sản phẩm'),
  ch4Supervise: m('ch4-supervise', 'Ông Long giám sát công đoạn chế tác', 'Trực tiếp thực hiện và giám sát'),
  ch4Hands: m('ch4-hands', 'Cận cảnh bàn tay người thợ đang chế tác đá ong', 'Bàn tay người thợ'),

  /* Chương 05 */
  ch5Opener: m('ch5-opener', 'Kiến trúc đá ong kết hợp vật liệu hiện đại, tông sáng', 'Đá ong trong kiến trúc đương đại'),
  dir1: m('dir-1', 'Công trình đá ong cổ được gìn giữ', 'Bảo tồn'),
  dir2: m('dir-2', 'Sản phẩm/ứng dụng đá ong mới trong kiến trúc hiện đại', 'Đổi mới'),
  dir3: m('dir-3', 'Người thợ lớn tuổi truyền nghề cho thợ trẻ', 'Kế thừa'),
  panorama: m('panorama', 'Ảnh panorama lớn về kiến trúc đá ong Thạch Thất', 'Toàn cảnh kiến trúc đá ong Thạch Thất'),

  /* Lời kết */
  epilogue: m('epilogue', 'Tường đá ong hoặc kiến trúc truyền thống trong ánh nắng chiều', 'Tường đá ong trong nắng chiều'),
} satisfies Record<string, Media>

export type MediaKey = keyof typeof MEDIA
