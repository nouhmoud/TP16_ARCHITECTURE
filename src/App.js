import { ApolloProvider } from "@apollo/client";
import { client } from "./apollo/client";

// Import des composants
import CompteList from "./components/CompteList";
import CreateCompte from "./components/CreateCompte";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import "./App.css"; // Assure que les styles de base (y compris Tailwind) sont chargés

// Le composant App
function App() {
  return (
    // 1. ApolloProvider enveloppe l'application et fournit le client GraphQL à tous les composants enfants.
    <ApolloProvider client={client}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            🏦 Gestion des Comptes et Transactions
          </h1>
          
          {/* 2. Disposition principale en grille (1 colonne sur mobile, 2 colonnes sur grand écran) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Colonne de Gauche : Gestion des Comptes */}
            <div className="space-y-6">
              <CreateCompte />
              <CompteList />
            </div>
            
            {/* Colonne de Droite : Gestion des Transactions */}
            <div className="space-y-6">
              <TransactionForm />
              <TransactionList />
            </div>

          </div>
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;