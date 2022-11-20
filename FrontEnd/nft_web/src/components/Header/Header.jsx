import React, { useRef, useEffect, useState } from "react";
import "./header.css";
import { Container } from "reactstrap";
import { NavLink, Link } from "react-router-dom";
import { connectWallet, loadWeb3} from '../../depositNFT'
import { useGlobalState, getGlobalState, setGlobalState } from '../../store'
import { MdNotificationsNone } from 'react-icons/md';
import axios from 'axios';
import "react-notifications-component/dist/theme.css";
import { ReactNotifications, Store } from "react-notifications-component";
import { useQuery } from "@apollo/client";
import { getLoans } from "../../graphql-client/queries";

const ADMIN = [
  {
    display: "Home",
    url: "/home",
  },
  {
    display: "Token",
    url: "/token",
  },
  {
    display: "Loan",
    url: "/loan",
  },
  {
    display: "Market",
    url: "/market",
  },
];

const USER = [
  {
    display: "Home",
    url: "/home",
  },
  {
    display: "Token",
    url: "/token",
  },
  {
    display: "Market",
    url: "/market",
  },
];
const Header = () => {
  loadWeb3();
  const [connectedAccount] = useGlobalState("connectedAccount");
  console.log(connectedAccount );
  if(connectedAccount == "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"){ setGlobalState("isAdmin", true);}
  else{ setGlobalState("isAdmin", false);}
  const isAdmin = getGlobalState("isAdmin");

  const [loans, setLoans] = useState([]);
  const [showInfo, setShowInfo] = useState(false);

  let NAV__LINKS = USER
  if(isAdmin) {
    NAV__LINKS = ADMIN;
  }
  //console.log(`account: ${connectedAccount}`);
  const headerRef = useRef(null);

  const menuRef = useRef(null);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("header__shrink", null);
      } else {
        headerRef.current.classList.remove("header__shrink", null);
      }
    });

    return () => {
      window.removeEventListener("scroll", null);
    };
  }, [isAdmin]);

  const toggleMenu = () => menuRef.current.classList.toggle("active__menu");

  const getNoti = (borrower)=>{
    console.log({borrower});
    axios.get(`http://localhost:4000/loans/notify/${borrower}`)
    .then(({data}) => {
      setLoans(data);
      console.log({data});
      if(data.length > 0){
        data.map((item) => {
          console.log(item.loanId);
          Store.addNotification({
            title: "Payoff",
            message: `You have a loan that is due to expire on ${new Date(item.dueDate * 1000).toLocaleString()}`,
            type: "info",
            insert: "top",
            container: "center",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true,
            }
          });
        })
      }
 
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const getInfo = async() => {
    getNoti(connectedAccount.toLowerCase());
  }

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <div className="navigation">
          <div className="logo">
            <h2 className=" d-flex gap-2 align-items-center ">
              <span>
                <i className="ri-fire-fill"></i>
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
                    {item.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="nav__right d-flex align-items-center gap-5 ">
          
          {!connectedAccount ? (
            <button
              className="btn d-flex gap-2 align-items-center"
               onClick={connectWallet}
            >
              <span>
                <i className="ri-wallet-line"></i>
              </span>
              <Link to="/">Connect Wallet</Link>
            </button>
            ) : (
              <>
              <button
              className="btn d-flex gap-2 align-items-center"
        
            >
              <span>
                <i className="ri-wallet-line"></i>
              </span>
              <Link to="/token">{connectedAccount.slice(0,10)}...</Link>
            </button>
              </>
            )}
            <span className="mobile__menu">
              <i className="ri-menu-line" onClick={toggleMenu}></i>
            </span>
            <MdNotificationsNone className="image" 
            onClick={getInfo}
            />
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
