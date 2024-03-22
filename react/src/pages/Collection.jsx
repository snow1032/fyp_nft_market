import { useState, useEffect } from 'react';

import CommonSection from "../components/ui/Common-section/CommonSection";

import NftCard from "../components/ui/Nft-card/NftCard";

import { NFT__DATA } from "../assets/data/data";
import { NFT__DATA2 } from "../assets/data/data";

import { Container, Row, Col } from "reactstrap";

import "../styles/market.css";

const Collection = () => {
    const [data, setData] = useState(NFT__DATA);

    const [nftData, setNftData] = useState([]);
    ;

    const handleCategory = () => { };

    const handleItems = () => { };

    // ====== SORTING DATA BY HIGH, MID, LOW RATE =========
    const handleSort = (e) => {
        const filterValue = e.target.value;

        if (filterValue === "high") {
            const filterData = NFT__DATA.filter((item) => item.currentBid >= 6);

            setData(filterData);
        }

        if (filterValue === "mid") {
            const filterData = NFT__DATA.filter(
                (item) => item.currentBid >= 5.5 && item.currentBid < 6
            );

            setData(filterData);
        }

        if (filterValue === "low") {
            const filterData = NFT__DATA.filter(
                (item) => item.currentBid >= 4.89 && item.currentBid < 5.5
            );

            setData(filterData);
        }


    };

    useEffect(() => {
        NFT__DATA2.then((data) => { setNftData(...nftData, data) });


    }, [])

    return (
        <>
            <CommonSection title={"MarketPlace"} />

            <section>
                <Container>
                    <Row>
                        <div>sad</div>

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
