const input = document.getElementById("inputQuestion");
const sendBtn = document.getElementById("sendBtn");
const chatBox = document.getElementById("chatBox");

function appendMessage(sender, message) {
  const p = document.createElement("p");
  p.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendQuestion();
  }
});

sendBtn.addEventListener("click", () => {
  sendQuestion();
});

function sendQuestion() {
  const question = input.value.trim();
  if (!question) return;

  appendMessage("Você", question);
  appendMessage("Chat", "Digitando...");

  input.value = "";
  input.disabled = true;
  sendBtn.disabled = true;

  fetch("/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  })
    .then((res) => res.json())
    .then((data) => {
      chatBox.lastChild.remove(); // remove "Digitando..."
      appendMessage("Chat", data.response || "Sem resposta.");
    })
    .catch((err) => {
      chatBox.lastChild.remove();
      appendMessage("Erro", "Ocorreu um erro. Verifique o servidor.");
      console.error(err);
    })
    .finally(() => {
      input.disabled = false;
      sendBtn.disabled = false;
      input.focus();
    });
}
