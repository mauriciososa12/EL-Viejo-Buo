const socket = io();
const userElement = document.getElementById("user__name");
const messagesContainer = document.getElementById("messages__container");

if (messagesContainer !== null && userElement !== null) {
  //Shoul be a better way of validate this
  const user = userElement.innerHTML;

  socket.emit("auth", user);

  const loadMessages = (callback) => {
    socket.on("server:messages", callback);
  };

  const saveMessage = (user, message) => {
    socket.emit("client:newMessage", {
      user,
      message,
    });
  };

  const loadNewMessage = (callback) => {
    socket.on("server:newMessage", callback);
  };

  const oneMessage = (message) => {
    const container = document.createElement("div");

    container.innerHTML = `
    <h3>${message.user}:</h3>
    <p>${message.message}</p>
  `;

    return container;
  };

  const renderMessages = (messages) => {
    messagesContainer.innerHTML = "";
    messages.forEach((message) =>
      messagesContainer.append(oneMessage(message))
    );
  };

  const appendNewMessage = (message) => {
    messagesContainer.append(oneMessage(message));
  };

  window.addEventListener("DOMContentLoaded", () => {
    loadMessages(renderMessages);
    loadNewMessage(appendNewMessage);
  });
}
