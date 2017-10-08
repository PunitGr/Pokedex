// @flow
import React, { Component } from "react";
import PokeDash from "./PokeDash";
import NavBar from "./NavBar";

export default class App extends Component {
    render() {
        return (
            <div>
                <NavBar />
                <PokeDash />
            </div>
        );
    }
}