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

export default function Teachers() {
  const [enseignants, setEnseignants] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [selectedDep, setSelectedDep] = useState("");
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Enseignants");

  const apiUrl = "http://localhost:8084/teachers";
  const depsUrl = "http://localhost:8084/departements";

  useEffect(() => {
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        return res.json();
      })
      .then((data) => setEnseignants(data || []))
      .catch((err) => {
        console.error("Erreur chargement enseignants:", err);
        alert("Erreur de chargement des enseignants.");
      });
  }, []);

  useEffect(() => {
    fetch(depsUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        return res.json();
      })
      .then((data) => setDepartements(data || []))
      .catch((err) => {
        console.error("Erreur chargement départements:", err);
        alert("Erreur de chargement des départements.");
      });
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    setNom("");
    setPrenom("");
    setEmail("");
    setSelectedDep("");
    setEditId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNom("");
    setPrenom("");
    setEmail("");
    setSelectedDep("");
    setEditId(null);
  };

  // vérification locale des doublons (insensible à la casse, trim) sur email
  const isDuplicateLocal = (emailValue, excludingId = null) => {
    const em = (emailValue || "").trim().toLowerCase();
    return enseignants.some(t => {
      if (excludingId && t.id === excludingId) return false;
      const te = (t.email || "").trim().toLowerCase();
      return te === em;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nom.trim() || !prenom.trim() || !email.trim() || !selectedDep) {
      alert("Veuillez remplir le nom, le prénom, l'email et sélectionner un département.");
      return;
    }

    // Vérif locale avant envoi
    if (isDuplicateLocal(email, editId)) {
      alert("Cet email existe déjà. Merci de modifier l'email.");
      return;
    }

    setIsLoading(true);
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${apiUrl}/${editId}` : apiUrl;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          nom: nom.trim(), 
          prenom: prenom.trim(), 
          email: email.trim(), 
          departement: { id: parseInt(selectedDep) } 
        }),
      });

      if (!res.ok) {
        // récupérer message d'erreur renvoyé par le backend (text)
        const errorText = await res.text();
        alert(errorText || "Erreur serveur.");
        return;
      }

      const data = await res.json();

      if (editId) {
        setEnseignants(enseignants.map((t) => (t.id === editId ? data : t)));
      } else {
        // parfois backend renvoie created object, sinon on peut refetch
        setEnseignants([...enseignants, data]);
      }

      closeModal();
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion au serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet enseignant ? Attention : cela peut affecter les matières associées.")) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorText = await res.text();
        alert(errorText || "Impossible de supprimer.");
        return;
      }
      setEnseignants(enseignants.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion au serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (t) => {
    setNom(t.nom || "");
    setPrenom(t.prenom || "");
    setEmail(t.email || "");
    setSelectedDep(t.departement?.id?.toString() || "");
    setEditId(t.id);
    setIsModalOpen(true);
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

  
  const formatDate = (createdAtStr) => {
    if (!createdAtStr) return '—';
    const date = new Date(createdAtStr);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
          {/* Header */}
          <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">Gestion Enseignants</h1>
                </div>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* En-tête */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">Enseignants</h2>
                <p className="text-gray-600">
                  Total: <span className="font-semibold text-blue-600">{enseignants.length}</span> enseignant{enseignants.length > 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={openModal}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-xl"
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
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Département</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Créé le</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {enseignants.map((t) => (
                      <tr key={t.id} className="hover:bg-blue-50/50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-gray-900">{`${t.prenom} ${t.nom}`}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                            {t.departement?.nom || 'Non assigné'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(t.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(t)}
                              disabled={isLoading}
                              className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-50 group-hover:scale-110"
                              title="Modifier"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(t.id)}
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
                    {enseignants.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Aucun enseignant</h3>
                            <p className="text-sm text-gray-500 mb-6">Commencez par créer votre premier enseignant</p>
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
      </main>

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
                        {editId ? "Modifier" : "Créer un enseignant"}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {editId ? "Modifier les informations" : "Ajouter un nouvel enseignant"}
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
              <div className="px-6 py-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Dupont"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Jean"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Ex: jean.dupont@mail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Département
                    </label>
                    <select
                      value={selectedDep}
                      onChange={(e) => setSelectedDep(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                      disabled={isLoading}
                    >
                      <option value="">Sélectionnez un département</option>
                      {departements.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.nom}
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
                    type="button"
                    onClick={handleSubmit}
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}