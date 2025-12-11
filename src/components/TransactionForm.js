import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_TRANSACTION } from '../graphql/mutations';
import { GET_ALL_COMPTES, GET_ALL_TRANSACTIONS } from '../graphql/queries';

const TransactionForm = () => {
  const [montant, setMontant] = useState('');
  const [type, setType] = useState('DEPOT');
  const [compteId, setCompteId] = useState('');
  const [message, setMessage] = useState('');

  // Récupérer la liste des comptes pour le sélecteur
  const { data: comptesData, loading: comptesLoading } = useQuery(GET_ALL_COMPTES);

  // Définition de la mutation d'ajout de transaction
  const [addTransaction, { loading: mutationLoading }] = useMutation(ADD_TRANSACTION, {
    // Re-exécuter les requêtes pour mettre à jour les listes
    refetchQueries: [
      { query: GET_ALL_TRANSACTIONS },
      { query: GET_ALL_COMPTES },
      'GetAllTransactions',
      'GetAllComptes'
    ],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!compteId) {
      setMessage("Veuillez sélectionner un compte.");
      return;
    }
    
    if (parseFloat(montant) <= 0) {
        setMessage("Le montant doit être supérieur à zéro.");
        return;
    }

    try {
      await addTransaction({
        variables: {
          transactionRequest: {
            type,
            montant: parseFloat(montant),
            compteId,
          },
        },
      });
      // Succès
      setMessage(`Transaction (${type}) effectuée avec succès !`);
      setMontant('');
    } catch (error) {
      console.error('Erreur lors de la transaction :', error);
      // Le serveur GraphQL renvoie souvent l'erreur spécifique dans error.message
      setMessage(`Erreur : ${error.message.replace('GraphQL error: ', '')}`);
    }
  };

  const comptes = comptesData?.allComptes || [];

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Nouvelle Transaction</h2>

      {message && (
        <p className={`p-2 mb-4 rounded ${message.includes('Erreur') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type de Transaction :</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="DEPOT">Dépôt</option>
            <option value="RETRAIT">Retrait</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Compte Cible :</label>
          {comptesLoading ? (
            <p>Chargement des comptes...</p>
          ) : comptes.length === 0 ? (
            <p className="text-red-500 text-sm">Aucun compte disponible. Créez-en un d'abord.</p>
          ) : (
            <select
              value={compteId}
              onChange={(e) => setCompteId(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">-- Sélectionnez un compte --</option>
              {comptes.map((compte) => (
                <option key={compte.id} value={compte.id}>
                  {compte.type} (ID: {compte.id.substring(0, 4)}... | Solde: {compte.solde.toFixed(2)}€)
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Montant (€) :</label>
          <input
            type="number"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            required
            min="0.01"
            step="0.01"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Entrez le montant"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={mutationLoading || !montant || !compteId || comptes.length === 0}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white font-medium ${mutationLoading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
        >
          {mutationLoading ? 'Transaction en cours...' : `Effectuer ${type}`}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;