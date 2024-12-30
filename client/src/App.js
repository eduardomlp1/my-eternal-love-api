import React from 'react';
import './App.css';
import CriarPagina from './components/CriarPagina'; // Importando o componente

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Bem-vindo (a) ao Meu Eterno Amor!</h1>
        <CriarPagina /> {/* Aqui adicionamos o componente de criação de página */}
      </header>
    </div>
  );
}

export default App;