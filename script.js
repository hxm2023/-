// 照片轮播功能
const carouselImages = [
    'images/8e6d1268a91f62cf9d6416761b613904.png',
    'images/edf4008b3c3f9fe99b2a65568f862ac7.jpg',
    'images/98f674ce8fbadfc370e6e54a107d0d9a.jpg',
];

let currentImageIndex = 0;
const carousel = document.querySelector('.carousel');

function createCarouselImages() {
    carouselImages.forEach((image, index) => {
        const div = document.createElement('div');
        div.className = `carousel-image ${index === 0 ? 'active' : ''}`;
        div.style.backgroundImage = `url(${image})`;
        carousel.appendChild(div);
    });
}

function updateCarousel() {
    const images = document.querySelectorAll('.carousel-image');
    images[currentImageIndex].classList.remove('active');
    currentImageIndex = (currentImageIndex + 1) % carouselImages.length;
    images[currentImageIndex].classList.add('active');
}

createCarouselImages();
setInterval(updateCarousel, 5000); // 每5秒切换一次图片

// 作品集展示
const portfolioItems = [
    { title: '作品1', image: 'images/dafad5bee9a09c21f4a5b2b00baef4a5.jpeg' },
    { title: '作品2', image: 'images/fdeae0f55741dcf4f5dff7ca5b97504c.png' },
    { title: '作品3', image: 'images/f5512e5309aeeb7c611f079110361965.jpeg' },
];

const portfolioGrid = document.querySelector('.portfolio-grid');

portfolioItems.forEach(item => {
    const portfolioItem = document.createElement('div');
    portfolioItem.className = 'portfolio-item';
    portfolioItem.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <h3>${item.title}</h3>
    `;
    portfolioGrid.appendChild(portfolioItem);
});

// AI对话功能
const chatHistory = document.querySelector('.chat-history');
const chatInput = document.querySelector('.chat-input textarea');
const sendButton = document.querySelector('#send-btn');

sendButton.addEventListener('click', sendMessage);

async function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        addMessageToChat('user', message);
        chatInput.value = '';
        
        // 添加AI的加载消息
        const loadingMessage = addMessageToChat('ai', '');
        const loadingDots = createLoadingDots();
        loadingMessage.appendChild(loadingDots);
        
        try {
            const response = await fetch('https://api.deepseek.com/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer sk-059174d533db46c39f33229d182b08b0'
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        {"role": "system", "content": "You are a helpful assistant named 三月七 from the game Honkai: Star Rail. You are cheerful, friendly, and sometimes a bit clumsy. You like to use cute emoticons in your responses."},
                        {"role": "user", "content": message}
                    ],
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            
            // 移除加载动画并添加AI回复
            loadingMessage.removeChild(loadingDots);
            loadingMessage.textContent = aiResponse;
        } catch (error) {
            console.error('Error:', error);
            loadingMessage.removeChild(loadingDots);
            loadingMessage.textContent = '抱歉，我遇到了一些问题，无法回答你的问题。 (>_<)';
        }
    }
}

function addMessageToChat(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    messageElement.textContent = message;
    chatHistory.appendChild(messageElement);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    return messageElement;
}

function createLoadingDots() {
    const loadingDots = document.createElement('div');
    loadingDots.className = 'loading-dots';
    for (let i = 0; i < 3; i++) {
        const span = document.createElement('span');
        loadingDots.appendChild(span);
    }
    return loadingDots;
}

// 返回顶部按钮功能
const backToTopButton = document.querySelector('#back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 设置头像
document.querySelector('.avatar').src = 'images/38204ad934d4814c2f158820d74fd22e.jpeg';

// 初始化轮播
// 删除这行，因为我们已经在createCarouselImages()中初始化了轮播
// updateCarousel();

// 创建泡泡
function createBubble() {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    
    const size = Math.random() * 60 + 20; // 20px to 80px
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    
    bubble.style.left = `${Math.random() * 100}vw`;
    bubble.style.animationDuration = `${Math.random() * 5 + 5}s`; // 5s to 10s
    
    document.getElementById('bubble-container').appendChild(bubble);
    
    setTimeout(() => {
        bubble.remove();
    }, 10000); // 移除泡泡，防止DOM过大
}

// 每200ms创建一个泡泡
setInterval(createBubble, 200);

// 控制背景音乐
const backgroundMusic = document.getElementById('background-music');

// 尝试自动播放音乐
function playBackgroundMusic() {
    backgroundMusic.play().catch(error => {
        console.log("Auto-play was prevented. Please interact with the document first.");
        // 创建一个播放按钮，让用户手动触发播放
        const playButton = document.createElement('button');
        playButton.textContent = '播放背景音乐';
        playButton.style.position = 'fixed';
        playButton.style.top = '10px';
        playButton.style.right = '10px';
        playButton.style.zIndex = '1001';
        playButton.onclick = () => {
            backgroundMusic.play();
            playButton.remove();
        };
        document.body.appendChild(playButton);
    });
}

// 当文档加载完成时尝试播放音乐
document.addEventListener('DOMContentLoaded', playBackgroundMusic);
