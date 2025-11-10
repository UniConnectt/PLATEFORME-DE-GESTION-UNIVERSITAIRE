import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Salles() {
  const [salles, setSalles] = useState([]);
  const [code, setCode] = useState("");
  const [type, setType] = useState("");
  const [capacite, setCapacite] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = "http://localhost:8084/salles";

  const loadData = () => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then(setSalles)
      .catch((err) => console.error("Erreur chargement salles:", err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setCode("");
    setType("");
    setCapacite("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code || !capacite) {
      alert("Remplis au moins le code et la capacité.");
      return;
    }
    setIsLoading(true);
    const payload = {
      code: code.trim(),
      type: type.trim() || null,
      capacite: Number(capacite),
    };

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${apiUrl}/${editingId}` : apiUrl;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erreur serveur");
      }
      await res.json();
      resetForm();
      loadData();
    } catch (err) {
      console.error(err);
      alert("Impossible d'enregistrer la salle : " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (s) => {
    setCode(s.code);
    setType(s.type || "");
    setCapacite(s.capacite || "");
    setEditingId(s.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette salle ?")) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur suppression");
      loadData();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression : " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
          <span className="font-medium text-gray-900">Gestion des Salles</span>
        </nav>

        <div className="mb-8">
          <p className="text-lg text-gray-600">Gérez vos salles avec efficacité et précision.</p>
        </div>

        {/* Formulaire */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-8 overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Code</label>
                <input
                  type="text"
                  placeholder="ex. : Si 01"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                <input
                  type="text"
                  placeholder="ex. : TP / TD / Amphi"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Capacité</label>
                <input
                  type="number"
                  placeholder="ex. : 25"
                  value={capacite}
                  onChange={(e) => setCapacite(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="flex justify-end space-x-3">
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={isLoading}
                    className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm ${
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
                  className={`px-8 py-3 rounded-lg text-white font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : editingId 
                        ? "bg-emerald-600 hover:bg-emerald-700" 
                        : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {isLoading ? "En cours..." : (editingId ? "Modifier" : "Ajouter")} Salle
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">Aperçu des Salles</h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{salles.length} salle(s)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Capacité</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salles.map((s) => (
                  <tr key={s.id} className="transition-all duration-150 hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.type || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.capacite}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(s)}
                          disabled={isLoading}
                          className="p-2 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all duration-200 shadow-sm hover:shadow-md flex items-center disabled:opacity-50"
                          title="Modifier"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.5H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
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
                {salles.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="text-gray-500 space-y-4">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-lg font-medium">Aucune salle trouvée</p>
                        <p className="text-sm">Ajoutez votre première salle ci-dessus pour commencer.</p>
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