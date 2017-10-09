// @flow
import React, { Component } from "react";
import PokeDash from "./PokeDash";
import NavBar from "./NavBar";

type Props = {};
type State = {};

export default class App extends Component<Props, State> {
    render() {
        return (
            <div>
                <NavBar />
                <PokeDash />
            </div>
        );
    }
}