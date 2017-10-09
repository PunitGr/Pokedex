// @flow
import React, { Component } from "react";

type Props = {};
type State = {};

export default class NavBar extends Component<Props, State> {
    render() {
        return (
            <nav className="navbar">
                <a className="navbar__logo"></a>
                <h1>Pokedex</h1>
            </nav>
        );
    }
}