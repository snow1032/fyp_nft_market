import { React, useRef } from "react";
import { Container, Row, Col, Label } from "reactstrap";

import LoginForm from "../components/ui/Login/LoginForm";
import Img from "../assets/images/beeple-illestrater.jpg";
export default function Login(props){
    

    return (
        <Container style={{"height":"100%"}}>
            <Row className="h-100">
                <Col xs="12" style={{"display": "flex", "justifyContent": "center", "alignItems": "center"}}>
                    <LoginForm />
                </Col>
            </Row>
        </Container>
    )
}