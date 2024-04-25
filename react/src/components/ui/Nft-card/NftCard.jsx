import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert";
import "./nft-card.css";
import "../../../assets/css/button.css";


import Modal from "../Modal/Modal";

const NftCard = (props) => {
  // console.log(props.item);
  // const { title, id, currentBid, creatorImg, imgUrl, creator} = props.item;
  const { id, name, url, creator, owner, tokenID, price, royalties, description, cid, cidV1, creator_name, status } = props.item;

  const [showModal, setShowModal] = useState(false);


  const handleSell = () => {
    const formData = new FormData();
    formData.append('id', id);
    const accessToken = localStorage.getItem('ACCESS_TOKEN');

    fetch('http://127.0.0.1:8000/api/nft/sellMyNFTs', {
      method: 'POST',
      body: formData,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
    }).then(response => response.json())
      .then((data) => {
        console.log(data);
        if (data) {
          Swal({
            title: name,
            text: "Sell NFT Success",
            icon: "success",
            dangerMode: true,
            timer: 1500,
          }).then(() => { window.location.reload(); });
        }


      })
  };



  return (
    <div className="single__nft__card">
      <div className="nft__img">
        <img src={"http://" + cidV1 + ".ipfs.localhost:8080/?filename=" + cid} alt="" className="w-100" />
        {/* <img src={"https://ipfs.io/ipfs/" + cid} alt="" className="w-100" /> */}

      </div>

      <div className="nft__content">
        <h5 className="nft__title">
          <Link to={`/market/${id}`}>{name}</Link>
        </h5>

        <div className="creator__info-wrapper d-flex gap-3">
          {/* <div className="creator__img">
            <img src={creatorImg} alt="" className="w-100" />
          </div> */}

          <div className="creator__info w-100 d-flex align-items-center justify-content-between">
            <div>
              <h6>Created By</h6>
              <p>{creator_name}</p>
            </div>

            <div>
              <h6>Current Bid</h6>
              <p>{price} ETH</p>
            </div>
          </div>
        </div>

        <div className=" mt-3 d-flex align-items-center justify-content-between">
          {/* <button
            className="bid__btn d-flex align-items-center gap-1"
            onClick={() => setShowModal(true)}
          > */}
          {/* {console.log(localStorage.getItem('UserId'))} */}
          {owner == localStorage.getItem('UserId') && status == 0 ? <button
            className="neonButton"
            onClick={handleSell}
          >
            <i class="ri-shopping-bag-line"></i> Sell
          </button> : owner == localStorage.getItem('UserId') && status == 1?<button
            className="neonButton"
            
          >
            <i class="ri-shopping-bag-line"></i> You are owner
          </button> : <button
            className="neonButton"
            onClick={() => setShowModal(true)}
          >
            <i class="ri-shopping-bag-line"></i> Buy
          </button>}


          {showModal && <Modal setShowModal={setShowModal} ethPrice={price} nftID={id} name={name} owner={owner} />}

          <span className="history__link" Style="padding-left: 5px;">
            <Link to={`/market/${id}`}>View History</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default NftCard;
