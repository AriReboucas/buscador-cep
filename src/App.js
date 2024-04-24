import "./styles.css";
import ReactGA from "react-ga4";
import api from "./services/api";
import { IMaskInput } from "react-imask";
import { FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";

function App() {
  const [cep, setCep] = useState({});
  const [input, setInput] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (showError) {
      setTimeout(() => {
        setShowError(false);
      }, [3000]);
    }
  }, [showError]);

  function handleKeyDown(event) {
    ReactGA.event({
      category: "Buscar CEP",
      action: "onKeyDown",
      label: input,
    });

    if (event.key === "Enter") {
      if (input.length === 9) handleSearch();
    }
  }

  async function handleSearch() {
    if (input === "") {
      setErrorMessage("Preencha algum CEP!");
      setShowError(true);
      return;
    }

    try {
      const response = await api.get(`${input}/json`);
      if (response.data.erro) {
        setErrorMessage("Ops... erro ao buscar o CEP digitado!");
        setShowError(true);
        setInput("");
      } else {
        setCep(response.data);
        setInput("");
      }
    } catch {
      setErrorMessage("Não foi possível realizar a busca!");
      setShowError(true);
      setInput("");
    }
  }

  function handleClick() {
    ReactGA.event({
      category: "Buscar CEP",
      action: "onClick",
      label: input, // optional
    });

    handleSearch();
  }

  function handleTyping(e) {
    if (input.length === 9)
      ReactGA.event({
        category: "Buscar CEP",
        action: "onTyping",
      });

    setInput(e.target.value);
  }

  return (
    <div className="container">
      <h1 className="title">Buscador CEP</h1>

      <div className="containerInput">
        <IMaskInput
          mask="00000-000"
          placeholder="Digite o CEP..."
          value={input}
          onChange={(e) => handleTyping(e)}
          onKeyDown={handleKeyDown}
          autoFocus
        />

        <button className="buttonSearch" onClick={handleClick}>
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
