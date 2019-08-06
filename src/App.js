import React, { useState } from 'react';
import '@material/card/dist/mdc.card.css';

function App() {
  const [closed, close]  = useState(false);
  const display = {
    display: closed ? 'none': 'block'

  };
  const styleClose = { 
    position: 'fixed', 
    right: '10px', 
    top: '10px',
  }

  return (
    <div className="mdc-typography" style={{display: 'flex', flexWrap: 'wrap'}}>
      <div  style={display}>
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
      </div>
      <Projetos />
    </div>
  );
}
const projetos = [
  { 
    nome: "Sistema de Projetos",
    valor_investido: 'R$ 300' },
  { nome: "Controle Financeiro" },
  { nome: "Sistema de Estoque" },
  { nome: "Sistema de Vendas" },
  { nome: "Sistema de Compras" },
  { nome: "Nota Fiscal Eletrônica" },
  { nome: "Formulários Personalizados" },
  { 
    nome: "Acompanhamento Manutenção Carros",
    descrição: "Like Hermes Pardini",
    custo_estimado: 'R$ 6.000 a R$ 8.000',
    valor_investido: 'R$ 50'
  },
  { nome: "Sistema de Planejamento de aulas"},
  { nome: "Sistema de Planejamento de provas"},
];
function Projetos() {
  return <div>
    {projetos.map(p => <Projeto>{p}</Projeto>)}
  </div>
}

function Projeto(props) {
  return (
    <div className="mdc-card" style={{ display: 'flex', flexWrap: 'wrap', margin: '8px', padding: '16px', width: '300px'}}>
      <h3 className=''>{props.children.nome}</h3>
    </div>
  );
}

export default App;
