import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap/dist/js/bootstrap.min.js'
import "./Navbar.css"

export default function Navbar() {
    return (
        <div>
            <div className="container">
                <div className="row justify-content-evenly">
                    <div className="col-auto">
                        <a href="/">
                            <h2 className="comfortaa heading">dForm</h2>
                        </a>
                    </div>
                    <div className="col-auto">
                        <a href="/register">Register</a>
                        <a href="/register">Login</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
