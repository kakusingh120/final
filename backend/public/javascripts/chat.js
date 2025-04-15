// // DOM Elements
// const chatForm = document.getElementById('chat-form');
// const userInput = document.getElementById('user-input');
// const chatMessages = document.getElementById('chat-messages');
// const typingIndicator = document.getElementById('typing-indicator');
// const themeToggle = document.getElementById('theme-toggle');




//  // Theme initialization
//  function initTheme() {
//     const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
//     const userPrefersDark = localStorage.getItem('theme') === 'dark';
//     const systemPrefersDark = darkModeMediaQuery.matches;
    
//     if (userPrefersDark || (!localStorage.getItem('theme') && systemPrefersDark)) {
//         document.documentElement.classList.add('dark');
//     } else {
//         document.documentElement.classList.remove('dark');
//     }
// }

// // Theme toggle handler
// function toggleTheme() {
//     if (document.documentElement.classList.contains('dark')) {
//         document.documentElement.classList.remove('dark');
//         localStorage.setItem('theme', 'light');
//     } else {
//         document.documentElement.classList.add('dark');
//         localStorage.setItem('theme', 'dark');
//     }
// }

// // Initialize theme on load
// document.addEventListener('DOMContentLoaded', () => {
//     initTheme();
    
//     // Add event listener to theme toggle button
//     document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
// });


// chatForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const message = userInput.value.trim();
//     if (!message) return;

//     addMessage(message, 'user');
//     userInput.value = '';
//     typingIndicator.classList.remove('hidden');
//     chatMessages.scrollTop = chatMessages.scrollHeight;

//     try {
//         const res = await fetch("/ask", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 prompt: message,
//                 language: "English" // You can make this dynamic via a dropdown
//             })
//         });

//         const data = await res.json();
//         typingIndicator.classList.add('hidden');
//         addMessage(data.response || "⚠ No response received.", 'ai');
//     } catch (err) {
//         typingIndicator.classList.add('hidden');
//         addMessage("⚠ Error contacting AI backend.", 'ai');
//         console.error("Error:", err);
//     }
// });


// // Add message to chat
// function addMessage(text, sender) {
//     const messageDiv = document.createElement('div');
//     messageDiv.classList.add('flex', 'items-start', 'message-animation');
    
//     if (sender === 'user') {
//         messageDiv.classList.add('justify-end');
//         messageDiv.innerHTML = `
//             <div class="bg-gray-100 dark:bg-gray-600 rounded-lg p-3 max-w-[85%]">
//                 <p class="text-gray-800 dark:text-gray-200">${text}</p>
//                 <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
//             </div>
//             <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-500 flex items-center justify-center ml-3">
//                 <i class="fas fa-user text-gray-600 dark:text-gray-300"></i>
//             </div>
//         `;
//     } else {
//         messageDiv.innerHTML = `
//             <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
//                 <i class="fas fa-robot text-blue-600 dark:text-blue-300"></i>
//             </div>
//             <div class="bg-blue-50 dark:bg-gray-700 rounded-lg p-3 max-w-[85%]">
//                 <p class="text-gray-800 dark:text-gray-200">${text}</p>
//                 <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
//             </div>
//         `;
//     }
    
//     chatMessages.appendChild(messageDiv);
//     chatMessages.scrollTop = chatMessages.scrollHeight;
// }

// // Allow Shift+Enter for new line, Enter to submit
// userInput.addEventListener('keydown', (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//         e.preventDefault();
//         chatForm.dispatchEvent(new Event('submit'));
//     }
// });




// DOM Elements
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');
const typingIndicator = document.getElementById('typing-indicator');
const themeToggle = document.getElementById('theme-toggle');

// Theme initialization
function initTheme() {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const userPrefersDark = localStorage.getItem('theme') === 'dark';
    const systemPrefersDark = darkModeMediaQuery.matches;
    
    if (userPrefersDark || (!localStorage.getItem('theme') && systemPrefersDark)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// Theme toggle handler
function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Initialize theme on load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    themeToggle.addEventListener('click', toggleTheme);
});

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('flex', 'items-start', 'message-animation');
    
    if (sender === 'user') {
        messageDiv.classList.add('justify-end');
        messageDiv.innerHTML = `
            <div class="bg-gray-100 dark:bg-gray-600 rounded-lg p-3 max-w-[85%]">
                <p class="text-gray-800 dark:text-gray-200">${text}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-500 flex items-center justify-center ml-3">
                <i class="fas fa-user text-gray-600 dark:text-gray-300"></i>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                <i class="fas fa-robot text-blue-600 dark:text-blue-300"></i>
            </div>
            <div class="bg-blue-50 dark:bg-gray-700 rounded-lg p-3 max-w-[85%]">
                <p class="text-gray-800 dark:text-gray-200">${text}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Chat Functionality
if (chatForm) {
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent form from reloading the page

        const message = userInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessage(message, 'user');
        userInput.value = '';

        // Show typing indicator
        typingIndicator.classList.remove('hidden');
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();

            // Hide typing indicator
            typingIndicator.classList.add('hidden');

            if (data.response) {
                addMessage(data.response, 'bot');
            } else {
                addMessage("Sorry, I couldn't get a response from the AI.", 'bot');
            }

        } catch (error) {
            console.error('Chat error:', error);
            typingIndicator.classList.add('hidden');
            addMessage("An error occurred while processing your request. Please try again.", 'bot');
        }
    });
}

   


// Allow Shift+Enter for new line, Enter to submit
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
    }
});