document.addEventListener("DOMContentLoaded", () => {



    const chatbotToggler = document.querySelector(".chatbot-toggler");
    const closeBtn = document.querySelector(".close-btn");
    const chatbox = document.querySelector(".chatbox");
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector(".chat-input span");
    const bulletPoint = document.querySelector(".chatbox .bulletPoint button");
    const listItems = document.querySelectorAll(".chatbox .bulletPoint button");

    listItems.forEach((li) => {
        li.addEventListener("click", () => {
          const value = li.textContent.trim();
          console.log(value);
        });
      });

    let userMessage = null; // Variable to store user's message
    const API_KEY = "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"; // Paste your API key here
    // const API_KEY = "94a905c0-57d2-488d-89d4-e7fc0fe77325"; // Paste your API key here
    const inputInitHeight = chatInput ? chatInput.scrollHeight : 1000;

    const createChatLi = (message, className) => {
        // Create a chat <li> element with passed message and className
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", `${className}`);
        let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
        chatLi.innerHTML = chatContent;
        chatLi.querySelector("p").textContent = message;
        return chatLi; // return chat <li> element
    }

    const generateResponse = (chatElement) => {
        const API_URL = "https://api.openai.com/v1/chat/completions";
        // const API_URL = "https://chatgpt.hkbu.edu.hk/general/rest/deployments/gpt-35-turbo-16k/chat/completions?api-version=2023-08-01-preview";
        const messageElement = chatElement.querySelector("p");

        // Define the properties and message for the API request
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userMessage }],
            })
        }

        // Send POST request to API, get response and set the reponse as paragraph text
        fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
            messageElement.textContent = data.choices[0].message.content.trim();
            console.log(data);
            // console.log(data.choices[0].message.content.trim());
        }).catch((error) => {
            console.log(error);

            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Something went wrong. Please try again.";
        }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
    }

    const handleChat = () => {
        userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
        if (!userMessage) return;

        // Clear the input textarea and set its height to default
        chatInput.value = "";
        chatInput.style.height = `${inputInitHeight}px`;

        // Append the user's message to the chatbox
        chatbox.appendChild(createChatLi(userMessage, "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);

        setTimeout(() => {
            // Display "Thinking..." message while waiting for the response
            const incomingChatLi = createChatLi("Thinking...", "incoming");
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
            generateResponse(incomingChatLi);
        }, 600);
    }

    try {
        chatInput.addEventListener("input", () => {
            // Adjust the height of the input textarea based on its content
            chatInput.style.height = `${inputInitHeight}px`;
            chatInput.style.height = `${chatInput.scrollHeight}px`;
        });

        chatInput.addEventListener("keydown", (e) => {
            // If Enter key is pressed without Shift key and the window 
            // width is greater than 800px, handle the chat
            if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
                e.preventDefault();
                handleChat();
            }
        });
    } catch (error) {

    }


    const handleItemClick = () => {
        console.log("clicked");

        // if (bulletPoint) {
        //     const value = bulletPoint;
        //     console.log(value);
        // } else {
        //     console.log("Element not found");
        // }


        // bulletPoint.forEach((li) => {
        //     const value = li.textContent.trim();
        //     console.log(value);
        //   });
    }





    sendChatBtn.addEventListener("click", handleChat);
    closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
    chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
    bulletPoint.addEventListener("click", handleItemClick);




})
