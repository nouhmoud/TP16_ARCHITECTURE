import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_TRANSACTIONS } from "../graphql/queries";

const TransactionList = () => {
  const { loading, error, data } = useQuery(GET_ALL_TRANSACTIONS);
  
  if (loading) return <p className="text-center p-4">Chargement des transactions...</p>;
  if (error) return <p className="text-red-500 p-4">Erreur : {error.message}</p>;
  
  const transactions = data.allTransactions || [];

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Historique des Transactions ({transactions.length})</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-500">Aucune transaction enregistrée.</p>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="border-b border-gray-100 pb-3 last:border-b-0">
              <div className="flex justify-between items-center">
                {/* Type de transaction et montant */}
                <span className={`font-bold ${transaction.type === 'DEPOT' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'DEPOT' ? '+' : '-'} {transaction.montant.toFixed(2)}€
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(transaction.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Compte N°: <span className="font-mono text-xs text-gray-500">{transaction.compte.id}</span>
              </p>
              <p className="text-xs text-gray-500">
                Type de compte: {transaction.compte.type}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionList;