// GPU Rendering Demo JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Performance monitoring variables
    let reflowFPS = 60;
    let gpuFPS = 60;
    let reflowDrops = 0;
    let gpuDrops = 0;
    let isReflowAnimating = false;
    let isGpuAnimating = false;

    // FPS monitoring
    function updateFPS() {
        document.getElementById('reflow-fps').textContent = reflowFPS;
        document.getElementById('gpu-fps').textContent = gpuFPS;
        document.getElementById('reflow-drops').textContent = reflowDrops;
        document.getElementById('gpu-drops').textContent = gpuDrops;
    }

    // Reflow test (CPU heavy)
    document.getElementById('reflow-test').addEventListener('click', function() {
        if (isReflowAnimating) return;
        
        isReflowAnimating = true;
        const element = document.querySelector('.reflow-element');
        const container = document.querySelector('.reflow-element').parentElement;
        
        // Simulate reflow by changing layout properties
        let width = 100;
        let height = 50;
        let direction = 1;
        
        const reflowInterval = setInterval(() => {
            width += direction * 2;
            height += direction * 1;
            
            if (width >= 200 || width <= 50) {
                direction *= -1;
            }
            
            // These properties cause reflow
            element.style.width = width + 'px';
            element.style.height = height + 'px';
            element.style.marginLeft = (width / 10) + 'px';
            
            // Simulate FPS drop
            reflowFPS = Math.max(30, 60 - Math.floor(Math.random() * 20));
            if (reflowFPS < 50) reflowDrops++;
            
            updateFPS();
        }, 16); // ~60fps
        
        // Stop after 3 seconds
        setTimeout(() => {
            clearInterval(reflowInterval);
            element.style.width = '';
            element.style.height = '';
            element.style.marginLeft = '';
            reflowFPS = 60;
            isReflowAnimating = false;
            updateFPS();
        }, 3000);
    });

    // GPU test (GPU optimized)
    document.getElementById('gpu-test').addEventListener('click', function() {
        if (isGpuAnimating) return;
        
        isGpuAnimating = true;
        const element = document.querySelector('.gpu-element');
        
        let rotation = 0;
        let scale = 1;
        let direction = 1;
        
        const gpuInterval = setInterval(() => {
            rotation += direction * 2;
            scale += direction * 0.05;
            
            if (rotation >= 360 || rotation <= 0) {
                direction *= -1;
            }
            
            // These properties use GPU
            element.style.transform = `rotate(${rotation}deg) scale(${scale}) translateX(${Math.sin(rotation * Math.PI / 180) * 30}px)`;
            element.style.opacity = 0.5 + Math.abs(Math.sin(rotation * Math.PI / 180)) * 0.5;
            
            // GPU maintains high FPS
            gpuFPS = 60;
            if (Math.random() < 0.01) gpuDrops++; // Very rare drops
            
            updateFPS();
        }, 16); // ~60fps
        
        // Stop after 3 seconds
        setTimeout(() => {
            clearInterval(gpuInterval);
            element.style.transform = '';
            element.style.opacity = '';
            gpuFPS = 60;
            isGpuAnimating = false;
            updateFPS();
        }, 3000);
    });

    // CSS Properties Demo
    const cssTestElement = document.getElementById('css-test-element');
    const propertyButtons = document.querySelectorAll('.property-btn');
    
    propertyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const property = this.dataset.property;
            
            // Reset element
            cssTestElement.style.cssText = '';
            cssTestElement.className = 'demo-element';
            
            // Add animation class
            cssTestElement.classList.add('animating');
            
            // Apply property based on type
            switch(property) {
                case 'width':
                    cssTestElement.style.width = '400px';
                    cssTestElement.classList.add('reflow-animating');
                    break;
                case 'height':
                    cssTestElement.style.height = '100px';
                    cssTestElement.classList.add('reflow-animating');
                    break;
                case 'margin':
                    cssTestElement.style.margin = '20px';
                    cssTestElement.classList.add('reflow-animating');
                    break;
                case 'padding':
                    cssTestElement.style.padding = '30px';
                    cssTestElement.classList.add('reflow-animating');
                    break;
                case 'left':
                    cssTestElement.style.position = 'relative';
                    cssTestElement.style.left = '50px';
                    cssTestElement.classList.add('reflow-animating');
                    break;
                case 'top':
                    cssTestElement.style.position = 'relative';
                    cssTestElement.style.top = '20px';
                    cssTestElement.classList.add('reflow-animating');
                    break;
                case 'transform':
                    cssTestElement.style.transform = 'translateX(50px) rotate(15deg) scale(1.2)';
                    cssTestElement.classList.add('gpu-animating');
                    break;
                case 'opacity':
                    cssTestElement.style.opacity = '0.6';
                    cssTestElement.classList.add('gpu-animating');
                    break;
                case 'filter':
                    cssTestElement.style.filter = 'blur(2px) brightness(1.2)';
                    cssTestElement.classList.add('gpu-animating');
                    break;
                case 'backdrop-filter':
                    cssTestElement.style.backdropFilter = 'blur(10px)';
                    cssTestElement.classList.add('gpu-animating');
                    break;
            }
            
            // Remove animation classes after animation
            setTimeout(() => {
                cssTestElement.classList.remove('animating', 'reflow-animating', 'gpu-animating');
            }, 500);
        });
    });

    // Interactive Layer Demo
    function createInteractiveLayers() {
        const layerConditions = document.querySelectorAll('.condition-item');
        
        layerConditions.forEach(condition => {
            const elements = condition.querySelectorAll('.demo-element');
            
            elements.forEach(element => {
                element.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.1)';
                    this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
                });
                
                element.addEventListener('mouseleave', function() {
                    this.style.transform = '';
                    this.style.boxShadow = '';
                });
            });
        });
    }

    // VRAM Cost Calculator
    function updateVRAMCost() {
        const costItems = document.querySelectorAll('.cost-item');
        let totalLayers = 1; // Root layer
        
        // Add some interactive elements to show cost
        const layerElements = document.querySelectorAll('.demo-element');
        totalLayers += layerElements.length;
        
        const totalCost = 8.7 + (totalLayers - 1) * 0.5;
        
        // Update cost display if needed
        const costDisplay = document.querySelector('.cost-item.total .cost');
        if (costDisplay) {
            costDisplay.textContent = `~${totalCost.toFixed(1)}MB VRAM`;
        }
    }

    // Performance Tips
    function showPerformanceTips() {
        const tips = [
            "💡 Sử dụng transform và opacity cho animations",
            "💡 Tránh thay đổi width, height, margin, padding",
            "💡 Sử dụng will-change cho elements sẽ animate",
            "💡 Kiểm tra DevTools Performance tab",
            "💡 Monitor FPS và frame drops"
        ];
        
        // Add tips to the page
        const tipsContainer = document.createElement('div');
        tipsContainer.className = 'performance-tips';
        tipsContainer.innerHTML = `
            <h3>🚀 Performance Tips</h3>
            <ul>
                ${tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        `;
        
        const summarySection = document.querySelector('.summary');
        summarySection.appendChild(tipsContainer);
    }

    // Initialize all interactive features
    createInteractiveLayers();
    updateVRAMCost();
    showPerformanceTips();
    updateFPS();

    // Add some visual feedback for better UX
    const demoElements = document.querySelectorAll('.demo-element');
    demoElements.forEach(element => {
        element.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Add smooth scrolling for better navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            const focusedElement = document.activeElement;
            if (focusedElement && focusedElement.classList.contains('property-btn')) {
                focusedElement.click();
            }
        }
    });

    console.log('🚀 GPU Rendering Demo loaded successfully!');
    console.log('💡 Try the interactive demos to see CPU vs GPU performance differences');
    console.log('📊 Check DevTools Performance tab while running animations');
});
