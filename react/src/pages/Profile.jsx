import { React, useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form, Label, FormGroup, Card } from "reactstrap";
// import "./login-form.css";
import "../components/ui/Login/login-form.css";

import { Link } from "react-router-dom";
import Swal from "sweetalert";
import { ethers } from "ethers";
import { getProfile } from "../assets/api/api";


const Profile = () => {
    const [userData, setUserData] = useState([]);
    const walletAddressRef = useRef(null);
    const userNameRef = useRef(null);
    const emailRef = useRef(null);

    const handleSubmit = (event) => {
        event.preventDefault()
    }


    // console.log(connectWallentAccount)



    useEffect(() => {
        getProfile().then((response) => {
            console.log("Profile response:", response);
            setUserData(response);
        });

        userNameRef.current.value = userData.name;    
        emailRef.current.value = userData.email;

    }, []);


    async function connectWallentAccount(e) {
        e.preventDefault();
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const account = await window.ethereum.request({
                method: "eth_requestAccounts",

            });
            // console.log(account);
            walletAddressRef.current.value = account[0];



        } catch (err) {
            console.log(err);

        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem('ACCESS_TOKEN');

        const formData = new FormData();
        formData.append('name', userNameRef.current.value);
        formData.append('address', walletAddressRef.current.value);
        formData.append('email', emailRef.current.value);


        fetch('http://localhost:8000/api/profile/update_profile_data', {

            method: 'POST',
            body: formData,
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
        }).then(response => response.json())
            .then(data => {
                console.log('Update profile response:', data);
                if (data.status == true) {
                    Swal({
                        title: "Update",
                        text: "Update Success",
                        icon: "success",
                        dangerMode: true,
                        timer: 1500,
                    }).then(() => {
                        window.location.reload();
                    });
                } else {
                    Swal({
                        title: "Update Failed",
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

                <h2 style={{ "color": "white", "textAlign": "center" }}><strong>Profile</strong></h2>
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
                            value={userData.name}
                            ref={userNameRef}
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
                            ref={walletAddressRef}
                            value={userData.address}
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
                            value={userData.email}
                            ref={emailRef}

                        />
                    </FormGroup>




                    <button className="bid__btn" onClick={handleUpdate}>Upade</button>
                </Form>
            </Card>
        </section>
    )

};

export default Profile;
