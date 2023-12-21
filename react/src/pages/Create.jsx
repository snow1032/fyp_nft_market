import { useState, useRef, useContext, } from 'react';

import { Container, Row, Col } from "reactstrap";
import CommonSection from "../components/ui/Common-section/CommonSection";
import NftCard from "../components/ui/Nft-card/NftCard";
import img from "../assets/images/img-01.jpg";
import avatar from "../assets/images/ava-01.png";

import "../styles/create-item.css";
import { useStateContext } from "../components/Context/ContextProvider";



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

  // const userTokenData = JSON.parse(localStorage.getItem('ACCESS_TOKEN'))
  const nftData = useState([]);

  const imageFile = useRef(null);
  const price = useRef(null);
  const minimumBid = useRef(null);
  const title = useRef(null);
  const description = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const file = imageFile.current.files[0];
    const formData = new FormData();
    formData.append('name', title.current.value);
    formData.append('royalties', 0.5);
    formData.append('price', price.current.value);
    formData.append('media', file);
    formData.append('description', description.current.value);

    // console.log(formData.values());

    // nftData.push({
    //   name: title.current.value,
    //   royalties: 0.5,
    //   price: price.current.value,
    //   media: file,
    //   // tokenID: userTokenData.token,
    //   description: description.current.value,


    // });
    console.log(formData.values());
    fetch('http://127.0.0.1:8000/api/nft/mintNFTs', {
      method: 'POST',
      body: formData,
      headers: {
        accept: 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('Upload response:', data.JSON());
        // console.log(JSON.stringify(userTokenData));
        // console.log(userTokenData.user.address);


      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  };






  return (
    <>
      <CommonSection title="Create Item" />

      <section>
        <Container>
          <Row>
            <Col lg="3" md="4" sm="6">
              <h5 className="mb-4 text-light">Preview Item</h5>
              <NftCard item={item} />
            </Col>

            <Col lg="9" md="8" sm="6">
              <div className="create__item">
                <form>
                  <div className="form__input">
                    <label htmlFor="">Upload File</label>
                    <input ref={imageFile} type="file" className="upload__input" />
                  </div>

                  <div className="form__input">
                    <label htmlFor="">Price</label>
                    <input
                      ref={price}
                      type="number"
                      placeholder="Enter price for one item (ETH)"
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
                    <input ref={title} type="text" placeholder="Enter title" />
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
          <button onClick={handleSubmit} type="submit">Upload</button>
        </Container>
      </section>
    </>
  );
};

export default Create;
