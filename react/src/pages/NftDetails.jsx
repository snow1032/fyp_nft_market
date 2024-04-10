import { useState, useEffect } from 'react';

import CommonSection from "../components/ui/Common-section/CommonSection";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { NFT__DATA } from "../assets/data/data";
import { NFT__GetAllNFTs } from "../assets/data/data";

import LiveAuction from "../components/ui/Live-auction/LiveAuction";

import "../styles/nft-details.css";

import { Link } from "react-router-dom";

const NftDetails = () => {
  const { id } = useParams();
  const [nftData, setNftData] = useState([]);
  const [singleNft, setSingleNft] = useState([]);

  // const singleNft = useState(NFT__DATA2.then((data) => { data.map((item) => { if (item.id == id) { return data; } }) }));
  // const {  name, url, creator, owner, tokenID, price, royalties, description, cid ,cidV1} = useState(NFT__DATA2.then((data) => { data.map((item) => { if (item.id == id) { return data; } }) }));




  useEffect(() => {
    NFT__GetAllNFTs.then((data) => {
      data.map((item) => {
        if (item.id == id) {
          setSingleNft(item);
     
        }

      })

      console.log(singleNft);
    }, [])
  });


  return (
    <>

      <CommonSection title={singleNft.name} />

      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="6">
              <img
                src={"http://"+singleNft.cidV1+".ipfs.localhost:8080/?filename=" + singleNft.cid}
                alt=""
                className="w-100 single__nft-img"
              />
            </Col>

            <Col lg="6" md="6" sm="6">
              <div className="single__nft__content">
                <h2>{singleNft.title}</h2>

                <div className=" d-flex align-items-center justify-content-between mt-4 mb-4">
                  <div className=" d-flex align-items-center gap-4 single__nft-seen">
                    <span>
                      <i class="ri-eye-line"></i> 234
                    </span>
                    <span>
                      <i class="ri-heart-line"></i> 123
                    </span>
                  </div>

                  <div className=" d-flex align-items-center gap-2 single__nft-more">
                    <span>
                      <i class="ri-send-plane-line"></i>
                    </span>
                    <span>
                      <i class="ri-more-2-line"></i>
                    </span>
                  </div>
                </div>

                <div className="nft__creator d-flex gap-3 align-items-center">
                  <div className="creator__img">
                    <img src={singleNft.creatorImg} alt="" className="w-100" />
                  </div>

                  <div className="creator__detail">
                    <p>Created By</p>
                    {/* <h6>  <Link to={`/market/${singleNft.creator}`}>{singleNft.creator}</Link></h6> */}
                    <Link to={`/creatorCollection/${singleNft.creator}`}>{singleNft.creator_name}</Link>
                    <br/>
                    <p>Token ID: {singleNft.tokenID}</p>
                  </div>
                </div>

                <p className="my-4">{singleNft.description}</p>
                <button className="singleNft-btn d-flex align-items-center gap-2 w-100">
                  <i class="ri-shopping-bag-line"></i>
                  <Link to="/wallet">Place a Bid</Link>
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>  

      <LiveAuction />
    </>
  );
};

export default NftDetails;
