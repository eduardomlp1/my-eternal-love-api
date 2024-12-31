import React, { useState } from 'react';
import axios from 'axios';
import './CriarPagina.css';

// Componente principal
const CriarPagina = () => {
    const initialFormData = {
        nomeCasal: '',
        dataInicio: '',
        horarioInicio: '',
        email: '',
        mensagem: '',
        linkMusica: '',
        imagens: [],
    };

    const initialFaqData = [
        {
            question: "O que é a plataforma Meu Eterno Amor e como funciona?",
            answer: "O Meu Eterno Amor é uma plataforma inovadora que permite criar páginas personalizadas...",
            isOpen: false,
        },
        {
            question: "Como posso criar e personalizar uma página?",
            answer: "Para criar sua página, basta preencher o formulário com o nome, mensagem, e fotos...",
            isOpen: false,
        },
        {
            question: "Quais recursos estão disponíveis na página personalizada?",
            answer: "Sua página inclui um contador regressivo, apresentação de slides com fotos, confetes animados...",
            isOpen: false,
        },
        {
            question: "Quais são os planos disponíveis e por quanto tempo a página permanece ativa?",
            answer: "1. Plano Básico: R$12,90/ano; 2. Plano Intermediário: R$18,90/ano; 3. Vitalício: R$29,90.",
            isOpen: false,
        },
        {
            question: "Qual é o processo de entrega da página personalizada após o pagamento?",
            answer: "Após a confirmação do pagamento, você receberá o link e um QR Code para compartilhar...",
            isOpen: false,
        },
    ];

    const [formData, setFormData] = useState(initialFormData);
    const [faqData, setFaqData] = useState(initialFaqData);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            imagens: [...prev.imagens, ...files],
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreatePage = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusMessage('');

        const { imagens, ...data } = formData;
        const formDataObj = createFormData(data, imagens);

        try {
            const response = await axios.post('http://localhost:5000/api/aniversario', formDataObj, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setStatusMessage(`Página criada com sucesso: ${response.data.message}`);
        } catch (error) {
            setStatusMessage(`Erro ao criar a página: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const createFormData = (data, imagens) => {
        const formDataObj = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formDataObj.append(key, value);
        });
        imagens.forEach(imagem => {
            formDataObj.append('imagens', imagem);
        });
        return formDataObj;
    };

    return (
        <div className="full-screen-form">
            {renderForm(handleCreatePage, formData, handleChange, handleImageUpload, loading, statusMessage)}
            <FAQ faqData={faqData} setFaqData={setFaqData} />
        </div>
    );
};

const renderForm = (handleCreatePage, formData, handleChange, handleImageUpload, loading, statusMessage) => (
    <form onSubmit={handleCreatePage} className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-center text-2xl font-bold text-gray-800 mb-4">Criar Memórias Eternas</h1>
        {renderInputs(formData, handleChange, handleImageUpload)}
        <button
            type="submit"
            className={`w-full py-2 mt-4 ${loading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md`}
            disabled={loading}
        >
            {loading ? 'Criando...' : 'Criar Página'}
        </button>
        {statusMessage && <p className="mt-4 text-center text-gray-700">{statusMessage}</p>}
    </form>
);

const renderInputs = (formData, handleChange, handleImageUpload) => (
    <>
        <InputField name="nomeCasal" placeholder="Nome do Casal" value={formData.nomeCasal} onChange={handleChange} required />
        <InputField type="date" name="dataInicio" value={formData.dataInicio} onChange={handleChange} required />
        <InputField type="time" name="horarioInicio" value={formData.horarioInicio} onChange={handleChange} />
        <InputField type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required />
        <TextareaField name="mensagem" placeholder="Mensagem" value={formData.mensagem} onChange={handleChange} required />
        <InputField type="url" name="linkMusica" placeholder="Link da Música do YouTube" value={formData.linkMusica} onChange={handleChange} required />
        <input
            type="file"
            onChange={handleImageUpload}
            multiple
            accept="image/*"
            className="border border-gray-300 rounded-md p-2 w-full mb-4"
            aria-label="Upload de imagens"
        />
    </>
);

// Componente FAQ (pai)
const FAQ = ({ faqData, setFaqData }) => {
    const toggleFAQ = (index) => {
        setFaqData(prev => {
            const updatedFaqs = [...prev];
            updatedFaqs[index].isOpen = !updatedFaqs[index].isOpen;
            return updatedFaqs;
        });
    };

    return (
        <div className="FAQ w-full mt-8 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-gray-800">Perguntas Frequentes</h2>
            <div className="faq-list divide-y">
                {faqData.map((item, index) => (
                    <FAQItem key={index} item={item} toggleFAQ={() => toggleFAQ(index)} />
                ))}
            </div>
        </div>
    );
};

// Componente FAQItem (filho)
const FAQItem = ({ item, toggleFAQ }) => (
    <div className="faq-item py-4">
        <button
            className="faq-question w-full text-left flex justify-between items-center bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition-all"
            onClick={toggleFAQ}
            aria-expanded={item.isOpen}
        >
            <span className="font-bold text-gray-800">{item.question}</span>
            <span className={`faq-icon transform transition-transform duration-300 ${item.isOpen ? 'rotate-180' : ''}`}>
                <i className="fas fa-chevron-down"></i>
            </span>
        </button>
        {item.isOpen && (
            <div className="faq-answer mt-2 text-gray-700">
                {item.answer}
            </div>
        )}
    </div>
);

const InputField = ({ type = 'text', name, placeholder, value, onChange, required }) => (
    <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="border border-gray-300 rounded-md p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
);

const TextareaField = ({ name, placeholder, value, onChange, required }) => (
    <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="border border-gray-300 rounded-md p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
);

export default CriarPagina;