// @flow
import React, { Component } from "react";
import axios from "axios";
import PokeCard from "../PokeCard";
import Select from 'react-select';

import { pokemonType } from "../../constants";

type Props = {};
type State = {
    data: ?Array<mixed>
};

export default class PokeDash extends Component {
    state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            next: null,
            previous: null,
            results: null,
            search: "",
            typeFilter: { value: "", label: ""},
            initialResults: null,
            layout: "grid",
            screenWidth: window.innerWidth
        };
    }

    componentDidMount() {
        window.addEventListener('resize', () => {
            this.setState({
                screenWidth: window.innerWidth
            });
        });
    }

    componentWillMount() {
        axios.get(`http://pokeapi.co/api/v2/pokemon/`)
            .then( response => {
                this.setState({
                    next: response.data.next,
                    previous: response.data.previous,
                    results: response.data.results,
                    initialResults: response.data.results
                });
            })
            .catch( errors => {
                console.log(errors);
            });
    }

    renderPokemon = () => {
        const { results, search, screenWidth } = this.state;
        const layout = screenWidth > 767 ? this.state.layout : "grid"; 
        if (Array.isArray(results)) {
            return results.map(pokemon => (
                <PokeCard 
                    url={pokemon.url}
                    name={pokemon.name}
                    layout={layout}
                    key={pokemon.name} 
                    screenWidth={screenWidth}
                    show={pokemon.name.toLowerCase().search(search.toLowerCase()) !== -1 ? true : false}/>
            ));
        }
    }

    paginate = (url) => {
        axios.get(url)
            .then( response => {
                this.setState({
                    next: response.data.next,
                    previous: response.data.previous,
                    results: response.data.results,
                    initialResults: response.data.results
                });
            })
            .catch( errors => {
                console.log(errors);
            });
    }

    handleSearch = (e: Event) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    selectChange = (val: {value: ?string, label: ?string}) => {
        if (val) {
            this.setState({
                typeFilter: val
            });

            axios.get(val.value)
            .then( response => {
                const newPokemonData = response.data.pokemon.map(pokemon => pokemon.pokemon);
                this.setState({
                    next: null,
                    previous: null,
                    results: newPokemonData
                });
            })
            .catch( errors => {
                console.log(errors);
            });
        } else {
            this.setState({
                typeFilter: { value: "", label: ""},
                results: this.state.initialResults
            });
        }
    }

    handleLayout = (val: string) => {
        this.setState({
            layout: val
        });
    }

    render() {
        const { results, next, previous, screenWidth } = this.state;
        if (results) {
            let previousElement;
            let nextElement;
            let changeLayoutElement;

            if (previous) { 
                previousElement = (
                    <a className="solid-btn" onClick={() => this.paginate(previous)}>
                        Previous
                    </a>
                );
            }

            if (next) {
                nextElement = (
                    <a className="solid-btn" onClick={() => this.paginate(next)}>
                        Next
                    </a>
                );
            }

            if (screenWidth > 767) {
                changeLayoutElement = (
                    <div className="solid-btn solid-btn--ghost">
                        <a className="ghost-btn" onClick={() => this.handleLayout("list")}>
                            <i className="fa fa-list-ul" aria-hidden="true"></i> List
                        </a>

                        <a className="ghost-btn" onClick={() => this.handleLayout("grid")}>
                            <i className="fa fa fa-th" aria-hidden="true"></i> Grid
                        </a>
                    </div>
                );
            }

            return(
                <div className="pokedash-container">
                    <div className="pokedash-container__filter">
                        <input
                            type="text"
                            className="input-element"
                            name="search"
                            placeholder="Enter to search"
                            onChange={this.handleSearch}
                            />

                        <Select
                            name="typeFilter"
                            value={this.state.typeFilter}
                            options={pokemonType}
                            onChange={this.selectChange}
                        />
                        {changeLayoutElement}
                    </div>

                    <div className="pokedash-container__pokedash">
                        {this.renderPokemon()}
                    </div>

                    <div className="pokedash-container__paginate">
                        {previousElement}
                        {nextElement}
                    </div>
                </div>
            );
        }

        return null;
    }
}
