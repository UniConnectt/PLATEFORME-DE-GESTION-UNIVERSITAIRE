import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Briefcase,
  Book,
  User,
  Users,
  MapPin,
  GraduationCap,
  ArrowUpRight,
  LogOut
} from "lucide-react";

export default function Matieres() {
  const base = "http://localhost:8084";
  const apiMatieres = `${base}/matieres`;
  const apiEnseignants = `${base}/teachers`;
  const apiNiveaux = `${base}/niveaux`;
  const apiSpecialites = `${base}/specialites`; // Nouvelle API pour spécialités
  const apiGroupes = `${base}/api/groupes`; // Nouvelle API pour groupes
  const apiSalles = `${base}/salles`; // Nouvelle API pour salles
  const [matieres, setMatieres] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [specialites, setSpecialites] = useState([]); // Nouveau state pour spécialités
  const [groupes, setGroupes] = useState([]); // Nouveau state pour groupes
  const [salles, setSalles] = useState([]); // Nouveau state pour salles
  const [form, setForm] = useState({
    nom: "",
    enseignantId: "",
    niveauId: "",
    specialiteId: "", // Nouveau champ
    groupeId: "", // Nouveau champ
    salleId: "" // Nouveau champ
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Matières");
  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  // Fonction pour charger une API spécifique avec gestion d'erreur individuelle
  const loadEndpoint = async (url, setter, name) => {
    try {
      console.log(`Chargement ${name} depuis : ${url}`);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${name}: ${res.status} - ${res.statusText}`);
      const data = await res.json();
      console.log(`${name} loaded:`, data);
      setter(data || []);
      setError(null);
    } catch (e) {
      console.error(`Erreur pour ${name}:`, e.message);
      setter([]);
      setError(`Erreur de chargement des ${name}: ${e.message}`);
    }
  };
  // Charger toutes les données
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        loadEndpoint(apiMatieres, setMatieres, 'matieres'),
        loadEndpoint(apiEnseignants, setEnseignants, 'enseignants'),
        loadEndpoint(apiNiveaux, setNiveaux, 'niveaux'),
        loadEndpoint(apiSpecialites, setSpecialites, 'specialites'), // Nouveau
        loadEndpoint(apiGroupes, setGroupes, 'groupes'), // Nouveau
        loadEndpoint(apiSalles, setSalles, 'salles') // Nouveau
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
  const openModal = () => {
    setIsModalOpen(true);
    setForm({
      nom: "",
      enseignantId: "",
      niveauId: "",
      specialiteId: "", // Reset nouveau
      groupeId: "", // Reset nouveau
      salleId: "" // Reset nouveau
    });
    setEditId(null);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setForm({
      nom: "",
      enseignantId: "",
      niveauId: "",
      specialiteId: "",
      groupeId: "",
      salleId: ""
    });
    setEditId(null);
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const saveMatiere = async (e) => {
    e.preventDefault();
    const { nom, enseignantId, niveauId, specialiteId, groupeId, salleId } = form;
    if (!nom.trim() || !enseignantId || !niveauId || !specialiteId || !groupeId || !salleId) { // Ajout validation nouveaux champs
      return alert("Veuillez remplir tous les champs.");
    }
    // Vérification locale des doublons sur nom (insensible à la casse, trim)
    const trimmedNom = nom.trim().toLowerCase();
    const isDuplicateLocal = matieres.some(m => 
      m.nom.toLowerCase().trim() === trimmedNom && (editId == null || m.id !== editId)
    );
    if (isDuplicateLocal) {
      alert("Cette matière existe déjà. Merci de modifier le nom.");
      return;
    }
    setIsLoading(true);
    setError(null);
    const body = {
      nom: nom.trim(),
      enseignant: { id: Number(enseignantId) },
      niveau: { id: Number(niveauId) },
      specialite: { id: Number(specialiteId) }, // Nouveau
      groupe: { id: Number(groupeId) }, // Nouveau
      salle: { id: Number(salleId) } // Nouveau
    };
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${apiMatieres}/${editId}` : apiMatieres;
    try {
      console.log(`Envoi ${method} vers ${url}`);
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status}: ${text || "Erreur serveur"}`);
      }
      await res.json();
      await loadData();
      closeModal();
      alert("Matière enregistrée avec succès !");
    } catch (e) {
      console.error("Erreur sauvegarde:", e);
      const errorMsg = "Erreur lors de la sauvegarde : " + e.message;
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };
  const editMatiere = (m) => {
    setForm({
      nom: m.nom || "",
      enseignantId: m.enseignant?.id?.toString() || "",
      niveauId: m.niveau?.id?.toString() || "",
      specialiteId: m.specialite?.id?.toString() || "", // Nouveau
      groupeId: m.groupe?.id?.toString() || "", // Nouveau
      salleId: m.salle?.id?.toString() || "" // Nouveau
    });
    setEditId(m.id);
    setIsModalOpen(true);
  };
  const deleteMatiere = async (id) => {
    if (!window.confirm("Supprimer cette matière ?")) return;
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Suppression ID ${id}`);
      const res = await fetch(`${apiMatieres}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status}: ${text || "Suppression impossible"}`);
      }
      await loadData();
      alert("Matière supprimée avec succès !");
    } catch (e) {
      console.error("Erreur suppression:", e);
      const errorMsg = "Erreur suppression : " + e.message;
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };
  const handleReload = () => {
    loadData();
    setError(null);
  };
  const handleNavigate = (path) => {
    if (path.startsWith("http")) {
      window.open(path, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = path;
    }
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
  if (loading) return (
    <div className="min-h-screen flex bg-white">
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
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
          <div className="text-lg">Chargement...</div>
        </div>
      </main>
    </div>
  );
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
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
          {/* Header */}
          <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332 .477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332 .477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332 .477-4.5 1.253" />
                    </svg>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">Gestion Matières</h1>
                </div>
              </div>
            </div>
          </header>
          <div className="max-w-7xl mx-auto px-6 py-8">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 flex justify-between items-center">
                {error}
                <button
                  onClick={handleReload}
                  className="ml-4 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            )}
            {/* En-tête */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">Matières</h2>
                <p className="text-gray-600">
                  Total: <span className="font-semibold text-blue-600">{matieres.length}</span> matière{matieres.length > 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={openModal}
                disabled={isLoading}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-xl disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter
              </button>
            </div>
            {/* Tableau */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Nom</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Enseignant</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Niveau</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Spécialité</th> {/* Nouvelle colonne */}
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Groupe</th> {/* Nouvelle colonne */}
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Salle</th> {/* Nouvelle colonne */}
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Créé le</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {matieres.map((m) => (
                      <tr key={m.id} className="hover:bg-blue-50/50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-gray-900">{m.nom}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                            {m.enseignant ? `${m.enseignant.nom} ${m.enseignant.prenom || ""}` : 'Non assigné'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                            {m.niveau?.nom || 'Non assigné'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                            {m.specialite?.nom || 'Non assigné'} {/* Affichage spécialité */}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
                            {m.groupe?.nom || 'Non assigné'} {/* Affichage groupe */}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                            {m.salle?.code || 'Non assigné'} {/* Affichage salle (utilise code pour identification) */}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(m.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => editMatiere(m)}
                              disabled={isLoading}
                              className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-50 group-hover:scale-110"
                              title="Modifier"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteMatiere(m.id)}
                              disabled={isLoading}
                              className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 group-hover:scale-110"
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
                        <td colSpan="8" className="px-6 py-20 text-center"> {/* ColSpan mis à 8 pour nouvelles colonnes */}
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Aucune matière</h3>
                            <p className="text-sm text-gray-500 mb-6">Commencez par créer votre première matière</p>
                            <button
                              onClick={openModal}
                              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-lg"
                            >
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
        </div>
        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={closeModal}
              ></div>
              <div className="relative bg-white rounded-2xl shadow-2xl transform transition-all sm:max-w-lg sm:w-full">
                {/* Header */}
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
                        <h3 className="text-lg font-bold text-gray-900">
                          {editId ? "Modifier" : "Créer une matière"}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {editId ? "Modifier les informations" : "Ajouter une nouvelle matière"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                {/* Form */}
                <form onSubmit={saveMatiere} className="px-6 py-6">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        name="nom"
                        placeholder="Ex: Mathématiques"
                        value={form.nom}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Enseignant
                      </label>
                      <select
                        name="enseignantId"
                        value={form.enseignantId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                        disabled={isLoading}
                      >
                        <option value="">Sélectionnez un enseignant</option>
                        {enseignants.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.nom} {e.prenom || ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Niveau
                      </label>
                      <select
                        name="niveauId"
                        value={form.niveauId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                        disabled={isLoading}
                      >
                        <option value="">Sélectionnez un niveau</option>
                        {niveaux.map((n) => (
                          <option key={n.id} value={n.id}>
                            {n.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div> {/* Nouveau champ pour Spécialité */}
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Spécialité
                      </label>
                      <select
                        name="specialiteId"
                        value={form.specialiteId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                        disabled={isLoading}
                      >
                        <option value="">Sélectionnez une spécialité</option>
                        {specialites.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div> {/* Nouveau champ pour Groupe */}
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Groupe
                      </label>
                      <select
                        name="groupeId"
                        value={form.groupeId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                        disabled={isLoading}
                      >
                        <option value="">Sélectionnez un groupe</option>
                        {groupes.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div> {/* Nouveau champ pour Salle */}
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Salle
                      </label>
                      <select
                        name="salleId"
                        value={form.salleId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                        disabled={isLoading}
                      >
                        <option value="">Sélectionnez une salle</option>
                        {salles.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.code} {/* Utilise code pour affichage */}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {/* Footer */}
                  <div className="flex gap-3 mt-8">
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={isLoading}
                      className="flex-1 px-5 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all font-semibold disabled:opacity-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-xl transition-all font-semibold disabled:opacity-50"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Chargement...
                        </span>
                      ) : (
                        editId ? "Sauvegarder" : "Ajouter"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}