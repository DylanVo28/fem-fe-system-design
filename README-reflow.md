# Reflow trong Browser Rendering Demo

## Mô tả
Demo tương tác để hiểu rõ về Reflow trong Browser Rendering và cách tối ưu hiệu năng.

## Cách sử dụng
1. Mở file `reflow-demo.html` trong trình duyệt
2. Khám phá các section khác nhau để hiểu:
   - Quy trình xây dựng Render Tree
   - Reflow và các bước xử lý
   - CPU vs GPU processing
   - Demo hiệu năng với 2000 rectangles
   - So sánh tối ưu hóa

## Các khái niệm được minh họa

### 1. Quy trình xây dựng Render Tree
- HTML → DOM Tree
- CSS → CSSOM Tree  
- DOM + CSSOM → Render Tree

### 2. Reflow là gì?
Xảy ra khi DOM hoặc CSSOM bị thay đổi, browser phải thực hiện:
1. **Recalculate Style** - CSS selectors, style tree
2. **Layout Phase** - Tính toán lại vị trí, kích thước (CPU bound, nặng)
3. **Paint Phase** - Vẽ pixel lên màn hình (GPU, nhanh)
4. **Composite Phase** - Sắp xếp các layer đúng thứ tự hiển thị

### 3. CPU vs GPU
- **Reflow + Layout = CPU nặng** → dễ block render thread
- **Paint + Composite = GPU xử lý** → nhanh, không block CPU

### 4. Ví dụ hiệu năng - 2000 Rectangles
- **Pipeline tối ưu** (CSS transform: translateY) → GPU vẽ pixel → 60fps, CPU gần như 0%
- **Pipeline không tối ưu** (CSS margin-top) → CPU phải tính lại layout cho tất cả 2000 elements → nặng, lag

### 5. Tối ưu hóa
- **Tránh Reflow** bằng cách hạn chế thay đổi layout properties
- **Ưu tiên GPU** với transform, opacity
- **Lợi ích**: giảm CPU load, mượt hơn, đạt 60fps

## Tính năng tương tác

### Demo hiệu năng
- **Demo Reflow (Chậm)**: Sử dụng margin-top để di chuyển 2000 rectangles
- **Demo Transform (Nhanh)**: Sử dụng transform: translateY để di chuyển
- **Metrics real-time**: FPS counter và CPU usage simulation

### Demo so sánh
- **Animate với Margin**: Gây reflow, hiệu năng chậm
- **Animate với Transform**: GPU xử lý, hiệu năng nhanh
- **Performance bars**: Visual comparison của hiệu năng

## Files
- `reflow-demo.html`: File HTML chính với demo tương tác
- `reflow-styles.css`: CSS styles và animations
- `README-reflow.md`: Hướng dẫn này

## Key Takeaways
1. **Reflow = Tốn kém nhất** vì tính toán lại layout (nặng CPU)
2. **Paint + Composite = Nhanh hơn** vì chủ yếu GPU xử lý
3. **Tối ưu Animation/Layout** bằng transform/opacity để tránh reflow
4. **60fps target** đạt được khi sử dụng GPU-optimized properties

## Browser DevTools
Để xem chi tiết hơn về reflow, mở DevTools:
1. **Performance tab** → Record → Thực hiện animation → Stop
2. **Rendering tab** → Enable "Layout Shift Regions" để thấy reflow areas
3. **Console** → Monitor performance với `performance.now()`
