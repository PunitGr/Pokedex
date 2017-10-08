import React, { Component } from "react";

export default class NavBar extends Component {
    render() {
        return (
            <nav className="navbar">
                <a className="navbar__logo"></a>
                <h1>Pokedex</h1>
            </nav>
        );
    }
}