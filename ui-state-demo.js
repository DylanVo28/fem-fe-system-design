/**
 * UI State Management Demo - Messenger Application
 * Minh họa các kỹ thuật: Normalization, Search Optimization, Memory Management
 */

class UIStateManager {
    constructor() {
        this.initializeData();
        this.setupEventListeners();
        this.performanceMetrics = {
            slowSearchTime: 0,
            fastSearchTime: 0,
            memoryUsage: 0
        };
    }

    // 🧩 1. Khởi tạo dữ liệu mẫu
    initializeData() {
        // ❌ Non-normalized data (cách đơn giản nhưng chậm)
        this.nonNormalizedData = {
            contacts: [
                {
                    id: 1,
                    name: "Jane Smith",
                    avatar: "👩‍💼",
                    conversation: {
                        id: 10,
                        title: "Chat with Jane",
                        messages: [
                            { id: 5, text: "Hello there!", timestamp: "2024-01-15T10:00:00Z" },
                            { id: 6, text: "How are you doing?", timestamp: "2024-01-15T10:01:00Z" },
                            { id: 7, text: "I'm working on a new project", timestamp: "2024-01-15T10:02:00Z" }
                        ]
                    }
                },
                {
                    id: 2,
                    name: "John Doe",
                    avatar: "👨‍💻",
                    conversation: {
                        id: 11,
                        title: "Work Discussion",
                        messages: [
                            { id: 8, text: "Hey team!", timestamp: "2024-01-15T11:00:00Z" },
                            { id: 9, text: "Let's discuss the new features", timestamp: "2024-01-15T11:01:00Z" }
                        ]
                    }
                }
            ]
        };

        // ✅ Normalized data (1NF, 2NF, 3NF)
        this.normalizedData = {
            contacts: {
                "1": { id: 1, name: "Jane Smith", avatar: "👩‍💼", conversation_id: 10 },
                "2": { id: 2, name: "John Doe", avatar: "👨‍💻", conversation_id: 11 }
            },
            conversations: {
                "10": { id: 10, title: "Chat with Jane", contact_id: 1 },
                "11": { id: 11, title: "Work Discussion", contact_id: 2 }
            },
            messages: {
                "5": { id: 5, conversation_id: 10, text: "Hello there!", timestamp: "2024-01-15T10:00:00Z" },
                "6": { id: 6, conversation_id: 10, text: "How are you doing?", timestamp: "2024-01-15T10:01:00Z" },
                "7": { id: 7, conversation_id: 10, text: "I'm working on a new project", timestamp: "2024-01-15T10:02:00Z" },
                "8": { id: 8, conversation_id: 11, text: "Hey team!", timestamp: "2024-01-15T11:00:00Z" },
                "9": { id: 9, conversation_id: 11, text: "Let's discuss the new features", timestamp: "2024-01-15T11:01:00Z" }
            }
        };

        // 🔍 Inverted Index cho tìm kiếm nhanh
        this.invertedIndex = this.buildInvertedIndex();
    }

    // 🔍 2. Xây dựng Inverted Index
    buildInvertedIndex() {
        const index = {};
        
        Object.values(this.normalizedData.messages).forEach(message => {
            const words = message.text.toLowerCase().split(/\s+/);
            words.forEach(word => {
                if (!index[word]) {
                    index[word] = [];
                }
                if (!index[word].includes(message.id)) {
                    index[word].push(message.id);
                }
            });
        });
        
        return index;
    }

    // ⚡ 3. Performance Testing
    testSearchPerformance() {
        const searchTerm = "hello";
        const iterations = 1000;

        // Test non-normalized search
        const startSlow = performance.now();
        for (let i = 0; i < iterations; i++) {
            this.searchNonNormalized(searchTerm);
        }
        const endSlow = performance.now();
        this.performanceMetrics.slowSearchTime = Math.round(endSlow - startSlow);

        // Test normalized search
        const startFast = performance.now();
        for (let i = 0; i < iterations; i++) {
            this.searchNormalized(searchTerm);
        }
        const endFast = performance.now();
        this.performanceMetrics.fastSearchTime = Math.round(endFast - startFast);

        this.updatePerformanceDisplay();
    }

    // 🔍 4. Search Methods
    searchNonNormalized(term) {
        const results = [];
        this.nonNormalizedData.contacts.forEach(contact => {
            contact.conversation.messages.forEach(message => {
                if (message.text.toLowerCase().includes(term.toLowerCase())) {
                    results.push({
                        messageId: message.id,
                        text: message.text,
                        contactName: contact.name
                    });
                }
            });
        });
        return results;
    }

    searchNormalized(term) {
        const results = [];
        const messageIds = this.invertedIndex[term.toLowerCase()] || [];
        
        messageIds.forEach(messageId => {
            const message = this.normalizedData.messages[messageId];
            const conversation = this.normalizedData.conversations[message.conversation_id];
            const contact = this.normalizedData.contacts[conversation.contact_id];
            
            results.push({
                messageId: message.id,
                text: message.text,
                contactName: contact.name
            });
        });
        
        return results;
    }

