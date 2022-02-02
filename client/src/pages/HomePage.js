import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import UserContext from '../context/UserContext'
import "./css/HomePage.css";
import "./css/Fonts.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function HomePage() {
    const { user } = useContext(UserContext);
    return (
        <>
            <div className="homePage">
                <div className="section1">
                    <div className="container pt-3">
                        <div className="row justify-content-around">
                            <div className="col-4">
                                <h4>
                                    <Link to="/" className="white">dForm</Link>
                                </h4>
                            </div>
                            <div className="col-4">
                                <h4 className="float-end">
                                    <a className="white" href="https://github.com/guptasajal411/dform/">GitHub Repo</a>
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className="container text-center main pt-3 d-flex align-items-center justify-content-center flex-column">
                        <h1 className="heading py-4 font-weight-bold white">Welcome to dForm</h1>
                        <p className="description pb-4">Having trouble making forms? We've got you covered! With dForm's user friendly UI, its easier than ever creating and managing forms.</p>
                        {user.username
                        ?
                        <Link to="/dashboard">
                            <button className="dformButton">Go to your Dashboard</button>
                        </Link>
                        :
                        <Link to="/login">
                            <button className="dformButton">Create your own form!</button>
                        </Link>}
                    </div>
                    <div className="container pt-3 text-center features">
                        <div className="row">
                            <div className="col-4 description container">
                                <div className="row">
                                    <div className="col-12 pb-3">Easy to use</div>
                                    <div className="col-12"><img alt="" className="featureImage" src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/fire_1f525.png" /></div>
                                </div>
                            </div>
                            <div className="col-4 description container">
                                <div className="row">
                                    <div className="col-12 pb-3">Open Source</div></div>
                                <div className="col-12"><img alt="" className="featureImage" src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/globe-with-meridians_1f310.png" /></div>
                            </div>
                            <div className="col-4 description container">
                                <div className="row">
                                    <div className="col-12 pb-3">Secure</div>
                                    <div className="col-12"><img alt="" className="featureImage" src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/locked_1f512.png" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
