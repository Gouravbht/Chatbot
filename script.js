const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbox = document.querySelector(".chatbox");
const chatbotclosebtn = document.querySelector(".close-btn");
let userMessage = null;
const API_KEY = "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";
const createInitHeight = chatInput.scrollHeight;
const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : ` <span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

//Connecting OpenAI API

const generateResponse = (incomingChatLi) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const messageElement = incomingChatLi.querySelector("p");
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    }),
  };
  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      messageElement.textContent = data.choices[0].message.content;
      chatbox.appendChild(
        createChatLi(data.choices[0].message.content.trim(), "incoming")
      );
    })
    .catch((error) => {
      messageElement.textContent = "Oops something went wrong";
    })

    .catch((error) => {
      // Handle other errors that might occur within the .then block
      messageElement.textContent = "Oops something went wrong";
    });
};

const handleChat = () => {
  userMessage = chatInput.value.trim();

  if (!userMessage) return;
  chatInput.value = "";
  chatInput.style.height = `${createInitHeight}px`;
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  const incomingChatLi = createChatLi("Thinking", "incoming");
  chatbox.appendChild(incomingChatLi);
  // console.log(incomingChatLi);
  setTimeout(() => {
    chatbox.removeChild(incomingChatLi);
    generateResponse(incomingChatLi);
  }, 600);
};
chatInput.addEventListener("input", () => {
  chatInput.style.height = `${createInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleChat();
  }
});

sendChatBtn.addEventListener("click", handleChat);
chatbotclosebtn.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
);

chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);
