import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Matieres() {
  const base = "http://localhost:8084";
  const apiMatieres = `${base}/matieres`;
  const apiEnseignants = `${base}/teachers`; // ✅ Corrigé : /teachers au lieu de /enseignants/all
  const apiNiveaux = `${base}/niveaux`;
  const [matieres, setMatieres] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [form, setForm] = useState({ nom: "", enseignantId: "", niveauId: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fonction pour charger une API spécifique avec gestion d'erreur individuelle
  const loadEndpoint = async (url, setter, name) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${name}: ${res.status}`);
      const data = await res.json();
      setter(data);
    } catch (e) {
      console.error(`Erreur pour ${name}:`, e.message);
      setter([]);
    }
  };

  // Charger toutes les données
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        loadEndpoint(apiMatieres, setMatieres, 'matieres'),
        loadEndpoint(apiEnseignants, setEnseignants, 'enseignants'), // ✅ Maintenant correct
        loadEndpoint(apiNiveaux, setNiveaux, 'niveaux')
      ]);
    } catch (e) {
      setError(e.message);
      console.error("Erreur loadData:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const reset = () => {
    setForm({ nom: "", enseignantId: "", niveauId: "" });
    setEditId(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveMatiere = async (e) => {
    e.preventDefault();
    const { nom, enseignantId, niveauId } = form;
    if (!nom || !enseignantId || !niveauId)
      return alert("Veuillez remplir tous les champs.");
    setIsLoading(true);
    const body = {
      nom,
      enseignant: { id: Number(enseignantId) },
      niveau: { id: Number(niveauId) },
    };
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${apiMatieres}/${editId}` : apiMatieres;
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await loadData(); // ✅ Recharge enseignants/niveaux/matières → select mis à jour
      reset();
    } catch (e) {
      alert("Erreur lors de la sauvegarde : " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const editMatiere = (m) => {
    setForm({
      nom: m.nom,
      enseignantId: m.enseignant?.id || "",
      niveauId: m.niveau?.id || "",
    });
    setEditId(m.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteMatiere = async (id) => {
    if (!window.confirm("Supprimer cette matière ?")) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${apiMatieres}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await loadData(); // ✅ Recharge pour mise à jour selects
    } catch (e) {
      alert("Erreur suppression : " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-lg">Chargement...</div></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Sticky avec logo simple */}
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
        {/* Breadcrumb pour navigation vers dashboard */}
        <nav className="mb-8 flex items-center space-x-2 text-sm text-gray-500">
          <Link
            to="/"
            className="hover:text-indigo-600 transition-colors font-medium"
          >
            Tableau de Bord
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-medium text-gray-900">Gestion des Matières</span>
        </nav>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            Erreur : {error} —{" "}
            <button
              onClick={loadData}
              className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
            >
              Réessayer
            </button>
          </div>
        )}
        <div className="mb-8">
          <p className="text-lg text-gray-600">Gérez vos matières avec efficacité et précision.</p>
        </div>
        {/* Formulaire */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-8 overflow-hidden">
          <div className="p-6">
            <form onSubmit={saveMatiere} className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nom de la Matière</label>
                <input
                  type="text"
                  name="nom"
                  placeholder="ex. : Mathématiques"
                  value={form.nom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Enseignant</label>
                <select
                  name="enseignantId"
                  value={form.enseignantId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  required
                  disabled={isLoading}
                >
                  <option value="">-- Choisir Enseignant --</option>
                  {enseignants.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nom} {e.prenom || ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Niveau</label>
                <select
                  name="niveauId"
                  value={form.niveauId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  required
                  disabled={isLoading}
                >
                  <option value="">-- Choisir Niveau --</option>
                  {niveaux.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="lg:col-span-1 flex space-x-3">
                {editId && (
                  <button
                    type="button"
                    onClick={reset}
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
                      : editId
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {isLoading ? "En cours..." : (editId ? "Modifier" : "Ajouter")} Matière
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Tableau */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">Aperçu des Matières</h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{matieres.length} matière(s)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Enseignant</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Niveau</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {matieres.map((m) => (
                  <tr key={m.id} className="transition-all duration-150 hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{m.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{m.nom}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {m.enseignant ? `${m.enseignant.nom} ${m.enseignant.prenom || ""}` : "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{m.niveau?.nom || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => editMatiere(m)}
                          disabled={isLoading}
                          className="p-2 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all duration-200 shadow-sm hover:shadow-md flex items-center disabled:opacity-50"
                          title="Modifier"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.5H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteMatiere(m.id)}
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
                {matieres.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="text-gray-500 space-y-4">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-lg font-medium">Aucune matière trouvée</p>
                        <p className="text-sm">Ajoutez votre première matière ci-dessus pour commencer.</p>
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