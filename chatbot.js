const API_KEY = "AIzaSyBNCrX2vbnUnqFuJgniPvXXbH8iwW4ZtLQ"; // Use your actual key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Add message to chatbox
function addMessage(text, sender) {
  const chatbox = document.getElementById("chatbox");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
  chatbox.appendChild(messageDiv);
  chatbox.scrollTop = chatbox.scrollHeight;
}

// Show Typing Dots
function showTyping() {
  const chatbox = document.getElementById("chatbox");
  const typingDiv = document.createElement("div");
  typingDiv.classList.add("message", "bot");
  typingDiv.id = "typingIndicator";
  typingDiv.innerHTML = `<span class="typing"></span><span class="typing"></span><span class="typing"></span>`;
  chatbox.appendChild(typingDiv);
  chatbox.scrollTop = chatbox.scrollHeight;
}

// Remove Typing
function removeTyping() {
  const typingDiv = document.getElementById("typingIndicator");
  if (typingDiv) typingDiv.remove();
}

// Fetch Gemini Response
async function getGeminiResponse(userMessage) {
  const requestBody = {
    contents: [{ role: "user", parts: [{ text: userMessage }] }]
  };

  try {
    showTyping();

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    removeTyping();

    if (data && data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      return "No response from Gemini API.";
    }
  } catch (error) {
    removeTyping();
    console.error("Error:", error);
    return "Error connecting to Gemini API.";
  }
}

// Send button
document.getElementById("sendBtn").addEventListener("click", async () => {
  const userInput = document.getElementById("userInput").value.trim();
  if (!userInput) return;

  addMessage(userInput, "user");
  document.getElementById("userInput").value = "";

  const botResponse = await getGeminiResponse(userInput);
  setTimeout(() => {
    addMessage(botResponse, "bot");
  }, 500);
});

// Voice Input using Web Speech API
const micBtn = document.getElementById("micBtn");
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";

micBtn.addEventListener("click", () => {
  recognition.start();
  micBtn.style.background = "green";
});

recognition.onresult = async (event) => {
  const voiceText = event.results[0][0].transcript;
  addMessage(voiceText, "user");
  micBtn.style.background = "red";

  const botResponse = await getGeminiResponse(voiceText);
  setTimeout(() => {
    addMessage(botResponse, "bot");
  }, 500);
};
