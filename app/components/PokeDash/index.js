// @flow
import React, { Component } from "react";
import axios from "axios";
import Select from "react-select";

import PokeCard from "../PokeCard";
import { pokemonType } from "../../constants";

type Props = {};
type State = {
    next: ?string,
    previous: ?string,
    results: ?Object,
    search: ?string,
    typeFilter: ?Object,
    initialResults: ?Object,
    layout: ?string,
    screenWidth: ?number
};

export default class PokeDash extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            next: null,
            previous: null,
            results: null,
            search: "",
            typeFilter: { value: "", label: "" },
            initialResults: null,
            layout: "grid",
            screenWidth: window.innerWidth
        };
    }

    state: State;

    componentWillMount() {
        axios.get("https://pokeapi.co/api/v2/pokemon/")
            .then((response) => {
                this.setState({
                    next: response.data.next,
                    previous: response.data.previous,
                    results: response.data.results,
                    initialResults: response.data.results
                });
            })
            .catch(() => {});
    }

    componentDidMount() {
        window.addEventListener("resize", () => {
            this.setState({
                screenWidth: window.innerWidth
            });
        });
    }


    paginate = (url: string) => {
        if (url) {
            axios.get(url)
                .then((response) => {
                    this.setState({
                        next: response.data.next,
                        previous: response.data.previous,
                        results: response.data.results,
                        initialResults: response.data.results
                    });
                })
                .catch(() => {});
        }
    }

    handleSearch = (e: Event) => {
        if (e.target instanceof HTMLInputElement) {
            const { name, value } = e.target;
            this.setState({
                [name]: value
            });
        }
    }

    selectChange = (val: {value: ?string, label: ?string}) => {
        if (val) {
            this.setState({
                typeFilter: val
            });

            axios.get(val.value)
                .then((response) => {
                    const newPokemonData = response.data.pokemon.map(pokemon => pokemon.pokemon);
                    this.setState({
                        next: null,
                        previous: null,
                        results: newPokemonData
                    });
                })
                .catch(() => {});
        } else {
            this.setState({
                typeFilter: { value: "", label: "" },
                results: this.state.initialResults
            });
        }
    }

    handleLayout = (val: string) => {
        this.setState({
            layout: val
        });
    }

    renderPokemon = () => {
        const { results, search, screenWidth } = this.state;
        const layout = screenWidth && screenWidth > 767 ? this.state.layout : "grid";
        if (Array.isArray(results)) {
            return results.map(pokemon => (
                <PokeCard
                    url={pokemon.url}
                    name={pokemon.name}
                    layout={layout}
                    key={pokemon.name}
                    screenWidth={screenWidth}
                    show={search ? (search && pokemon.name.toLowerCase().search(search.toLowerCase()) !== -1) : true}
                />
            ));
        }
        return null;
    }

    render() {
        const {
            results, next, previous, screenWidth
        } = this.state;
        if (results) {
            let previousElement;
            let nextElement;
            let changeLayoutElement;

            if (previous) {
                previousElement = (
                    <button className="solid-btn" onClick={() => this.paginate(previous)}>
                        Previous
                    </button>
                );
            }

            if (next) {
                nextElement = (
                    <button className="solid-btn" onClick={() => this.paginate(next)}>
                        Next
                    </button>
                );
            }

            if (screenWidth && screenWidth > 767) {
                changeLayoutElement = (
                    <div className="solid-btn solid-btn--ghost">
                        <button className="ghost-btn" onClick={() => this.handleLayout("list")}>
                            <i className="fa fa-list-ul" aria-hidden="true" /> List
                        </button>

                        <button className="ghost-btn" onClick={() => this.handleLayout("grid")}>
                            <i className="fa fa fa-th" aria-hidden="true" /> Grid
                        </button>
                    </div>
                );
            }

            return (
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
