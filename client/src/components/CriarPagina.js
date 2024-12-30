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

    // Handler para adicionar múltiplas imagens
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setImagens((prevImages) => [...prevImages, ...files]);
    };

    // Função para manipular o envio do formulário
    const handleCreatePage = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão do formulário

        const formData = new FormData();
        formData.append('nomeCasal', nomeCasal);
        formData.append('dataInicio', dataInicio);
        formData.append('horarioInicio', horarioInicio);
        formData.append('email', email);
        formData.append('mensagem', mensagem);
        formData.append('linkMusica', linkMusica);
        imagens.forEach((imagem) => {
            formData.append('imagens', imagem); // Adiciona cada imagem ao FormData
        });

        try {
            const response = await axios.post('http://localhost:5000/api/aniversario', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Indica que estamos enviando dados de formulário
                },
            });
            console.log("Página criada com sucesso: ", response.data);
            // Aqui você pode adicionar um feedback ao usuário, como um alerta
        } catch (error) {
            console.error("Erro ao criar a página: ", error);
            // Você também pode adicionar um feedback de erro ao usuário
        }
    };

    return (
        <form onSubmit={handleCreatePage}>
            <input 
                type="text" 
                placeholder="Nome do Casal" 
                value={nomeCasal} 
                onChange={e => setNomeCasal(e.target.value)} 
                required 
            />
            <input 
                type="date" 
                value={dataInicio} 
                onChange={e => setDataInicio(e.target.value)} 
                required 
            />
            <input 
                type="time" 
                value={horarioInicio} 
                onChange={e => setHorarioInicio(e.target.value)} 
            />
            <input 
                type="email" 
                placeholder="E-mail" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
            />
            <textarea 
                placeholder="Mensagem" 
                value={mensagem} 
                onChange={e => setMensagem(e.target.value)} 
                required 
            />
            <input 
                type="url" 
                placeholder="Link da Música do YouTube" 
                value={linkMusica} 
                onChange={e => setLinkMusica(e.target.value)} 
                required 
            />
            <input 
                type="file" 
                onChange={handleImageUpload} 
                multiple 
                accept="image/*" // Aceita apenas imagens
            />
            <button type="submit">Criar Página</button>
        </form>
    );
}

export default CriarPagina;