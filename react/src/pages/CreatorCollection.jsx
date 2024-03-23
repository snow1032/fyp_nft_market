import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import CommonSection from "../components/ui/Common-section/CommonSection";

import CreatorNFTList from "../components/ui/Nft-card/CreatorNFTList";

import { NFT__DATA2 } from "../assets/data/data";
import { Creator_NFT__CollectionData } from "../assets/data/data";

import { Container, Row, Col } from "reactstrap";

import "../styles/market.css";

const CreatorCollection = () => {
    // const [data, setData] = useState(NFT__DATA);
    const { userId } = useParams();
    const [nftData, setNftData] = useState([]);



    useEffect(() => {
        // NFT__CollectionData.then((data) => { setNftData(...nftData, data) });
        const formData = new FormData();
        formData.append('creator', userId);
        Creator_NFT__CollectionData(formData).then((data) => {
            // setNftData(...nftData, data)
            // // console.log(data);
            const sortedData = [...data.filter(item => item.creator === item.owner), ...data.filter(item => item.creator !== item.owner)];
            setNftData(...nftData, sortedData)
            // console.log(sortedData);
        });

    }, [])

    return (
        <>
            <CommonSection title={"Creator Collection"} />

            <section>
                <Container>
                    <Row>

                        {nftData?.map((item) => (
                            <Col lg="3" md="4" sm="6" className="mb-4" key={item.id} >
                                <CreatorNFTList item={item} />
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>
        </>
    );
};

export default CreatorCollection;
