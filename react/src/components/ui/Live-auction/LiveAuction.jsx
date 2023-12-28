// import React from "react";
import { useState, useEffect } from 'react';
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

import NftCard from "../Nft-card/NftCard";
import { NFT__DATA } from "../../../assets/data/data.js";
import { NFT__DATA2 } from "../../../assets/data/data.js";

import "./live-auction.css";




const LiveAuction = () => {
  const [nftData, setNftData] = useState([]);
  // const nftData =  useState([]);
  const test = [];

  useEffect(() => {
    // fetch('http://127.0.0.1:8000/api/nft/getNFTs')
    //   .then((res) => res.json())
    //   .then((data) => {

    //     setNftData(...nftData, data)

    //   });

   NFT__DATA2.then((data) => { setNftData(...nftData, data) });
    // nftData.map((item) => {
    //   console.log(item);
    // })
  }, []);


  return (
    <section>
      <Container>
        {/* <img src={"https://skywalker.infura-ipfs.io/ipfs/QmaPqjJw7PAcUKDXap5vQR73Fn3ueSLTJYF6xVhiDSjfbv"} alt="" className="w-100" /> */}
        <Row>
          <Col lg="12" className="mb-5">
            <div className="live__auction__top d-flex align-items-center justify-content-between ">
              <h3>Live Auction</h3>
              <span>
                {/* <Link to="/market">Explore more</Link> */}
                <Link to="#">Explore more</Link>
              </span>
            </div>
          </Col>

          {/* {NFT__DATA.slice(0, 4).map((item) => (
            <Col lg="3" md="4" sm="6" className="mb-4">
                 {console.log(item)}
              <NftCard key={item.id} item={item} />
            </Col>
          ))} */}

          {nftData.slice(0, 4).map((item) => (
            <Col lg="3" md="4" sm="6" className="mb-4">
              <NftCard key={item.id} item={item} />


            </Col>
          ))}
          {/* {NFT__DATA2.then.s} */}
     
        </Row>
      </Container>
    </section>
  );
};

export default LiveAuction;
