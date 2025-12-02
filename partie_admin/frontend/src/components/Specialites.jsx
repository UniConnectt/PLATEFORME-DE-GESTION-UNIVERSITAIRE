import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Home, Briefcase, GraduationCap, User, Users, MapPin, Book, ArrowUpRight, LogOut
} from "lucide-react";

export default function Specialites() {
  const [specialites, setSpecialites] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [nom, setNom] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [selectedDep, setSelectedDep] = useState("");
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Spécialités");

  const apiUrl = "http://localhost:8084/specialites";
  const depsUrl = "http://localhost:8084/departements";

  const formatDate = (createdAtStr) => {
    if (!createdAtStr) return '—';
    const date = new Date(createdAtStr);
    return isNaN(date.getTime()) ? '—' : date.toLocaleString('fr-FR', { 
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  useEffect(() => {
    fetch(apiUrl).then(r => r.ok ? r.json() : Promise.reject()).then(setSpecialites).catch(console.error);
    fetch(depsUrl).then(r => r.ok ? r.json() : Promise.reject()).then(setDepartements).catch(console.error);
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    setNom(""); setAbbreviation(""); setSelectedDep(""); setEditId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNom(""); setAbbreviation(""); setSelectedDep(""); setEditId(null);
  };

  const isDuplicateLocal = (name, abbr, excludingId = null) => {
    const n = (name || "").trim().toLowerCase();
    const a = (abbr || "").trim().toLowerCase();
    return specialites.some(s => {
      if (excludingId && s.id === excludingId) return false;
      return (s.nom || "").trim().toLowerCase() === n || (s.abbreviation || "").trim().toLowerCase() === a;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nom.trim() || !abbreviation.trim() || !selectedDep) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (isDuplicateLocal(nom, abbreviation, editId)) {
      alert("Cette spécialité existe déjà (nom ou abréviation déjà utilisé).");
      return;
    }

    setIsLoading(true);
    const payload = {
      nom: nom.trim(),
      abbreviation: abbreviation.trim(),
      departement: { id: parseInt(selectedDep) }
    };

    const method = editId ? "PUT" : "POST";
    const url = editId ? `${apiUrl}/${editId}` : apiUrl;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.text();
        alert(err || "Erreur serveur");
        return;
      }

      const data = await res.json();
      if (editId) {
        setSpecialites(prev => prev.map(s => s.id === editId ? data : s));
      } else {
        setSpecialites(prev => [...prev, data]);
      }
      closeModal();
    } catch (err) {
      alert("Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette spécialité ?")) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      if (!res.ok) { const txt = await res.text(); alert(txt || "Erreur"); return; }
      setSpecialites(prev => prev.filter(s => s.id !== id));
    } catch { alert("Erreur de connexion"); } finally { setIsLoading(false); }
  };

  const handleEdit = (s) => {
    setNom(s.nom || "");
    setAbbreviation(s.abbreviation || "");
    setSelectedDep(s.departement?.id?.toString() || "");
    setEditId(s.id);
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = "http://localhost:3001/login";
  };

  const navItems = [
    { name: "Dashboard", icon: Home, path: "/" },
    { name: "Départements", icon: Briefcase, path: "/departements" },
    { name: "Spécialités", icon: GraduationCap, path: "/specialites" },
    { name: "Enseignants", icon: User, path: "/teachers" },
    { name: "Étudiants", icon: Users, path: "/etudiants" },
    { name: "Niveaux", icon: Book, path: "/niveaux" },
    { name: "Groupes", icon: Users, path: "/groupes" },
    { name: "Salles", icon: MapPin, path: "/salles" },
    { name: "Matières", icon: Book, path: "/matieres" },
    { name: "Import CSV/PDF", icon: ArrowUpRight, path: "http://localhost:3002" },
    { name: "Evènements", icon: ArrowUpRight, path: "http://localhost:8080" },
  ];

  const handleNavigate = (path) => {
    if (path.startsWith("http")) {
      window.open(path, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = path;
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-50 to-white flex flex-col border-r border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">GU</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Gestion universitaire</h2>
              <p className="text-xs text-gray-500">Espace Administratif</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.li key={item.name} whileTap={{ scale: 0.98 }}>
                  <button
                    onClick={() => {
                      setActiveNav(item.name);
                      handleNavigate(item.path);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeNav === item.name
                        ? "bg-blue-500 text-white shadow-lg"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <motion.button
            onClick={handleLogout}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-2 justify-center bg-white border border-gray-200 hover:border-red-300 text-gray-700 hover:text-red-600 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </motion.button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-white">
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Spécialités</h1>
            </div>
          </div>
        </header>

        <div className="p-8 bg-white">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">Spécialités</h2>
              <p className="text-gray-600">
                Total: <span className="font-semibold text-blue-600">{specialites.length}</span> spécialité{specialites.length > 1 ? 's' : ''}
              </p>
            </div>
            <button onClick={openModal} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold flex items-center gap-2 shadow-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Nom</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Abréviation</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Département</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Créé le</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {specialites.map((s) => (
                    <tr key={s.id} className="hover:bg-blue-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{s.nom}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{s.abbreviation || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                          {s.departement?.nom || 'Non assigné'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(s.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(s)} className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => handleDelete(s.id)} className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {specialites.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">Aucune spécialité</h3>
                          <p className="text-sm text-gray-500 mb-6">Commencez par créer votre première spécialité</p>
                          <button onClick={openModal} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-lg">
                            Créer maintenant
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full">
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {editId ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{editId ? "Modifier" : "Créer une spécialité"}</h3>
                    </div>
                  </div>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="px-6 py-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nom</label>
                    <input type="text" placeholder="Ex: Informatique" value={nom} onChange={e => setNom(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Abréviation</label>
                    <input type="text" placeholder="Ex: INFO" value={abbreviation} onChange={e => setAbbreviation(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Département</label>
                    <select value={selectedDep} onChange={e => setSelectedDep(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                      <option value="">Sélectionnez un département</option>
                      {departements.map(d => (
                        <option key={d.id} value={d.id}>{d.nom}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button type="button" onClick={closeModal} className="flex-1 px-5 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold">
                    Annuler
                  </button>
                  <button onClick={handleSubmit} disabled={isLoading || !nom.trim() || !abbreviation.trim() || !selectedDep}
                    className="flex-1 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold disabled:opacity-50">
                    {isLoading ? "Chargement..." : (editId ? "Sauvegarder" : "Ajouter")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}