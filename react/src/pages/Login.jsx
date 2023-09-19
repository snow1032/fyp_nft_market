import { React, useRef } from "react";
import { Container, Row, Col, Label } from "reactstrap";

import LoginForm from "../components/ui/Login/LoginForm";
import Img from "../assets/images/beeple-illestrater.jpg";

export default function Login(props){
    

    return (
        <Container style={{"height":"100%"}}>
            <Row className="h-100">
                <Col xs="0" lg="6" md="6" className="m-auto">
                    <img src={Img} alt="" className="w-100"/>
                </Col>
                <Col xs="12" lg="6" md="6">
                    <LoginForm />
                </Col>
            </Row>
        </Container>
    )
}