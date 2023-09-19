import { React, useRef } from "react";
import { Container, Row, Col, Form, Label, FormGroup } from "reactstrap";
import "./login-form.css";
import axiosClient from "../../../axios-client";
import { useStateContext } from "../../Context/ContextProvider";

export default function LoginForm(props){
    const {setUser, setToken} = useStateContext()
    const emailRef = useRef("");
    const passwordRef = useRef("");

    const handleSubmit = (event) =>{
        event.preventDefault()

        const data = new FormData(event.currentTarget);
        axiosClient.post('/login', {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        }).then(({data}) => {
            setUser(data.user)
            setToken(data.token)
        }).catch((error) => {
            if (error.response) {
                alert(error.response.data.message);
              }
        })
    }

    return(
        <section>
            <h3 style={{"color": "white"}}><strong>Login</strong></h3>
            <br />
            <Form onSubmit={handleSubmit}>
                <FormGroup row>
                    <Label for="email" style={{"color": "white"}}>
                        Email Address
                    </Label>
                    <input
                        className="form__input"
                        id="email"
                        name="email"
                        placeholder="Enter your email address"
                        type="email"
                        ref={emailRef}
                    />
                </FormGroup>

                <FormGroup row>
                    <Label for="email" style={{"color": "white"}}>
                        Password
                    </Label>
                    <input
                        className="form__input"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        type="password"
                        ref={passwordRef}
                    />
                </FormGroup>

                <button className="bid__btn">Login</button>
            </Form>
        </section>
    )


}