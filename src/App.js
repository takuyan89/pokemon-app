import "./App.css";
import React, { useEffect, useState } from "react";
import { getAllPokemon, getPokemon } from "./utils/pokemon";
import { Card } from "./components/Card/Card";
import { Navbar } from "./components/Navbar/Navbar";

function App() {
    const initalURL = "https://pokeapi.co/api/v2/pokemon";
    const [loading, setLoading] = useState(true);
    const [pokemonData, setPokemonData] = useState([]);
    const [nextUrl, setNextUrl] = useState("");
    const [prevUrl, setPrevUrl] = useState("");

    useEffect(() => {
        const fetchPokemonData = async () => {
            //全てのポケモンのデータを取得
            let res = await getAllPokemon(initalURL);
            // 各ポケモンのデータを取得
            loadPokemon(res.results);
            setNextUrl(res.next);
            setPrevUrl(res.previous);
            setLoading(false);
        };
        fetchPokemonData();
    }, []);

    const loadPokemon = async (data) => {
        let _pokeomData = await Promise.all(
            data.map((pokemon) => {
                let pokemonRecord = getPokemon(pokemon.url);
                return pokemonRecord;
            })
        );
        setPokemonData(_pokeomData);
    };

    const handleNextPage = async () => {
        setLoading(true);
        let data = await getAllPokemon(nextUrl);
        await loadPokemon(data.results);
        setNextUrl(data.next);
        setPrevUrl(data.previous);
        setLoading(false);
    };
    const handlePrevPage = async () => {
        if (!prevUrl) return;
        setLoading(true);
        let data = await getAllPokemon(prevUrl);
        await loadPokemon(data.results);
        setNextUrl(data.next);
        setPrevUrl(data.previous);
        setLoading(false);
    };

    return (
        <>
            <Navbar />
            <div className="App">
                {loading ? (
                    <h1>Loading...</h1>
                ) : (
                    <>
                        <div className="pokemonCardContainer">
                            {pokemonData.map((pokemon, i) => {
                                return <Card key={i} pokemon={pokemon} />;
                            })}
                        </div>
                        <div className="btn">
                            <button onClick={handlePrevPage}>前へ</button>
                            <button onClick={handleNextPage}>次へ </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default App;
