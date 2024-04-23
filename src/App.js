import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IMaskInput } from "react-imask";
import { toast } from "react-toastify";
import "./styles.css";
import api from "./services/api";

function App() {
  const [input, setInput] = useState("");
  const [cep, setCep] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      handleSearch();
    }
  }

  useEffect(() => {
    if (showError) {
      setTimeout(() => {
        setShowError(false);
      }, [5000]);
    }
  }, [showError]);

  async function handleSearch() {
    if (input === "") {
      setErrorMessage("Preencha algum CEP!");
      setShowError(true);
      return;
    }

    const response = await api.get(`${input}/json`);
    if (response.data.erro) {
      setErrorMessage("Ops... erro ao buscar o CEP digitado!");
      setShowError(true);
      setInput("");
    } else {
      setCep(response.data);
      setInput("");
    }
  }

  return (
    <div className="container">
      <h1 className="title">Buscador CEP</h1>

      <div className="containerInput">
        <IMaskInput
          mask="00000-000"
          placeholder="Digite o CEP..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          autoFocus
        />

        <button className="buttonSearch" onClick={handleSearch}>
          <FiSearch size={25} color="#FFF" />
        </button>

        {showError && <div className="error-message">{errorMessage}</div>}
      </div>

      {Object.keys(cep).length > 0 && (
        <main className="main">
          <h2>CEP: {cep.cep}</h2>
          <span>{cep.logradouro}</span>
          <span>Complemento: {cep.complemento}</span>
          <span>{cep.bairro}</span>
          <span>
            {cep.localidade} - {cep.uf}
          </span>
        </main>
      )}
    </div>
  );
}

export default App;
