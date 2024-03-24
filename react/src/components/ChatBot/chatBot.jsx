import React, { useRef, useEffect, useState } from "react";

import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import "./chatBot.css";
import "./chatBot.js";

import { Link } from "react-router-dom";
// import { handleItemClick } from "./chatBot.js";


export default function ChatBot(props) {


  const bulletPorints = ["What is NFT", "Create an NFT", "What are the key terms to know in NFTs and Web3 ?", "How can I stay safe and protect my NFTs ?"];

  const listItems = bulletPorints.map((point) => <li className="bulletPoint" ><button className="btn-grad">{point}</button></li>);
  // const listItems = [
  //   <li className="bulletPoint" key="item1">
  //     <button className="btn-grad">Asd</button>
  //   </li>,
  //   <li className="bulletPoint" key="item2">
  //     <button className="btn-grad">sssss</button>
  //   </li>
  // ];

    useEffect(() => {
      console.log(document.querySelector("chatbox"))
    }, [])

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,1,0" />
      <button className="chatbot-toggler">
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-outlined">close</span>
      </button><div className="chatbot">
        <header>
          <h2>Chatbot</h2>
          <span className="close-btn material-symbols-outlined">close</span>
        </header>
        <ul className="chatbox">
          <li className="chat incoming">
            <span className="material-symbols-outlined">smart_toy</span>
            <p>Hi there 👋How can I help you today?</p>
          </li>


          {listItems}
          {/* <li className="bulletPoint"><button className="btn-grad">Dolores quaerat illo totam porro</button></li>
          <li className="bulletPoint"><button className="btn-grad">Quidem aliquid perferendis voluptates</button></li>
          <li className="bulletPoint"><button className="btn-grad">Fuga</button></li> */}
          {/* 
          <div class="module">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero pariatur corporis quaerat voluptatum eos tempora temporibus nisi voluptates sed, exercitationem sequi dolore culpa incidunt accusamus, quasi unde reprehenderit ea molestias.
          </div> */}


        </ul>




        <div className="chat-input">
          <textarea placeholder="Enter a message..." spellcheck="false" required></textarea>
          <span id="send-btn" className="material-symbols-rounded">send</span>
        </div>
      </div>
    </>
  );

};

