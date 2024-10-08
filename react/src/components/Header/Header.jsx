import React, { useRef, useEffect, useState } from "react";
import "./header.css";
import { Container } from "reactstrap";
import { NavLink, Link } from "react-router-dom";
import { ethers } from 'ethers';
import Swal from "sweetalert";
import Profile from "../../pages/Profile";



const NAV__LINKS = [
  {
    display: "Home",
    url: "/home",
  },
  {
    display: "Market",
    url: "/market",
  },
  {
    display: "Create",
    url: "/create",
  },
  {
    display: "Collection",
    url: "/Collection",
  },
  {
    display: "Contact",
    url: "/contact",
  },
  {
    display: "Login",
    url: "/login",
  },
  {
    display: "Register",
    url: "/register",
  },


];

const Header = () => {
  const headerRef = useRef(null);

  const menuRef = useRef(null);

  const [walletAddress, setWalletAddress] = useState(null)
  const [userBalance, setUserBalance] = useState(null)

  const [userName, setUserName] = useState(null)

  useEffect(() => {

    // setUserName(localStorage.getItem('ACCESS_TOKEN').user.name)
    // console.log(localStorage.getItem('ACCESS_TOKEN'))
    

    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("header__shrink");
      } else {
        headerRef.current.classList.remove("header__shrink");
      }
    });

    return () => {
      window.removeEventListener("scroll", null);
    };
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle("active__menu");


  async function connectWallentAccount(e) {
    console.log("Requesting account......")
    // console.log(window.thereum);
    if (window.ethereum) {
      console.log("detected")


      try {
        const account = await window.ethereum.request({
          method: "eth_requestAccounts",

        });

        getUserBalance(account[0]);
        setWalletAddress(account[0]);



        console.log(account);
        console.log(account[0])
      } catch (error) {
        console.log("Error connecting ..")
      }

    } else {
      console.log("Meta Mask not dectected")
    }
  }

  const getUserBalance = (address) => {
    window.ethereum.request({
      method: "eth_getBalance",
      params: [address, 'latest']
    }).then(balance => {
      setUserBalance(ethers.utils.formatEther(balance))
      // setUserBalance(ethers.formatEther(balance))

    })

  }


  const handleLogout = () => {
    const accessToken = localStorage.getItem('ACCESS_TOKEN');

    fetch('http://127.0.0.1:8000/api/logout', {
      method: 'POST',
      // body: imgformData,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
    }).then((res) => res.json())
      .then((data) => {
        console.log(data);
        Swal({
          title: localStorage.getItem('UserName'),
          text: "Logout",
          icon: "success",
          dangerMode: true,
          timer: 1500,
        }).then(() => { window.location.reload(); });
      });
    localStorage.removeItem('ACCESS_TOKEN');

  }

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <div className="navigation">
          <div className="logo">
            <h2 className=" d-flex gap-2 align-items-center ">
              <span>
                <i class="ri-fire-fill"></i>
              </span>
              NFTs
            </h2>
          </div>

          <div className="nav__menu" ref={menuRef} onClick={toggleMenu}>
            <ul className="nav__list">
              {NAV__LINKS.map((item, index) => (
                <li className="nav__item" key={index}>
                  <NavLink
                    to={item.url}
                    className={(navClass) =>
                      navClass.isActive ? "active" : ""
                    }
                  >


                    {
                      item.display == "Login" && localStorage.getItem('ACCESS_TOKEN') != null ? <div class="dropdown nav__right">
                        <button class="btn d-flex gap-2 align-items-center iconButton login__icon" Style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">{localStorage.getItem("ACCESS_TOKEN")}</button>
                        <div class="dropdown-content">
                          <a class="dropdown-item" href="#" onClick={handleLogout}> Logout </a>
                          <Link to={`/Profile`}> <a class="dropdown-item" href="#">Profile</a></Link>
                          {/* <a class="dropdown-item" href="#"> Notifications </a>
                          <a class="dropdown-item" href="#"> Setting </a> */}
                        </div>
                      </div>:item.display == "Register" && localStorage.getItem('ACCESS_TOKEN') != null ? "" : item.display
                      // item.display
                    }

                 

                    {/* {item.display} */}

                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="nav__right d-flex align-items-center gap-5 ">
            <button className="btn d-flex gap-2 align-items-center" Style="position: absolute;"
              onClick={connectWallentAccount}>
              <span>
                <i class="ri-wallet-line"></i>
              </span>
              {/* <Link to="/wallet">{walletAddress ? walletAddress : "Connect Wallets"}</Link> */}
              <Link to="/#">{walletAddress ? walletAddress : "Connect Wallets"}</Link>

            </button>

            <span className="mobile__menu">
              <i class="ri-menu-line" onClick={toggleMenu}></i>
            </span>
          </div>


        </div>



      </Container>
      <h1>ETH: {userBalance}</h1>
    </header>

  );
};

export default Header;
