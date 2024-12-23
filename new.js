const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");
//import dotenv from 'dotenv'

// console.log(process.env) 
// dotenv.config({path:"./.env"});
// console.log(process.env.API_KEY)
let userMessage;
const API_KEY = 'AIzaSyDnylqjOr4xR8q90d8iXkCn3zJXZSbiRW0';
const inputInitHeight = chatInput.scrollHeight; 

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);

  let chatContent;
  if (className === "outgoing") {
    chatContent = `<p></p>`;
  } else {
    chatContent = `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  }
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

const generateResponse = (incomingChatLi) => {
  const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        role: "user",
        parts: [{ text: userMessage }]
      }]
    }),
  };

  fetch(API_URL, requestOptions)
    .then(res => res.json())
    .then(data => {
      const messageElement = incomingChatLi.querySelector("p");
      messageElement.textContent = data.candidates[0].content.parts[0].text;
    })
    .catch((error) => {
      messageElement.classList.add("error");  
      messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatbox.scrollHeight);
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  
  chatInput.value = '';
  chatInput.style.height = `${inputInitHeight}px`;

  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600);
};

// chatInput.addEventListener("input", () => {
//   chatInput.style.height = `${inputInitHeight}px`;
//   chatInput.style.height = `${chatInput.scrollHeight}px`;
// })

// chatInput.addEventListener("keydown", (e) => {
//   if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
//     e.preventDefault();
//     handleChat();
//   }
// })

sendChatBtn.addEventListener("click", handleChat);
chatbotToggler.addEventListener("click", ()=> document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", ()=> document.body.classList.toggle("show-chatbot"));