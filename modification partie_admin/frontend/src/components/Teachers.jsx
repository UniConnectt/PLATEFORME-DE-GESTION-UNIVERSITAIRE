import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Teachers() {
  const [enseignants, setEnseignants] = useState([]);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [departementId, setDepartementId] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // ✅ Gestion d'erreurs globales

  // ✅ Corrigé : Endpoint aligné sur backend (/teachers, pas /enseignants)
  const apiUrl = "http://localhost:8084/teachers";
  const depUrl = "http://localhost:8084/departements"; // Gardé si votre contrôleur existe

  const [departements, setDepartements] = useState([]);

  // Fonction utilitaire pour fetch avec erreurs (comme dans Matieres)
  const loadEndpoint = async (url, setter, name) => {
    try {
      console.log(`Chargement ${name} depuis : ${url}`); // ✅ Log debug pour vérifier
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${name}: ${res.status} - ${res.statusText}`);
      const data = await res.json();
      console.log(`${name} loaded:`, data); // ✅ Log : Vérifie en console si données vides
      setter(data || []);
      setError(null); // Reset erreur sur succès
    } catch (err) {
      console.error(`Erreur ${name}:`, err); // Log pour debug
      setter([]);
      setError(`Erreur de chargement des ${name}: ${err.message}`);
    }
  };

  // Chargement enseignants (✅ Corrigé : GET /teachers, pas /all)
  const loadEnseignants = () => {
    loadEndpoint(apiUrl, setEnseignants, "enseignants");
  };

  useEffect(() => {
    loadEnseignants();
  }, []);

  // Chargement départements (avec gestion d'erreur)
  useEffect(() => {
    loadEndpoint(depUrl, setDepartements, "départements");
  }, []);

  const resetForm = () => {
    setNom("");
    setPrenom("");
    setEmail("");
    setDepartementId("");
    setEditingId(null);
  };

  // Soumission form (✅ Corrigé : POST /teachers, pas /add ; rechargement après ajout)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nom.trim() || !prenom.trim() || !email.trim() || !departementId) {
      alert("Remplissez tous les champs obligatoires.");
      return;
    }
    setIsLoading(true);
    setError(null);
    const payload = {
      nom: nom.trim(),
      prenom: prenom.trim(),
      email: email.trim(),
      departement: departementId ? { id: Number(departementId) } : null, // Optionnel si pas obligatoire
    };

    const method = editingId ? "PUT" : "POST";
    // ✅ Corrigé : URL standard /teachers pour POST, /teachers/{id} pour PUT
    const url = editingId ? `${apiUrl}/${editingId}` : apiUrl;

    try {
      console.log(`Envoi ${method} vers ${url}`); // Log debug
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status}: ${text || "Erreur serveur"}`);
      }
      const data = await res.json();
      console.log("Réponse succès:", data); // Log debug
      if (editingId) {
        // Mise à jour locale pour édition rapide
        setEnseignants(enseignants.map((t) => (t.id === editingId ? data : t)));
        setEditingId(null);
      } else {
        // Ajout local + rechargement pour cohérence DB
        setEnseignants([...enseignants, data]);
        loadEnseignants(); // ✅ Recharge complète : fixe l'affichage des nouveaux
      }
      resetForm();
      alert("Enseignant enregistré avec succès !"); // Feedback positif
    } catch (err) {
      console.error("Erreur submit:", err);
      const errorMsg = "Impossible d'enregistrer l'enseignant : " + err.message;
      setError(errorMsg);
      alert(errorMsg); // ✅ Corrigé : Alert direct avec le message d'erreur (évite alert(setError))
    } finally {
      setIsLoading(false);
    }
  };

  // Édition (inchangé)
  const handleEdit = (t) => {
    setNom(t.nom || "");
    setPrenom(t.prenom || "");
    setEmail(t.email || "");
    setDepartementId(t.departement?.id?.toString() || "");
    setEditingId(t.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Suppression (✅ Corrigé : DELETE /teachers/{id} + rechargement)
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet enseignant ?")) return;
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Suppression ID ${id}`); // Log
      const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status}: ${text || "Suppression impossible"}`);
      }
      loadEnseignants(); // ✅ Rechargement : met à jour la table
      alert("Enseignant supprimé avec succès !"); // ✅ Ajout : Feedback positif sur succès
    } catch (err) {
      console.error(err);
      const errorMsg = "Erreur lors de la suppression : " + err.message;
      setError(errorMsg);
      alert(errorMsg); // ✅ Corrigé : Alert direct avec le message d'erreur (évite alert(setError))
    } finally {
      setIsLoading(false);
    }
  };

  // Bouton recharger (nouveau, pour debug)
  const handleReload = () => {
    loadEnseignants();
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header (inchangé) */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-900">Plateforme de Gestion</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb (inchangé) */}
        <nav className="mb-8 flex items-center space-x-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-indigo-600 transition-colors font-medium">
            Tableau de Bord
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-medium text-gray-900">Gestion des Enseignants</span>
        </nav>

        {/* ✅ Affichage erreur + bouton retry */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
            {error}
            <button
              onClick={handleReload}
              className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Réessayer
            </button>
          </div>
        )}

        <div className="mb-8">
          <p className="text-lg text-gray-600">Gérez vos enseignants avec efficacité et précision.</p>
        </div>

        {/* Formulaire (✅ Grid pour alignement, comme Matieres) */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-8 overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  placeholder="ex. : Dupont"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Prénom</label>
                <input
                  type="text"
                  placeholder="ex. : Jean"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="ex. : jean.dupont@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Département</label>
                <select
                  value={departementId}
                  onChange={(e) => setDepartementId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  required
                  disabled={isLoading}
                >
                  <option value="">Sélectionner un Département</option>
                  {departements.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nom}
                    </option>
                  ))}
                  {departements.length === 0 && <option disabled>Aucun département chargé</option>}
                </select>
              </div>
              <div className="lg:col-span-1 flex space-x-3">
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={isLoading}
                    className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm ${
                      isLoading
                        ? "bg-gray-400 cursor-not-allowed text-gray-200"
                        : "bg-gray-300 hover:bg-gray-400 text-gray-700"
                    }`}
                  >
                    Annuler
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 px-4 py-3 rounded-lg text-white font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : editingId 
                        ? "bg-emerald-600 hover:bg-emerald-700" 
                        : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {isLoading ? "En cours..." : (editingId ? "Modifier" : "Ajouter")} Enseignant
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Tableau (inchangé, mais rechargement fixe l'affichage) */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">Aperçu des Enseignants</h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{enseignants.length} enseignant(s)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Prénom</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Département</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enseignants.map((t) => (
                  <tr key={t.id} className="transition-all duration-150 hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t.nom}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{t.prenom}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{t.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{t.departement?.nom || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(t)}
                          disabled={isLoading}
                          className="p-2 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all duration-200 shadow-sm hover:shadow-md flex items-center disabled:opacity-50"
                          title="Modifier"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.5H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          disabled={isLoading}
                          className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-all duration-200 shadow-sm hover:shadow-md flex items-center disabled:opacity-50"
                          title="Supprimer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {enseignants.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-500 space-y-4">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 4.14a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-lg font-medium">Aucun enseignant trouvé</p>
                        <p className="text-sm">Ajoutez votre premier enseignant ci-dessus pour commencer.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}