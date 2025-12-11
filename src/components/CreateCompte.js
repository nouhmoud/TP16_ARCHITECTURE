import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_COMPTE } from '../graphql/mutations';
import { GET_ALL_COMPTES } from '../graphql/queries'; // Requis pour la mise à jour du cache

const CreateCompte = () => {
  const [solde, setSolde] = useState('');
  const [type, setType] = useState('COURANT');
  const [message, setMessage] = useState('');

  // 1. Définition de la mutation
  const [saveCompte, { loading }] = useMutation(SAVE_COMPTE, {
    // 2. Mise à jour du cache après une mutation réussie
    refetchQueries: [
      { query: GET_ALL_COMPTES }, // Re-exécute cette requête pour mettre à jour CompteList
      'GetAllComptes' // Nom de l'opération
    ],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (parseFloat(solde) < 0) {
        setMessage('Le solde initial ne peut pas être négatif.');
        return;
    }

    try {
      const { data } = await saveCompte({
        variables: {
          compte: {
            solde: parseFloat(solde),
            type,
          },
        },
      });
      // Succès
      setMessage(`Compte ${data.saveCompte.id} créé avec succès !`);
      setSolde('');
      setType('COURANT');
    } catch (error) {
      console.error('Erreur lors de la création du compte :', error);
      setMessage(`Erreur : ${error.message}`);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Créer un Compte</h2>
      
      {message && (
        <p className={`p-2 mb-4 rounded ${message.includes('Erreur') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Solde Initial (€) :</label>
          <input
            type="number"
            value={solde}
            onChange={(e) => setSolde(e.target.value)}
            required
            min="0"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Entrez le solde initial"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type de Compte :</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="COURANT">Compte Courant</option>
            <option value="EPARGNE">Compte Épargne</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          disabled={loading || !solde}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white font-medium ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
        >
          {loading ? 'Création en cours...' : 'Créer le compte'}
        </button>
      </form>
    </div>
  );
};

export default CreateCompte;