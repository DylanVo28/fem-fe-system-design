# Browser Positioning System & Normal Flow Demo

## Mô tả
Demo tương tác để hiểu rõ các khái niệm CSS Positioning trong trình duyệt.

## Cách sử dụng
1. Mở file `positioning-demo.html` trong trình duyệt
2. Khám phá các section khác nhau để hiểu:
   - Normal Flow (mặc định)
   - position: static
   - position: relative
   - position: absolute
   - Stacking Context & Z-axis
   - Tương tác với z-index

## Các khái niệm được minh họa

### 1. Normal Flow
- LTR (Left-to-Right): Trên → dưới, trái → phải
- RTL (Right-to-Left): Phải → trái (tiếng Ả Rập/Hebrew)

### 2. position: static
- Element tuân theo normal flow
- Không thể dịch chuyển bằng top/right/bottom/left

### 3. position: relative
- Render giống normal flow, nhưng có thể dịch chuyển
- Không ảnh hưởng tới các element khác
- Tạo Stacking Context mới
- Có thể biến element thành containing block cho con

### 4. position: absolute
- Element loại bỏ khỏi normal flow
- Luôn dùng containing block gần nhất để tính vị trí
- Nếu không có ancestor có positioning → fallback về viewport
- Tạo Stacking Context riêng

### 5. Stacking Context & Z-axis
- Stacking Context = "realm tách biệt" cho layering
- Các element bên trong context không ảnh hưởng context ngoài
- Z-axis dùng để xếp chồng element
- Quan trọng cho tối ưu hiệu năng: giảm reflow

## Tính năng tương tác
- Thay đổi z-index của các box để thấy sự khác biệt
- Hover effects để thấy rõ hơn các element
- Responsive design cho mobile

## Files
- `positioning-demo.html`: File HTML chính
- `positioning-styles.css`: CSS styles
- `README-positioning.md`: Hướng dẫn này
