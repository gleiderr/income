import React, { useState } from "react";
//import '@material/card/dist/mdc.card.css';
//import 'bootstrap/dist/css/bootstrap.css';
//import './App.css';
import "./projeto.css";

function App() {
  const [closed, close] = useState(false);
  const display = {
    display: closed ? "none" : "block"
  };
  const styleClose = {
    position: "fixed",
    right: "10px",
    top: "10px"
  };

  return (
    <div className="">
      {/*<div  style={display}>
        <h1>Essencial Code</h1>

        <h2>Verdade</h2>
        <p>Nosso investimento maior: "Confiança".</p>
        
        <h2>Transparência</h2>
        <p>Lutamos para que nosso trabalho seja o mais transparente possível.</p>
        
        <h2>Liberdade</h2>
        <p>Nossos clientes não são reféns de nossas licenças. Nossos códigos fontes e seus dados estarão sempre à sua disposição.</p>

        <h2>Simplicidade</h2>
        <p>Basta que nossas soluções tornem seu trabalho mais fácil você gaste mais tempo brincando que trabalhando.</p>

        <button onClick={() => close(true)} style={styleClose}>
          <span role='img' aria-label='fechar'>❌</span>
        </button>
      </div>*/}
      <Projetos />
    </div>
  );
}
const projetos = [
  {
    título: "Novo Sistema de Projetos",
    subtítulo: "Amplificador de comunicação",
    resumo:
      'Não é uma ferramenta para controle prazos, custos ou alocação de recursos. É um ambiente online para disseminar a informação, medir interesse, promover "troca de ideias" e registrar de decisões importantes.',
    stars: Math.round(Math.random() * 200)
  },
  {
    título: "Controle Financeiro",
    subtítulo: "Fluxo de caixa para tomada de decisões",
    stars: Math.round(Math.random() * 200)
  },
  {
    título: "Sistema de Estoque",
    stars: Math.round(Math.random() * 200)
  },
  { título: "Sistema de Vendas", stars: Math.round(Math.random() * 200) },
  { título: "Sistema de Compras", stars: Math.round(Math.random() * 200) },
  { título: "Nota Fiscal Eletrônica", stars: Math.round(Math.random() * 200) },
  {
    título: "Formulários Personalizados",
    stars: Math.round(Math.random() * 200)
  },
  {
    título: "Acompanhamento Manutenção Carros",
    subtítulo: "Like Hermes Pardini",
    custo: "R$ 6.000 a R$ 8.000",
    patrocinado: "R$ 50",
    stars: Math.round(Math.random() * 200)
  },
  {
    título: "Sistema de Planejamento de aulas",
    stars: Math.round(Math.random() * 200)
  },
  {
    título: "Sistema de Confecção de provas",
    stars: Math.round(Math.random() * 200)
  },
  {
    título: "Sistema de Agendamento",
    subtítulo: "teste",
    resumo: "Sugestão de teste",
    stars: Math.round(Math.random() * 200)
  }
];

function Projetos() {
  return (
    <div>
      {projetos.map((p, i) => (
        <Projeto key={i}>{p}</Projeto>
      ))}
    </div>
  );
}

function Projeto(props) {
  return (
    <div className="projeto card">
      <h2 className="projeto-title card">{props.children.título}</h2>
      <h4 className="projeto-subtitle card">{props.children.subtítulo}</h4>
      <div className="projeto-resume card">{props.children.resumo}</div>
      <div className="button-row">
        <button className="button-primary">SAIBA MAIS</button>
        <button className="button-star">
          <svg
            className="star-container"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 30 30"
          >
            <defs>
              <filter id="starshadow">
                <feDropShadow
                  dx="0"
                  dy="0.6"
                  stdDeviation="0.5"
                  floodColor="#aaa"
                />
              </filter>
            </defs>
            <path className="star-box" fill="none" d="M0 0h30v30H0V0z" />
            <path
              className="star"
              d="M9 11.3l2.46 1.79c.39.29.92-.1.77-.56l-.94-2.89 2.43-1.73c.4-.28.2-.91-.29-.91h-2.98l-.97-3.02c-.15-.46-.8-.46-.95 0L7.55 7H4.57c-.49 0-.69.63-.29.91l2.43 1.73-.94 2.89c-.15.46.38.84.77.56L9 11.3z"
            />
          </svg>
          <div className="star-count">({props.children.stars})</div>
        </button>
      </div>
    </div>
  );
}

export default App;
