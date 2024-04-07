import { GoogleGenerativeAI } from "@google/generative-ai";
document.addEventListener("DOMContentLoaded", () => {





    const chatbotToggler = document.querySelector(".chatbot-toggler");
    const closeBtn = document.querySelector(".close-btn");
    const chatbox = document.querySelector(".chatbox");
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector(".chat-input span");
    const bulletPoints = document.querySelectorAll(".chatbox .bulletPoint button");
    const listItems = document.querySelectorAll(".chatbox .bulletPoint button");


    bulletPoints.forEach((li) => {
        li.addEventListener("click", () => {
            const value = li.textContent.trim();
            //   console.log(value);
            userMessage = value; // Get user entered message and remove extra whitespace
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
                console.log(incomingChatLi);
                generateResponse(incomingChatLi);
            }, 600);

            // bulletPoints.forEach((li) => {
            //     li.remove();
            // })

        });
    });

    let userMessage = null; // Variable to store user's message
    // const API_KEY = "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"; // Paste your API key here
    // const API_KEY = "94a905c0-57d2-488d-89d4-e7fc0fe77325"; // Paste your API key here
    const API_KEY = "AIzaSyD2zOeb_Lk4AwlgkWr7BLN5ikqxaqnlbDY"; // google ai
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

    const generateResponse = async (chatElement) => {
        // const API_URL = "https://api.openai.com/v1/chat/completions";
        // const API_URL = "https://esm.run/@google/generative-ai"; //google ai
        const API_URL = "https://chatgpt.hkbu.edu.hk/general/rest";
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

        // ...
        // google chatbot ai    
        // Access your API key (see "Set up your API key" above)
        const genAI = new GoogleGenerativeAI(API_KEY);

        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = userMessage

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
        messageElement.textContent = text;
        // google chatbot ai    

        // Send POST request to API, get response and set the reponse as paragraph text
        // fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        //     messageElement.textContent = data.choices[0].message.content.trim();
        //     console.log(data);
        //     // console.log(data.choices[0].message.content.trim());
        // }).catch((error) => {
        //     console.log(error);

        //     messageElement.classList.add("error");
        //     messageElement.textContent = "Oops! Something went wrong. Please try again.";
        // }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
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
            console.log(incomingChatLi);
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
    // bulletPoint.addEventListener("click", handleItemClick);




})
