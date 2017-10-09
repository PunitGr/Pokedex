// @flow
import React, { Component } from "react";
import axios from "axios";

import {colorType} from "../../constants";

type Props = {
    url: ?string,
    show: boolean,
    layout: ?string,
    screenWidth: ?number
};
type State = {
    pokemonData: ?Object,
    imageURL: ?string
};

export default class PokeCard extends Component<Props, State> {
    state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            pokemonData: null,
            imageURL: ""
        }
    }

    componentWillMount() {
        const { url } = this.props;
        if (url) {

            axios.get(url)
                .then(({ data }) => {
                    this.setState({
                        pokemonData: data
                    }, () => {
                        if (this.state.pokemonData) {
                            const formURL = this.state.pokemonData.forms[0].url;
                            axios.get(formURL)
                                .then(res => {
                                    this.setState({
                                        imageURL: res.data.sprites.front_default
                                    });
                                })
                                .catch( err => {
                                    console.log(err);
                                });
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    render() {
        const { pokemonData } = this.state;
        const { show, layout, screenWidth } = this.props;

        if (pokemonData && show && layout === "grid") {
            const types = pokemonData.types.map(item => item.type.name);
            return(
                <div className="pokemon-card" style={colorType[types[0]]}>
                    <h6>#{pokemonData.id}</h6>
                    <img src={this.state.imageURL} alt={pokemonData.name}/>
                    <span>{pokemonData.name}</span>
                    <p>{types.join(", ")}</p>
                </div>
            );
        } else if (pokemonData && show && layout === "list" && screenWidth && screenWidth > 767) {
            const types = pokemonData.types.map(item => item.type.name);
            const abilities = pokemonData.abilities.map(item => item.ability.name);

            return(
                <div className="pokemon-card pokemon-card--list" style={colorType[types[0]]}>
                    <img src={this.state.imageURL} alt={pokemonData.name}/>
                    <span>{pokemonData.name}</span>
                    <p>{types.join(", ")}</p>
                    <p>{abilities.join(", ")}</p>
                </div>
            );
        }

        return null;
    }
}
