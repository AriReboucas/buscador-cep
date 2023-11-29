import { useState } from 'react';
import { FiSearch } from "react-icons/fi";
import './styles.css';
import api from './services/api';


function App() {

  const [input, setInput] = useState('')

  async function handleSearch() {
    if (input === '') {
      alert("Preencha algum CEP!")
      return;
    }

    try {
      const response = await api.get('${input}/json');
      console.log(response)
    } catch {
      alert("Ops... erro ao buscar o CEP digitado!");
    }
  }

  return (
    <div className="container">
      <h1 className="title">Buscador CEP</h1>

      <div className="containerInput">
        <input
          type="text"
          placeholder="Digite seu CEP..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button className="buttonSearch" onClick={handleSearch}>
          <FiSearch size={25} color="#FFF" />
        </button>
      </div>

      <main className="main">
        <h2>CEP: 05835004</h2>
        <span>Estrada de Itap.</span>
        <span>Complemento</span>
        <span>Vl Prel</span>
        <span>São Paulo - SP</span>

      </main>

    </div>
  );
}

export default App;
