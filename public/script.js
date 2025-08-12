const chatBox = document.getElementById("chat-box");
const sendBtn = document.getElementById("send-btn");
const promptInput = document.getElementById("prompt");

sendBtn.addEventListener("click", sendMessage);
promptInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

function addMessage(content, sender, thinkingPart = null) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("message", sender);

  const text = document.createElement("div");
  text.textContent = content;
  wrapper.appendChild(text);

  if (thinkingPart) {
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "Mostrar pensamiento";
    toggleBtn.classList.add("toggle-btn");

    const thinkingDiv = document.createElement("div");
    thinkingDiv.classList.add("thinking");
    thinkingDiv.textContent = thinkingPart;

    toggleBtn.addEventListener("click", () => {
        const isHidden = thinkingDiv.style.display === "none";
        thinkingDiv.style.display = isHidden ? "block" : "none";
        toggleBtn.textContent = isHidden ? "Ocultar pensamiento" : "Mostrar pensamiento";
    });

    wrapper.appendChild(toggleBtn);
    wrapper.appendChild(thinkingDiv);
  }

  chatBox.appendChild(wrapper);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const prompt = promptInput.value.trim();
  if (!prompt) return;

  addMessage(prompt, "user");
  promptInput.value = "";

  const tempMsg = document.createElement("div");
  tempMsg.classList.add("message", "bot");
  tempMsg.textContent = "Escribiendo...";
  chatBox.appendChild(tempMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    tempMsg.remove();

    // Separar pensamiento y respuesta
    const match = data.response.match(/<think>([\s\S]*?)<\/think>([\s\S]*)/);
    if (match) {
      const thinking = match[1].trim();
      const finalAnswer = match[2].trim();
      addMessage(finalAnswer, "bot", thinking);
    } else {
      addMessage(data.response, "bot");
    }

  } catch (err) {
    tempMsg.remove();
    addMessage("Error al conectar con el servidor", "bot");
  }
}
