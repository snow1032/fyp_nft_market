import { useState, useEffect } from 'react';

import CommonSection from "../components/ui/Common-section/CommonSection";

import NftCard from "../components/ui/Nft-card/NftCard";

import { NFT__DATA2 } from "../assets/data/data";
import { NFT__CollectionData } from "../assets/data/data";

import { Container, Row, Col } from "reactstrap";

import "../styles/market.css";

const Collection = () => {
    // const [data, setData] = useState(NFT__DATA);

    const [nftData, setNftData] = useState([]);



    useEffect(() => {
        NFT__CollectionData.then((data) => { setNftData(...nftData, data) });

        // NFT__CollectionData.catch((err) => console.log(err))
        // NFT__CollectionData.then((data) => { console.log(data) });
        console.log("test",nftData);
    }, [])

    return (
        <>
            <CommonSection title={"Collection"} />

            <section>
                <Container>
                    <Row>

                        {nftData?.map((item) => (
                            <Col lg="3" md="4" sm="6" className="mb-4" key={item.id}>
                                <NftCard item={item} />
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>
        </>
    );
};

export default Collection;
