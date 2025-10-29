/**
 * Virtual List Implementation
 * Tối ưu hiệu suất khi hiển thị danh sách dài bằng cách chỉ render các items nhìn thấy
 */

// Utility functions
function y(el, value) {
    if (value !== undefined) {
        el.setAttribute('data-y', value);
    }
    return parseInt(el.getAttribute('data-y') || '0');
}

function translateY(y) {
    return `transform: translateY(${y}px)`;
}

/**
 * Class VirtualList - Triển khai Virtual List
 */
class VirtualList {
    constructor(options) {
        this.root = options.root;
        this.data = options.data;
        this.itemHeight = options.itemHeight || 80;
        this.visibleCount = options.visibleCount || 15;
        this.renderItem = options.renderItem;
        
        // State
        this.startIndex = 0;
        this.endIndex = Math.min(this.visibleCount, this.data.length);
        this.scrollTop = 0;
        this.containerHeight = this.itemHeight * this.visibleCount;
        
        // DOM elements
        this.topObserver = null;
        this.bottomObserver = null;
        this.container = null;
        this.items = [];
        
        this.init();
    }

    /**
     * Khởi tạo Virtual List
     */
    init() {
        this.render();
        this.setupObservers();
        this.setupScroll();
    }

    /**
     * Render HTML template
     */
    toHTML() {
        return `
            <div class="top-observer" id="top-observer"></div>
            <div class="virtual-list-container" id="virtual-list-container">
                ${this.renderVisibleItems()}
            </div>
            <div class="bottom-observer" id="bottom-observer"></div>
        `;
    }

    /**
     * Render các items nhìn thấy
     */
    renderVisibleItems() {
        let html = '';
        for (let i = this.startIndex; i < this.endIndex; i++) {
            if (i < this.data.length) {
                const item = this.data[i];
                const top = i * this.itemHeight;
                html += `
                    <div class="virtual-item" 
                         data-index="${i}" 
                         data-y="${top}"
                         style="${translateY(top)}">
                        ${this.renderItem(item, i)}
                    </div>
                `;
            }
        }
        return html;
    }

    /**
     * Render HTML vào DOM
     */
    render() {
        this.root.innerHTML = this.toHTML();
        
        // Lưu reference đến các elements
        this.topObserver = this.root.querySelector('#top-observer');
        this.bottomObserver = this.root.querySelector('#bottom-observer');
        this.container = this.root.querySelector('#virtual-list-container');
        this.items = this.root.querySelectorAll('.virtual-item');
        
        // Set height cho container để tạo scrollbar
        const totalHeight = this.data.length * this.itemHeight;
        this.container.style.height = `${totalHeight}px`;
    }

    /**
     * Thiết lập Intersection Observers
     */
    setupObservers() {
        // Top Observer - theo dõi khi cuộn lên
        this.topObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && this.startIndex > 0) {
                    this.loadPreviousItems();
                }
            });
        }, { threshold: 0 });

        // Bottom Observer - theo dõi khi cuộn xuống
        this.bottomObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && this.endIndex < this.data.length) {
                    this.loadNextItems();
                }
            });
        }, { threshold: 0 });

        // Bắt đầu observe
        this.topObserver.observe(this.root.querySelector('#top-observer'));
        this.bottomObserver.observe(this.root.querySelector('#bottom-observer'));
    }

    /**
     * Thiết lập scroll handling
     */
    setupScroll() {
        this.root.addEventListener('scroll', (e) => {
            this.handleScroll(e.target.scrollTop);
        });
    }

    /**
     * Xử lý sự kiện scroll
     */
    handleScroll(scrollTop) {
        this.scrollTop = scrollTop;
        
        // Tính toán startIndex dựa trên scroll position
        const newStartIndex = Math.floor(scrollTop / this.itemHeight);
        const newEndIndex = Math.min(newStartIndex + this.visibleCount, this.data.length);
        
        // Chỉ update nếu có thay đổi
        if (newStartIndex !== this.startIndex || newEndIndex !== this.endIndex) {
            this.startIndex = newStartIndex;
            this.endIndex = newEndIndex;
            this.updateVisibleItems();
        }
    }

    /**
     * Tải thêm items phía trước
     */
    loadPreviousItems() {
        if (this.startIndex <= 0) return;
        
        const newStartIndex = Math.max(0, this.startIndex - this.visibleCount);
        this.startIndex = newStartIndex;
        this.endIndex = Math.min(newStartIndex + this.visibleCount, this.data.length);
        
        this.updateVisibleItems();
        this.updateObserverPositions();
    }

    /**
     * Tải thêm items phía sau
     */
    loadNextItems() {
        if (this.endIndex >= this.data.length) return;
        
        const newEndIndex = Math.min(this.data.length, this.endIndex + this.visibleCount);
        this.startIndex = Math.max(0, newEndIndex - this.visibleCount);
        this.endIndex = newEndIndex;
        
        this.updateVisibleItems();
        this.updateObserverPositions();
    }

    /**
     * Cập nhật các items nhìn thấy
     */
    updateVisibleItems() {
        // Xóa tất cả items hiện tại
        this.container.innerHTML = '';
        
        // Render lại các items mới
        this.container.innerHTML = this.renderVisibleItems();
        
        // Cập nhật reference đến items
        this.items = this.container.querySelectorAll('.virtual-item');
        
        // Cập nhật vị trí observers
        this.updateObserverPositions();
    }

    /**
     * Cập nhật vị trí của observers
     */
    updateObserverPositions() {
        // Top observer - đặt ở vị trí startIndex
        const topY = this.startIndex * this.itemHeight;
        this.topObserver.style.transform = `translateY(${topY}px)`;
        
        // Bottom observer - đặt ở vị trí endIndex
        const bottomY = this.endIndex * this.itemHeight;
        this.bottomObserver.style.transform = `translateY(${bottomY}px)`;
    }

    /**
     * Tái sử dụng DOM elements (recycling)
     */
    recycleItems() {
        // Lấy các items đã cuộn ra khỏi viewport
        const recycledItems = [];
        
        this.items.forEach((item, index) => {
            const itemIndex = parseInt(item.getAttribute('data-index'));
            
            // Nếu item nằm ngoài range hiện tại, đánh dấu để tái sử dụng
            if (itemIndex < this.startIndex || itemIndex >= this.endIndex) {
                recycledItems.push(item);
            }
        });
        
        return recycledItems;
    }

    /**
     * Cập nhật nội dung của item
     */
    updateItemContent(item, dataIndex) {
        const itemData = this.data[dataIndex];
        item.innerHTML = this.renderItem(itemData, dataIndex);
        item.setAttribute('data-index', dataIndex);
        
        // Cập nhật vị trí
        const top = dataIndex * this.itemHeight;
        item.style.transform = `translateY(${top}px)`;
        y(item, top);
    }

    /**
     * Hiệu ứng smooth scroll
     */
    smoothScrollTo(index) {
        const targetScrollTop = index * this.itemHeight;
        this.root.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
        });
    }

    /**
     * Lấy thông tin hiện tại
     */
    getInfo() {
        return {
            totalItems: this.data.length,
            visibleCount: this.endIndex - this.startIndex,
            startIndex: this.startIndex,
            endIndex: this.endIndex,
            scrollTop: this.scrollTop
        };
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.topObserver) {
            this.topObserver.disconnect();
        }
        if (this.bottomObserver) {
            this.bottomObserver.disconnect();
        }
        this.root.innerHTML = '';
    }
}

// Export cho sử dụng
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VirtualList;
}