    // 💾 5. Memory Management với IndexedDB
    async initializeIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('MessengerDB', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Tạo stores cho từng entity
                if (!db.objectStoreNames.contains('contacts')) {
                    db.createObjectStore('contacts', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('conversations')) {
                    db.createObjectStore('conversations', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('messages')) {
                    const messageStore = db.createObjectStore('messages', { keyPath: 'id' });
                    messageStore.createIndex('conversation_id', 'conversation_id', { unique: false });
                }
            };
        });
    }

    async saveToIndexedDB() {
        try {
            const db = await this.initializeIndexedDB();
            const transaction = db.transaction(['contacts', 'conversations', 'messages'], 'readwrite');
            
            // Save contacts
            const contactStore = transaction.objectStore('contacts');
            Object.values(this.normalizedData.contacts).forEach(contact => {
                contactStore.put(contact);
            });
            
            // Save conversations
            const conversationStore = transaction.objectStore('conversations');
            Object.values(this.normalizedData.conversations).forEach(conversation => {
                conversationStore.put(conversation);
            });
            
            // Save messages
            const messageStore = transaction.objectStore('messages');
            Object.values(this.normalizedData.messages).forEach(message => {
                messageStore.put(message);
            });
            
            this.updateMemoryStatus('Data saved to IndexedDB successfully!');
        } catch (error) {
            console.error('Error saving to IndexedDB:', error);
            this.updateMemoryStatus('Error saving to IndexedDB: ' + error.message);
        }
    }

    // 📊 6. Display Methods
    displayDataStructures() {
        document.getElementById('nonNormalizedData').textContent = 
            JSON.stringify(this.nonNormalizedData, null, 2);
        
        document.getElementById('normalizedData').textContent = 
            JSON.stringify(this.normalizedData, null, 2);
    }

    displayInvertedIndex() {
        document.getElementById('invertedIndex').textContent = 
            JSON.stringify(this.invertedIndex, null, 2);
    }

    displaySearchResults(results) {
        const resultsDiv = document.getElementById('searchResults');
        if (results.length === 0) {
            resultsDiv.innerHTML = '<p>Không tìm thấy kết quả nào.</p>';
            return;
        }
        
        resultsDiv.innerHTML = results.map(result => 
            `<div class="search-result">
                <strong>${result.contactName}:</strong> ${result.text}
                <small>(ID: ${result.messageId})</small>
            </div>`
        ).join('');
    }

    updatePerformanceDisplay() {
        document.getElementById('slowSearchTime').textContent = 
            this.performanceMetrics.slowSearchTime + 'ms';
        document.getElementById('fastSearchTime').textContent = 
            this.performanceMetrics.fastSearchTime + 'ms';
        
        const improvement = Math.round(
            (this.performanceMetrics.slowSearchTime / this.performanceMetrics.fastSearchTime) * 100
        );
        
        document.querySelector('.performance').innerHTML = 
            `Tìm message: O(1) - Nhanh hơn ${improvement}%!`;
    }

    updateMemoryStatus(message) {
        document.getElementById('memoryStatus').innerHTML = 
            `<div class="status-message">${message}</div>`;
    }

    // 🎯 7. Event Listeners
    setupEventListeners() {
        document.getElementById('loadData').addEventListener('click', () => {
            this.displayDataStructures();
            this.displayInvertedIndex();
            this.testSearchPerformance();
        });

        document.getElementById('searchMessages').addEventListener('click', () => {
            const searchTerm = document.getElementById('searchInput').value;
            if (!searchTerm) {
                alert('Vui lòng nhập từ khóa tìm kiếm');
                return;
            }
            
            const results = this.searchNormalized(searchTerm);
            this.displaySearchResults(results);
        });

        document.getElementById('showNormalized').addEventListener('click', () => {
            this.displayDataStructures();
        });

        document.getElementById('memoryTest').addEventListener('click', () => {
            this.testSearchPerformance();
        });

        document.getElementById('loadToMemory').addEventListener('click', () => {
            this.updateMemoryStatus('Data loaded to memory. Size: ' + 
                JSON.stringify(this.normalizedData).length + ' bytes');
        });

        document.getElementById('saveToIndexedDB').addEventListener('click', () => {
            this.saveToIndexedDB();
        });

        document.getElementById('clearMemory').addEventListener('click', () => {
            this.normalizedData = { contacts: {}, conversations: {}, messages: {} };
            this.updateMemoryStatus('Memory cleared!');
        });
    }
}

// 🚀 Khởi tạo ứng dụng
document.addEventListener('DOMContentLoaded', () => {
    const app = new UIStateManager();
    
    // Hiển thị thông tin storage
    document.getElementById('sessionInfo').textContent = 
        'Tạm thời (mất khi đóng tab)';
    document.getElementById('localInfo').textContent = 
        'Persistent (vài MB, chỉ string)';
    document.getElementById('indexedInfo').textContent = 
        'Large data (vài GB, async, indexed)';
});

// 📈 Memory monitoring
function getMemoryUsage() {
    if (performance.memory) {
        return {
            used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
            total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
            limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
        };
    }
    return null;
}

// Update memory display
setInterval(() => {
    const memory = getMemoryUsage();
    if (memory) {
        document.getElementById('currentMemory').textContent = memory.used + 'MB';
        document.getElementById('peakMemory').textContent = memory.limit + 'MB';
    }
}, 1000);
