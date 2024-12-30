// src/components/CriarPagina.js
import React, { useState } from 'react';
import axios from 'axios';

function CriarPagina() {
    const [nomeCasal, setNomeCasal] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [horarioInicio, setHorarioInicio] = useState('');
    const [email, setEmail] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [linkMusica, setLinkMusica] = useState('');
    const [imagens, setImagens] = useState([]);

    const handleCreatePage = async (e) => {
        e.preventDefault();

        // Lógica para enviar os dados para o servidor
        // Ex: const response = await axios.post('/api/aniversario', { ... });

        console.log("Dados enviados: ", { nomeCasal, dataInicio, horarioInicio, email, mensagem, linkMusica });
    };

    return (
        <form onSubmit={handleCreatePage}>
            <input type="text" placeholder="Nome do Casal" value={nomeCasal} onChange={e => setNomeCasal(e.target.value)} />
            <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} required />
            <input type="time" value={horarioInicio} onChange={e => setHorarioInicio(e.target.value)} />
            <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
            <textarea placeholder="Mensagem" value={mensagem} onChange={e => setMensagem(e.target.value)} required />
            <input type="url" placeholder="Link da Música do YouTube" value={linkMusica} onChange={e => setLinkMusica(e.target.value)} required />
            <input type="file" onChange={(e) => setImagens([...imagens, e.target.files[0]])} multiple />
            <button type="submit">Criar Página</button>
        </form>
    );
}

export default CriarPagina;