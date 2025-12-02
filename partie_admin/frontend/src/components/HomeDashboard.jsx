// HomeDashboard.js - Code corrigé sans imports inutiles pour éviter l'erreur d'export
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Briefcase,
  Book,
  User,
  Users,
  MapPin,
  Search,
  GraduationCap,
  ArrowUpRight,
  TrendingUp,
  LogOut,
} from "lucide-react";

export default function HomeDashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [stats, setStats] = useState({
    departements: 0,
    enseignants: 0,
    etudiants: 0,
    specialites: 0,
    niveaux: 0,
    salles: 0,
    matieres: 0,
    groupes: 0,
  });
  const [departements, setDepartements] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [specialites, setSpecialites] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [salles, setSalles] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Début du chargement des données...");
        const fetchWithFallback = async (url, fallback = []) => {
          try {
            const r = await fetch(url);
            if (!r.ok && r.status !== 404 && r.status !== 405) throw new Error(`${url.split('/').pop()}: ${r.status}`);
            if (r.ok) {
              const data = await r.json();
              let list = Array.isArray(data) ? data : [];
              if (!Array.isArray(data)) {
                if (data.content && Array.isArray(data.content)) list = data.content;
                else if (data._embedded) {
                  for (const key in data._embedded) {
                    if (Array.isArray(data._embedded[key])) {
                      list = data._embedded[key];
                      break;
                    }
                  }
                } else if (data.data && Array.isArray(data.data)) list = data.data;
                else if (data.items && Array.isArray(data.items)) list = data.items;
                else if (data.results && Array.isArray(data.results)) list = data.results;
              }
              return list;
            }
            return fallback;
          } catch (e) {
            return fallback;
          }
        };

        const depList = await fetchWithFallback("http://localhost:8084/departements", []);
        const ensList = await fetchWithFallback("http://localhost:8084/teachers", []);
        const etdList = await fetchWithFallback("http://localhost:8084/etudiants/all", []);
        const specList = await fetchWithFallback("http://localhost:8084/specialites", []);
        const nivList = await fetchWithFallback("http://localhost:8084/niveaux", []);
        const salList = await fetchWithFallback("http://localhost:8084/salles", []);
        const matList = await fetchWithFallback("http://localhost:8084/matieres", []);
        const grpList = await fetchWithFallback("http://localhost:8084/api/groupes", []);

        setDepartements(depList);
        setEnseignants(ensList);
        setEtudiants(etdList);
        setSpecialites(specList);
        setNiveaux(nivList);
        setSalles(salList);
        setMatieres(matList);
        setGroupes(grpList);

        const newStats = {
          departements: depList.length,
          enseignants: ensList.length,
          etudiants: etdList.length,
          specialites: specList.length,
          niveaux: nivList.length,
          salles: salList.length,
          matieres: matList.length,
          groupes: grpList.length,
        };
        setStats(newStats);
        console.log("Stats mises à jour:", newStats);
      } catch (error) {
        console.error("Erreur chargement données:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleFocus = () => fetchData();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

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

  const statsData = [
    { title: "Départements", count: stats.departements, icon: Briefcase, path: "/departements", key: "departements" },
    { title: "Spécialités", count: stats.specialites, icon: GraduationCap, path: "/specialites", key: "specialites" },
    { title: "Enseignants", count: stats.enseignants, icon: User, path: "/teachers", key: "enseignants" },
    { title: "Étudiants", count: stats.etudiants, icon: Users, path: "/etudiants", key: "etudiants" },
    { title: "Niveaux", count: stats.niveaux, icon: Book, path: "/niveaux", key: "niveaux" },
    { title: "Salles", count: stats.salles, icon: MapPin, path: "/salles", key: "salles" },
    { title: "Matières", count: stats.matieres, icon: Book, path: "/matieres", key: "matieres" },
    { title: "Groupes", count: stats.groupes, icon: Users, path: "/groupes", key: "groupes" },
  ];

  const handleNavigate = (path) => {
    if (path.startsWith("http")) {
      window.open(path, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = path;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    window.location.href = "http://localhost:3001/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-8">
        <div className="bg-white rounded-2xl border border-blue-200 p-8 max-w-md text-center shadow-lg">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-blue-600 text-2xl font-bold">!</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-6 py-2.5 rounded-lg hover:bg-blue-600 transition-all font-medium"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const filteredStats = statsData.filter((stat) =>
    stat.title.toLowerCase().includes(searchQuery.toLowerCase())
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
        {/* Header simplifié sans bouton déconnexion */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
            </div>
          </div>
        </header>
        <div className="p-8">
          {/* Recherche */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 shadow-sm bg-white"
              />
            </div>
          </motion.div>
          {/* Stats Principales */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="col-span-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5" />
                  <span className="text-sm font-medium opacity-90">Total Utilisateurs</span>
                </div>
                <h2 className="text-5xl font-bold mb-2">{stats.enseignants + stats.etudiants}</h2>
                <p className="text-blue-100 text-sm">{stats.enseignants} enseignants • {stats.etudiants} étudiants</p>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Départements</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.departements}</h3>
              <p className="text-sm text-gray-500">{stats.specialites} spécialités actives</p>
            </motion.div>
          </div>
          {/* Tableau Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="font-semibold text-gray-900">Statistiques détaillées</h3>
            </div>
            <div className="divide-y divide-gray-100">
              <AnimatePresence>
                {filteredStats.map((stat, idx) => {
                  const Icon = stat.icon;
                  const isZero = stat.count === 0;
                  return (
                    <motion.div
                      key={stat.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleNavigate(stat.path)}
                      className={`px-6 py-4 hover:bg-blue-50 cursor-pointer transition-all duration-200 group ${isZero ? 'opacity-75' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-all ${isZero ? 'bg-gray-100' : ''}`}>
                            <Icon className={`w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors ${isZero ? 'text-gray-400' : ''}`} />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{stat.title}</h4>
                            <p className="text-sm text-gray-500">{stat.count} élément{stat.count > 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${isZero ? 'text-gray-400' : 'text-gray-900'}`}>{stat.count}</div>
                          </div>
                          <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
          {/* Infos Rapides */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-6 grid grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Structure académique</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Spécialités</span>
                  <span className="font-medium text-gray-900">{stats.specialites}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Niveaux</span>
                  <span className="font-medium text-gray-900">{stats.niveaux}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Groupes</span>
                  <span className="font-medium text-gray-900">{stats.groupes}</span>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Infrastructure</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Salles</span>
                  <span className="font-medium text-gray-900">{stats.salles}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Matières</span>
                  <span className="font-medium text-gray-900">{stats.matieres}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}