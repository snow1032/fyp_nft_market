import { useState, useRef, useContext, } from 'react';

import { Container, Row, Col } from "reactstrap";
import CommonSection from "../components/ui/Common-section/CommonSection";
import NftCard from "../components/ui/Nft-card/NftCard";
import img from "../assets/images/img-01.jpg";
import avatar from "../assets/images/ava-01.png";

import "../styles/create-item.css";
import { useStateContext } from "../components/Context/ContextProvider";
import Swal from "sweetalert";
// import Swal from 'sweetalert2/dist/sweetalert2.js'
// import 'sweetalert2/src/sweetalert2.scss'
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { CID } from "multiformats";


const item = {
  id: "01",
  title: "Guard",
  desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam adipisci cupiditate officia, nostrum et deleniti vero corrupti facilis minima laborum nesciunt nulla error natus saepe illum quasi ratione suscipit tempore dolores. Recusandae, similique modi voluptates dolore repellat eum earum sint.",
  imgUrl: img,
  creator: "Trista Francis",
  creatorImg: avatar,
  currentBid: 7.89,
};



const Create = () => {
  // const Swal = require('sweetalert2')
  // const userTokenData = JSON.parse(localStorage.getItem('ACCESS_TOKEN'))
  const nftData = useState([]);

  const imageFile = useRef(null);
  const price = useRef(null);
  const minimumBid = useRef(null);
  const title = useRef(null);
  const description = useRef(null);
  const cid = useRef(null);


  // change data to left card
  const changeImage = useRef(null);
  const changeTitle = useRef(null);
  const changePrice = useRef(null);
  const changeDescription = useRef(null);

  const handleSubmit = async (e) => {

    e.preventDefault();

    const file = imageFile.current.files[0];
    // console.log(file)

    const imgformData = new FormData();
    imgformData.append('file', file);

    const formData = new FormData();
    formData.append('name', title.current.value);
    formData.append('royalties', 0.5);
    formData.append('price', price.current.value);
    formData.append('media', file);
    formData.append('description', description.current.value);

    fetch('http://127.0.0.1:8000/api/ipfs/upload', {
      method: 'POST',
      body: imgformData,
      headers: {
        accept: 'application/json',
        // Authorization: `Bearer ${accessToken}`
      },
    }).then(response => response.json())
      .then((data) => {
        console.log(data);
        const accessToken = localStorage.getItem('ACCESS_TOKEN');
        const v0 = CID.parse(data.cid)
        // console.log(v0.toV1().toString())

        formData.append('cid', data.cid);
        formData.append('cidV1', v0.toV1().toString());
        if (!accessToken) {
          console.error('Access token is missing');
          // Handle the missing access token scenario, e.g., redirect to login or show an error message
        } else {
          fetch('http://127.0.0.1:8000/api/nft/mintNFTs', {
            method: 'POST',
            body: formData,
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${accessToken}`
            },
          })
            .then(response => response.json())
            .then(data => {
              console.log('Upload response:', data);
              if (data === 1) {
                Swal({
                  title: title.current.value,
                  text: "Create NFT Success",
                  icon: "success",
                  dangerMode: true,
                  timer: 1500,
                }).then(() => { window.location.reload(); });
              } else {
                Swal({
                  title: "NFT name can not duplicate",
                  text: "You clicked the button!",
                  icon: "error",

                })
                // .then(() => { window.location.reload(); });

              }
              // Handle the response data as needed
            })
            .catch(error => {
              console.error('Error uploading file:', error);
              // Handle the error as needed
            });
        }

      })
      .catch(error => console.error('Error uploading file:', error));


  };



  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    const getBase64 = file => {
      return new Promise(resolve => {
        let fileInfo;
        let baseURL = "";
        // Make new FileReader
        let reader = new FileReader();

        // Convert the file to base64 text
        reader.readAsDataURL(file);

        // on reader load somthing...
        reader.onload = () => {
          // Make a fileInfo Object
          // console.log("Called", reader);
          baseURL = reader.result;
          // console.log(baseURL);
          resolve(baseURL);
        };
        // console.log(fileInfo);
      });
    };
    getBase64(file).then(result => {
      changeImage.current.src = result;
    });



    console.log(changeImage);
  }

  const handleChangeTitle = (e) => {
    changeTitle.current.innerHTML = title.current.value;
  }

  const handleChangePrice = (e) => {
    changePrice.current.innerHTML = price.current.value;
  }




  return (
    <>
      <CommonSection title="Create NFT" />

      <section>
        <Container>
          <Row>
            <Col lg="3" md="4" sm="6">
              <h5 className="mb-4 text-light">Preview Item</h5>
              {/* <NftCard item={item} /> */}
              {/* test */}
              <div className="single__nft__card">
                <div className="nft__img">
                  <img ref={changeImage} src={img} alt="" className="w-100" />
                </div>

                <div className="nft__content">
                  <h5 className="nft__title">
                    <Link ref={changeTitle}></Link>
                  </h5>

                  <div className="creator__info-wrapper d-flex gap-3">


                    <div className="creator__info w-100 d-flex align-items-center justify-content-between">
                      <div>
                        <h6>Created By</h6>
                        <p>{localStorage.getItem('UserName')}</p>
                      </div>

                      <div>
                        <h6>Current Bid</h6>
                        <p ref={changePrice}> ETH</p>
                      </div>
                    </div>
                  </div>

                </div>
                {/* </div> */}
              </div>
              {/* test */}


            </Col>

            <Col lg="9" md="8" sm="6">
              <div className="create__item">
                <form>
                  <div className="form__input">
                    <label htmlFor="">Upload File</label>
                    <input ref={imageFile} type="file" className="upload__input" onChange={handleChangeImage} />
                  </div>

                  <div className="form__input">
                    <label htmlFor="">Price</label>
                    <input
                      ref={price}
                      type="number"
                      placeholder="Enter price for one item (ETH)"
                      onChange={handleChangePrice}
                    />
                  </div>

                  {/* <div className="form__input">
                    <label htmlFor="">Minimum Bid</label>
                    <input ref={minimumBid} type="number" placeholder="Enter minimum bid" />
                  </div> */}

                  {/* <div className=" d-flex align-items-center gap-4">
                    <div className="form__input w-50">
                      <label htmlFor="">Starting Date</label>
                      <input type="date" />
                    </div>

                    <div className="form__input w-50">
                      <label htmlFor="">Expiration Date</label>
                      <input type="date" />
                    </div>
                  </div> */}

                  <div className="form__input">
                    <label htmlFor="">Title</label>
                    <input ref={title} type="text" placeholder="Enter title" onChange={handleChangeTitle} />
                  </div>

                  <div className="form__input">
                    <label htmlFor="">Description</label>
                    <textarea
                      ref={description}
                      name=""
                      id=""
                      rows="7"
                      placeholder="Enter description"
                      className="w-100"
                    ></textarea>
                  </div>
                </form>
              </div>
            </Col>
          </Row>
          {/* <button onClick={handleSubmit} type="submit">Upload</button> */}
          <button
            className="neonButton"
            onClick={handleSubmit}
          >
            {/* <i class="ri-shopping-bag-line"></i>  */}
            Create
          </button>

        </Container>
      </section >
    </>
  );
};

export default Create;