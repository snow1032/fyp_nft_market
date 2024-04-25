// import React from "react";
import { React, useState, useEffect, useRef } from 'react';
import { ethers } from "ethers";
// import transactionObject from "../../Transaction/Transaction";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";
import Swal from "sweetalert";
import "./modal.css";
import { getOwnerAddress } from "../../../assets/api/api";

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
    const receipt = await tx.wait();
    const isSuccessful = receipt.status === 1;
    // console.log('Transaction successful:', isSuccessful);

    // console.log("test")
    setTxs([tx]);
    // console.log({ ether, address });
    console.log("tx", tx);

    return isSuccessful;
  } catch (err) {
    console.log(err);
    setError(err.message);
  }
}

const Modal = ({ setShowModal, ethPrice, nftID, name, owner }) => {
  // console.log(setEth);

  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('0.0');
  const [ownerAddress, setOwnerAddress] = useState('');


  // const handleChange = event => {
  //   setQuantity(event.target.value);
  //   setPrice(event.target.value * ethPrice);
  //   console.log('value is:', event.target.value);
  // };
  useEffect(() => {
    setPrice(ethPrice + 0.89);
  }, [ethPrice]);

  const [error, setError] = useState();
  const [txs, setTxs] = useState([]);

  const handleSubmit = async (e) => {

    const getOwnAddress = new FormData();
    getOwnAddress.append('owner', owner);
    getOwnerAddress(getOwnAddress).then((data) => {
      // ownerAddress = data.address;
      data.map((data) => {

        // ownerAddress = data.address;
        setOwnerAddress(data.address);
      })
      // var address = "0x847a6b03B34596576465f0def9Fd543CB143a808"
      // console.log(typeof (ownerAddress));
      // console.log(typeof(address));
    })

    // console.log(ownerAddress);

    // console.log("clicked");
    // var address = "0x847a6b03B34596576465f0def9Fd543CB143a808"
    // var address =ownerAddress;
    // // console.log(address);
    // e.preventDefault();
    // const data = new FormData(e.target);
    setError();
    // setTxs([]);
    await startPayment({
      setError,
      setTxs,
      ether: price.toString(),
      address: ownerAddress,
    }).then((response) => {

      if (response == true) {
        console.log(response)
        buyNFT();

      }
    });

    async function buyNFT(e) {
      const accessToken = localStorage.getItem('ACCESS_TOKEN');
      const formData = new FormData();
      formData.append('id', nftID);
      if (!accessToken) {
        console.error('Access token is missing');
        // Handle the missing access token scenario, e.g., redirect to login or show an error message
      } else {
        fetch('http://127.0.0.1:8000/api/nft/buyNFTsForReact', {
          method: 'POST',
          // body: JSON.stringify({ id: nftID }),
          body: formData,
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
        })
          .then(response => response.json())
          .then(data => {
            console.log('Buy response:', data);
            if (data.status == true) {
              Swal({
                title: name,
                text: "Buy NFT Success",
                icon: "success",
                dangerMode: true,
                timer: 1500,
              }).then(() => {
                window.location.reload();
              });
            } else {
              Swal({
                title: "Buy NFT Failed",
                text: "You clicked the button!",
                icon: "error",

              })
                .then(() => { window.location.reload(); });

            }
            // Handle the response data as needed
          })
          .catch(error => {
            console.error('Error uploading file:', error);
            // Handle the error as needed
          });
      }
    }
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

        {/* <div className="input__item mb-4">
          <input type="number" placeholder={ethPrice+" ETH"} />
        </div> */}

        {/* <div className="input__item mb-3">
          <h6>Enter Quantity, 7 available</h6>
          <input type="number" min="1" placeholder="Enter quantity" onChange={handleChange} value={quantity} />
        </div> */}

        <div className=" d-flex align-items-center justify-content-between">
          <p>You must bid at least</p>
          <span className="money">{ethPrice} ETH</span>
        </div>

        <div className=" d-flex align-items-center justify-content-between">
          <p>Service Fee</p>
          <span className="money">0.89 ETH</span>
        </div>

        <div className=" d-flex align-items-center justify-content-between">
          <p>Total Eth Amount</p>
          <span className="money">{price} ETH</span>
        </div>

        <button className="place__bid-btn" onClick={handleSubmit}>Comfirm</button>
      </div>
      <ErrorMessage message={error} />
      <TxList txs={txs} />
    </div>

  );
};

export default Modal;
