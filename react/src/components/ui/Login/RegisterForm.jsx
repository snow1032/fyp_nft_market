import { React, useRef } from "react";
import { Container, Row, Col, Form, Label, FormGroup, Card } from "reactstrap";
import "./login-form.css";
import axiosClient from "../../../axios-client";
import { useStateContext } from "../../Context/ContextProvider";
import { ContextProvider } from "../../Context/ContextProvider";
import { Link } from "react-router-dom";
import Swal from "sweetalert";

export default function RegisterForm(props) {
    const { setUser, setToken } = useStateContext()
    const nameRef = useRef("");
    const addressRef = useRef("");
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const passwordConfirmationRef = useRef("");



    const handleSubmit = (event) => {
        event.preventDefault()

        const formData = new FormData();
        formData.append('name', nameRef.current.value);
        formData.append('address', addressRef.current.value);
        formData.append('email', emailRef.current.value);
        formData.append('password', passwordRef.current.value);
        formData.append('password_confirmation', passwordConfirmationRef.current.value);

        if (passwordRef.current.value != passwordConfirmationRef.current.value) {
            alert("Password and password confirmation do not match")
            return
        } else {

            fetch('http://127.0.0.1:8000/api/register', {
                method: 'POST',
                // body: JSON.stringify({ id: nftID }),
                body: formData,
                headers: {
                    accept: 'application/json',

                },
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Register response:', data);
                    if (data.status == true) {
                        Swal({
                            title: "Register",
                            text: "Register Success",
                            icon: "success",
                            dangerMode: true,
                            timer: 1500,
                        }).then(() => {
                            window.location.reload();
                        });
                    } else {
                        Swal({
                            title: "Register Failed",
                            text: "You clicked the button!",
                            icon: "error",

                        })
                            .then(() => { 
                                // window.location.reload();
                             });

                    }
                    // Handle the response data as needed
                })

        }

        
  

    }

    async function connectWallentAccount(e) {
        e.preventDefault();
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const account = await window.ethereum.request({
                method: "eth_requestAccounts",

            });
            // console.log(account);
            addressRef.current.value = account[0];



        } catch (err) {
            console.log(err);

        }
    }

    return (
        <section>
            <Card style={{ "background": "#212529", "width": "450px", "padding": "32px" }}>
                <center>
                    <div class="logo">
                        <h2>
                            <i class="ri-fire-fill"></i>
                        </h2>
                    </div>
                </center>

                <h2 style={{ "color": "white", "textAlign": "center" }}><strong>Register</strong></h2>
                <br />
                <Form onSubmit={handleSubmit}>
                    <FormGroup row>
                        <Label for="name" style={{ "color": "white" }}>
                            User name
                        </Label>
                        <input
                            className="form__input"
                            id="name"
                            name="name"
                            placeholder="Enter your name"
                            type="text"
                            ref={nameRef}
                        />
                    </FormGroup>
                    <FormGroup row>
                        <Label for="name" style={{ "color": "white" }}>
                            Address
                        </Label>
                        <input
                            className="form__input"
                            id="address"
                            name="address"
                            placeholder="Enter your wallet address"
                            type="text"
                            ref={addressRef}
                        />
                          <button
                            onClick={connectWallentAccount}>
                            Get MetaMask wallet address
                        </button>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="email" style={{ "color": "white" }}>
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
                        <Label for="email" style={{ "color": "white" }}>
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
                    <FormGroup row>
                        <Label for="email" style={{ "color": "white" }}>
                        Password Confirmation
                        </Label>
                        <input
                            className="form__input"
                            id="passwordConfirmation"
                            name="passwordConfirmation"
                            placeholder="Enter your password"
                            type="password"
                            ref={passwordConfirmationRef}
                        />
                    </FormGroup>

                    <button className="bid__btn">Register</button>
                </Form>
            </Card>
        </section>
    )


}