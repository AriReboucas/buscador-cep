import { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import { IMaskInput } from "react-imask";
import { FiSearch } from "react-icons/fi";
import { RiCloseFill } from "react-icons/ri";
import packageJson from "../package.json";

import api from "./services/api";

import "./styles.css";

function App() {
  const [cep, setCep] = useState({});
  const [inputData, setInputData] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMsg, setShowErrorMsg] = useState(false);

  useEffect(() => {
    if (showErrorMsg) {
      setTimeout(() => {
        hideMsg();
      }, [3000]);
    }
  }, [showErrorMsg]);

  function showError() {
    setShowErrorMsg(true);
  }

  function hideMsg() {
    setShowErrorMsg(false);
  }

  function handleKeyDown(event) {
    ReactGA.event({
      category: "Buscar CEP",
      action: "onKeyDown",
      label: inputData,
    });

    if (event.key === "Enter") {
      if (inputData.length === 9) handleSearch();
      if (inputData === "") {
        setErrorMessage("Preencha algum CEP!");
        showError();
        return;
      }
    }
  }

  async function handleSearch() {
    if (inputData === "") {
      setErrorMessage("Preencha algum CEP!");
      showError();
      return;
    }

    try {
      const response = await api.get(`${inputData}/json`);
      if (response.data.erro) {
        setErrorMessage("Ops... erro ao buscar o CEP digitado!");
        showError();
        setInputData("");
      } else {
        setCep(response.data);
        setInputData("");
      }
    } catch {
      setErrorMessage("Não foi possível realizar a busca!");
      showError();
      setInputData("");
    }
  }

  function handleClick() {
    ReactGA.event({
      category: "Buscar CEP",
      action: "onClick",
      label: inputData,
    });

    handleSearch();
  }

  function handleTyping(e) {
    if (inputData.length === 9)
      ReactGA.event({
        category: "Buscar CEP",
        action: "onTyping",
      });

    setInputData(e.target.value);
    hideMsg();
  }

  function handleClose() {
    setCep({});
  }

  return (
    <div className="container">
      <h1 className="title">Buscador CEP</h1>

      <div className="containerInput">
        <IMaskInput
          mask="00000-000"
          placeholder="Digite o CEP..."
          value={inputData}
          onChange={(e) => handleTyping(e)}
          onKeyDown={handleKeyDown}
          autoFocus
        />

        <button className="buttonSearch" onClick={handleClick}>
          <FiSearch size={25} color="#FFF" />
        </button>

        {showErrorMsg && <div className="error-message">{errorMessage}</div>}
      </div>

      {Object.keys(cep).length > 0 && (
        <main className="main">
          <button className="buttonClose" onClick={handleClose}>
            <RiCloseFill size={35} />
          </button>
          <h2>CEP: {cep.cep}</h2>
          <span>{cep.logradouro}</span>
          <span>Complemento: {cep.complemento}</span>
          <span>{cep.bairro}</span>
          <span>
            {cep.localidade} - {cep.uf}
          </span>
        </main>
      )}

      <footer>
        <p>Versão: {packageJson.version}</p>
        <p>
          Desenvolvido por:{" "}
          <a className="dev" href="https://github.com/AriReboucas">
            Ari Rebouças
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
