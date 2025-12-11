import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_COMPTES } from "../graphql/queries";

const CompteList = () => {
  // Exécute la requête GET_ALL_COMPTES au chargement du composant
  const { loading, error, data } = useQuery(GET_ALL_COMPTES);
  
  // Affichage des états de chargement et d'erreur
  if (loading) return <p className="text-center p-4">Chargement des comptes...</p>;
  if (error) return <p className="text-red-500 p-4">Erreur lors du chargement : {error.message}</p>;
  
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Liste des Comptes ({data.allComptes.length})</h2>
      {data.allComptes.length === 0 ? (
        <p className="text-gray-500">Aucun compte trouvé. Créez-en un ci-dessus.</p>
      ) : (
        <div className="space-y-4">
          {data.allComptes.map((compte) => (
            <div key={compte.id} className="border-b border-gray-100 pb-3 last:border-b-0">
              <p className="font-bold text-gray-800">ID: <span className="font-normal text-sm text-gray-500">{compte.id}</span></p>
              <p className="text-lg font-mono text-green-700">Solde: **{compte.solde.toFixed(2)}€**</p>
              <p className="text-sm text-gray-600">Type: <span className="font-medium text-blue-600">{compte.type}</span></p>
              <p className="text-xs text-gray-400">Créé le: {new Date(compte.dateCreation).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompteList;