// import React from "react";
import { React, useState } from 'react';
import { ethers } from "ethers";
// import transactionObject from "../../Transaction/Transaction";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";
import "./modal.css";

const startPayment = async ({ setError, setTxs, ether, address }) => {
  try {
    // console.log(window.ethereum)

    // if (!window.etherem) {
    //   throw new Error("Metamask not found");
    // }
    // await window.ethereum.send("eth_requestAccounts");
    await window.ethereum.request({ method: "eth_requestAccounts" });


    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log(signer)
    // console.log("test")
    const tx = await signer.sendTransaction({
      to: ethers.utils.getAddress(address),
      // to: address,

      // value: ethers.utils.formatEther(ether)
      value: ethers.utils.parseEther(ether)
    }, console.log("test"));


    console.log("test")
    setTxs([tx]);
    console.log({ ether, address });
    console.log("tx", tx);
  } catch (err) {
    console.log(err);
    setError(err.message);
  }
}

const Modal = ({ setShowModal, ethPrice }) => {
  // console.log(setEth);

  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('0.0');


  const handleChange = event => {
    setQuantity(event.target.value);
    setPrice(event.target.value * ethPrice);
    console.log('value is:', event.target.value);
  };


  const [error, setError] = useState();
  const [txs, setTxs] = useState([]);

  const handleSubmit = async (e) => {
    console.log("clicked");
    var address = "0x847a6b03B34596576465f0def9Fd543CB143a808"
    // console.log(address);
    e.preventDefault();
    // const data = new FormData(e.target);
    setError();
    await startPayment({
      setError,
      setTxs,
      ether: price.toString(),
      address: "0xAa82c2f45d0325F52F1a5124D7961195Fc8837Ee",
    });
  };




  return (
    <div className="modal__wrapper">
      <div className="single__modal">
        <span className="close__modal">
          <i class="ri-close-line" onClick={() => setShowModal(false)}></i>
        </span>
        <h6 className="text-center text-light">Place a Bid</h6>
        <p className="text-center text-light">
          You must bid at least <span className="money">{ethPrice} ETH</span>
        </p>

        <div className="input__item mb-4">
          <input type="number" placeholder="00 : 00 ETH" />
        </div>

        <div className="input__item mb-3">
          <h6>Enter Quantity, 7 available</h6>
          <input type="number" min="1" placeholder="Enter quantity" onChange={handleChange} value={quantity} />
        </div>

        <div className=" d-flex align-items-center justify-content-between">
          <p>You must bid at least</p>
          <span className="money">{ethPrice} ETH</span>
        </div>

        <div className=" d-flex align-items-center justify-content-between">
          <p>Service Fee</p>
          <span className="money">0.89 ETH</span>
        </div>

        <div className=" d-flex align-items-center justify-content-between">
          <p>Total Bid Amount</p>
          <span className="money">{price} ETH</span>
        </div>

        <button className="place__bid-btn" onClick={handleSubmit}>Place a Bid</button>
      </div>
      <ErrorMessage message={error} />
      <TxList txs={txs} />
    </div>

  );
};

export default Modal;
