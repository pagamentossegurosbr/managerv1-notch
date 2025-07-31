'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [message, setMessage] = useState('Carregando...');

  useEffect(() => {
    setMessage('NOTCH Gestão Financeira - Funcionando!');
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        maxWidth: '600px'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: '#111827', 
          marginBottom: '1rem' 
        }}>
          {message}
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          Dashboard completo para controle financeiro do seu negócio
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            backgroundColor: '#f3f4f6', 
            padding: '1rem', 
            borderRadius: '0.5rem' 
          }}>
            <h3 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              Receita Bruta
            </h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
              R$ 0,00
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: '#f3f4f6', 
            padding: '1rem', 
            borderRadius: '0.5rem' 
          }}>
            <h3 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              Lucro Líquido
            </h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>
              R$ 0,00
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: '#f3f4f6', 
            padding: '1rem', 
            borderRadius: '0.5rem' 
          }}>
            <h3 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              Total de Vendas
            </h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7c3aed' }}>
              0
            </p>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#f3f4f6', 
          padding: '1rem', 
          borderRadius: '0.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
            Status do Sistema
          </h2>
          <p style={{ color: '#059669', fontWeight: '500' }}>
            ✅ Aplicação funcionando corretamente
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Versão ultra-minimalista - Deploy bem-sucedido
          </p>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
          <p>NOTCH Gestão Financeira v1.0 - Desenvolvido com Next.js</p>
          <p>Deploy: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
}