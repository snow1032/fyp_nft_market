import { React, useRef } from "react";
import { Container, Row, Col, Form, Label, FormGroup, Card } from "reactstrap";
import "./login-form.css";
import axiosClient from "../../../axios-client";
import { useStateContext } from "../../Context/ContextProvider";
import { ContextProvider } from "../../Context/ContextProvider";

export default function LoginForm(props) {
    const {setUser, setToken} = useStateContext()
    const emailRef = useRef("");
    const passwordRef = useRef("");



    const handleSubmit = (event) => {
        event.preventDefault()

        const data = new FormData(event.currentTarget);
        axiosClient.post('/login', {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        }).then(({ data }) => {
            console.log(data.token);
            // console.log(data);
            console.log(setToken)
            setUser(data.user)
            setToken(data.token)
            // console.log(JSON.stringify(data))
            // ContextProvider(data);
            
        }).catch((error) => {
            if (error.response) {
                alert(error.response.data.message);
            }
        }).then(()=>{
            
            axiosClient.get('/user').then((response) => {
                console.log("sssssssssssssssss");
                console.log(response);
            }).then(({ data }) => {
    
                console.log(data.token)
    
            }).catch((error) => {
                if (error.response) {
                    alert(error.response.data.message);
                }
            })
        })

        
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

                <h2 style={{ "color": "white", "textAlign": "center" }}><strong>Login</strong></h2>
                <br />
                <Form onSubmit={handleSubmit}>
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

                    <button className="bid__btn">Login</button>
                </Form>
            </Card>
        </section>
    )


}