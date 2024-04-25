import { React, useRef } from "react";
import { Container, Row, Col, Label } from "reactstrap";

import RegisterForm from "../components/ui/Login/RegisterForm";
import Img from "../assets/images/beeple-illestrater.jpg";
export default function Register(props){
    

    return (
        <Container style={{"height":"100%"}}>
            <Row className="h-100">
                <Col xs="12" style={{"display": "flex", "justifyContent": "center", "alignItems": "center"}}>
                    <RegisterForm />
                </Col>
            </Row>
        </Container>
    )
}