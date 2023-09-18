import { React, useRef } from "react";
import { Container, Row, Col, Form, Label, FormGroup } from "reactstrap";
import "./login-form.css";


export default function LoginForm(props){
    const usernameRef = useRef("");
    const passwordRef = useRef("");


    return(
        <section>
            <h3 style={{"color": "white"}}><strong>Login</strong></h3>
            <br />
            <Form>
                <FormGroup row>
                    <Label for="email" style={{"color": "white"}}>
                        Email Address
                    </Label>
                    <input
                        className="form__input"
                        id="exampleEmail"
                        name="email"
                        placeholder="Enter your email address"
                        type="email"
                    />
                </FormGroup>

                <FormGroup row>
                    <Label for="email" style={{"color": "white"}}>
                        Password
                    </Label>
                    <input
                        className="form__input"
                        id="exampleEmail"
                        name="email"
                        placeholder="Enter your password"
                        type="email"
                    />
                </FormGroup>

                <button className="bid__btn">Login</button>
            </Form>
        </section>
    )


}