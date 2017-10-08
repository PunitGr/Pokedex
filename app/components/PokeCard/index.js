import React, { Component } from "react";
import axios from "axios";

import {colorType} from "../../constants";

export default class PokeCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pokemonData: null,
            imageURL: ""
        }
    }

    componentWillMount() {
        const { url } = this.props;
        axios.get(url)
            .then(({ data }) => {
                this.setState({
                    pokemonData: data
                }, () => {
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
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        const { pokemonData } = this.state;
        if (pokemonData && this.props.show && this.props.layout === "grid") {
            const types = pokemonData.types.map(item => item.type.name);
            return(
                <div className="pokemon-card" style={colorType[types[0]]}>
                    <h6>#{pokemonData.id}</h6>
                    <img src={this.state.imageURL} alt={pokemonData.name}/>
                    <span>{pokemonData.name}</span>
                    <p>{types.join(", ")}</p>
                </div>
            );
        } else if (pokemonData && this.props.show && this.props.layout === "list") {
            const types = pokemonData.types.map(item => item.type.name);
            return(
                <div className="pokemon-card pokemon-card--list" style={colorType[types[0]]}>
                    <img src={this.state.imageURL} alt={pokemonData.name}/>
                    <span>{pokemonData.name}</span>
                    <p>{types.join(", ")}</p>
                </div>
            );
        }

        return null;
    }
}
