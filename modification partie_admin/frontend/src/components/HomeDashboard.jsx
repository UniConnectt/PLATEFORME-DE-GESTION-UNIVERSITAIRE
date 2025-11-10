import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBriefcase,
  FiBook,
  FiUser,
  FiUsers,
  FiMapPin,
  FiCalendar,
} from "react-icons/fi";
import { MdSchool, MdReport, MdSearch } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

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
  const [showPopup, setShowPopup] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const depList = await fetchWithFallback("http://localhost:8084/departements", []);
        const ensList = await fetchWithFallback("http://localhost:8084/teachers", []);
        const etdList = await fetchWithFallback("http://localhost:8084/etudiants/all", []);
        const specList = await fetchWithFallback("http://localhost:8084/specialites", []);
        const nivList = await fetchWithFallback("http://localhost:8084/niveaux", []);
        const salList = await fetchWithFallback("http://localhost:8084/salles", []);
        const matList = await fetchWithFallback("http://localhost:8084/matieres", []);
        const grpList = await fetchWithFallback("http://localhost:8084/groupes", []);

        setDepartements(depList);
        setEnseignants(ensList);
        setEtudiants(etdList);
        setSpecialites(specList);
        setNiveaux(nivList);
        setSalles(salList);
        setMatieres(matList);
        setGroupes(grpList);
        setStats({
          departements: depList.length,
          enseignants: ensList.length,
          etudiants: etdList.length,
          specialites: specList.length,
          niveaux: nivList.length,
          salles: salList.length,
          matieres: matList.length,
          groupes: grpList.length,
        });
      } catch (error) {
        console.error("Erreur chargement données:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchWithFallback = async (url, fallback = []) => {
      try {
        const r = await fetch(url);
        if (!r.ok && r.status !== 404 && r.status !== 405) throw new Error(`${url.split('/').pop()}: ${r.status}`);
        if (r.ok) {
          const data = await r.json();
          return Array.isArray(data) ? data.slice(0, 5) : [];
        }
        return fallback;
      } catch (e) {
        console.warn(`Fallback pour ${url}: ${e.message}`);
        return fallback;
      }
    };

    fetchData();

    const handleFocus = () => fetchData();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const navItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/" },
    { name: "Départements", icon: <FiBriefcase />, path: "/departements" },
    { name: "Spécialités", icon: <MdSchool />, path: "/specialites" },
    { name: "Enseignants", icon: <FiUser />, path: "/teachers" },
    { name: "Étudiants", icon: <FiUsers />, path: "/etudiants" },
    { name: "Niveaux", icon: <FiBook />, path: "/niveaux" },
    { name: "Groupes", icon: <FiUsers />, path: "/groupes" },
    { name: "Salles", icon: <FiMapPin />, path: "/salles" },
    { name: "Matières", icon: <FiBook />, path: "/matieres" },
  ];

  const cards = [
    { 
      title: "Départements", 
      count: stats.departements, 
      color: "from-blue-50 to-blue-100",
      icon: <FiBriefcase size={40} className="text-blue-600" />,
      list: departements,
      path: "/departements",
      key: "departements",
      itemKey: (item) => item.nom,
    },
    { 
      title: "Spécialités", 
      count: stats.specialites, 
      color: "from-blue-50 to-blue-100",
      icon: <MdSchool size={40} className="text-blue-600" />,
      list: specialites,
      path: "/specialites",
      key: "specialites",
      itemKey: (item) => item.nom,
    },
    { 
      title: "Enseignants", 
      count: stats.enseignants, 
      color: "from-blue-50 to-blue-100",
      icon: <FiUser size={40} className="text-blue-600" />,
      list: enseignants,
      path: "/teachers",
      key: "enseignants",
      itemKey: (item) => `${item.nom} ${item.prenom || ""}`,
      getAvatar: (item) => (
        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-semibold text-sm">
            {(item.prenom || '')[0]?.toUpperCase()}{(item.nom || '')[0]?.toUpperCase()}
          </span>
        </div>
      ),
      getSubtitle: (item) => item.email || "Pas d'email",
    },
    { 
      title: "Étudiants", 
      count: stats.etudiants, 
      color: "from-blue-50 to-blue-100",
      icon: <FiUsers size={40} className="text-blue-600" />,
      list: etudiants,
      path: "/etudiants",
      key: "etudiants",
      itemKey: (item) => `${item.nom} ${item.prenom || ""}`,
      getAvatar: (item) => (
        <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-green-600 font-semibold text-sm">
            {(item.prenom || '')[0]?.toUpperCase()}{(item.nom || '')[0]?.toUpperCase()}
          </span>
        </div>
      ),
      getSubtitle: (item) => item.email || "Pas d'email",
    },
    { 
      title: "Niveaux", 
      count: stats.niveaux, 
      color: "from-blue-50 to-blue-100",
      icon: <FiBook size={40} className="text-blue-600" />,
      list: niveaux,
      path: "/niveaux",
      key: "niveaux",
      itemKey: (item) => item.nom || item.libelle,
    },
    { 
      title: "Salles", 
      count: stats.salles, 
      color: "from-blue-50 to-blue-100",
      icon: <FiMapPin size={40} className="text-blue-600" />,
      list: salles,
      path: "/salles",
      key: "salles",
      itemKey: (item) => item.nom || item.code,
    },
    { 
      title: "Matières", 
      count: stats.matieres, 
      color: "from-blue-50 to-blue-100",
      icon: <FiBook size={40} className="text-blue-600" />,
      list: matieres,
      path: "/matieres",
      key: "matieres",
      itemKey: (item) => item.nom,
    },
    { 
      title: "Groupes", 
      count: stats.groupes, 
      color: "from-blue-50 to-blue-100",
      icon: <FiUsers size={40} className="text-blue-600" />,
      list: groupes,
      path: "/groupes",
      key: "groupes",
      itemKey: (item) => item.nom,
    },
  ];

  const PopupWindow = ({ title, list, itemKey, path, isOpen, getAvatar, getSubtitle }) => {
    const [localSearch, setLocalSearch] = useState("");

    if (!isOpen || !list.length) return null;

    const filteredList = list.filter((item) =>
      itemKey(item).toLowerCase().includes(localSearch.toLowerCase())
    );

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl rounded-2xl w-80 p-4 z-50"
            style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100/50">
              <h4 className="font-semibold text-sm text-gray-900">{title} ({filteredList.length})</h4>
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="pl-10 pr-4 py-1.5 w-32 text-xs border border-gray-200/50 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500/50 bg-white/80"
                />
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1.5">
              {filteredList.length > 0 ? (
                filteredList.map((item, idx) => (
                  <motion.div
                    key={item.id || idx}
                    whileHover={{ x: 4, backgroundColor: "#f8fafc" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50/50 text-sm text-gray-700 transition-colors cursor-pointer"
                    onClick={() => navigate(path)}
                  >
                    {getAvatar ? (
                      getAvatar(item)
                    ) : (
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-semibold text-sm">
                          {item.nom?.[0]?.toUpperCase() || "I"}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{itemKey(item)}</p>
                      {getSubtitle && (
                        <p className="text-xs text-gray-500 truncate">{getSubtitle(item)}</p>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="text-xs text-gray-400 text-center py-4 italic"
                >
                  Aucun élément trouvé
                </motion.p>
              )}
            </div>
            <div className="mt-3 pt-2 border-t border-gray-100/50 text-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium underline decoration-dotted"
                onClick={() => navigate(path)}
              >
                Voir tous ({list.length})
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full shadow-lg"
        />
      </div>
    );
  }

  if (error) {
    return (
      <main className="flex-1 p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 mb-2">Erreur chargement : {error}</p>
          <button onClick={() => window.location.reload()} className="bg-red-500 text-white px-4 py-2 rounded-lg">
            Réessayer
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <aside className="w-64 bg-white/80 backdrop-blur-sm shadow-lg border-r border-blue-100 flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center gap-3">
          <img
            src="https://iset.uvt.tn/pluginfile.php/1/theme_lambda/logo/1756369462/iset_logo.png"
            alt="Logo"
            className="w-12 h-12 object-contain rounded-full shadow-md"
          />
          <div>
            <h2 className="text-lg font-bold text-blue-700">ISET Tozeur</h2>
            <p className="text-xs text-gray-500">Portail Administratif</p>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item, idx) => (
              <motion.li key={item.name} whileHover={{ x: 4 }}>
                <button
                  onClick={() => {
                    setActiveNav(item.name);
                    navigate(item.path);
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-sm transition-all duration-200 ${
                    activeNav === item.name
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-transparent hover:border-blue-200"
                  }`}
                >
                  <span className={`transition-colors ${activeNav === item.name ? "text-white" : "text-gray-500"}`}>{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              </motion.li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <motion.header 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-10 flex flex-wrap justify-between items-center gap-4"
        >
          <div>
            <motion.h1 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.2 }} 
              className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent"
            >
              Tableau de bord
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.4 }} 
              className="text-gray-600 mt-2 font-medium"
            >
              Bienvenue, Administrateur – Voici un aperçu de votre plateforme
            </motion.p>
          </div>
          <motion.div 
            className="relative"
            whileFocus={{ scale: 1.02 }}
          >
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher dans le dashboard..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-200/50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 outline-none w-80 bg-white/80 backdrop-blur-sm shadow-sm"
            />
          </motion.div>
        </motion.header>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
          layout
        >
          <AnimatePresence>
            {cards
              .filter((card) =>
                card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                card.list.some((item) => card.itemKey(item).toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .map((card, idx) => (
                <div 
                  key={card.key} 
                  className="relative"
                  onMouseEnter={() => setShowPopup({ ...showPopup, [card.key]: true })}
                  onMouseLeave={() => setShowPopup({ ...showPopup, [card.key]: false })}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                    whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    className={`group ${card.color} bg-gradient-to-br rounded-xl shadow-sm border border-white/50 overflow-hidden p-6 flex flex-col items-center text-center cursor-pointer transition-all duration-300`}
                    onClick={() => navigate(card.path)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 3 }}
                      className="mb-4 flex-shrink-0"
                    >
                      {card.icon}
                    </motion.div>
                    <div className="flex-1 z-10">
                      <p className="text-sm font-medium text-gray-700 mb-1">{card.title}</p>
                      <motion.h3 
                        className="text-3xl font-bold text-gray-900 mb-2"
                        whileHover={{ color: "#3b82f6" }}
                      >
                        {card.count}
                      </motion.h3>
                      <motion.p
                        className="text-xs text-gray-500"
                        initial={{ opacity: 0.7 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {card.count > 0 ? `${card.count} élément${card.count > 1 ? 's' : ''}` : "Aucun"}
                      </motion.p>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                  </motion.div>

                  <PopupWindow
                    title={card.title}
                    list={card.list}
                    itemKey={card.itemKey}
                    path={card.path}
                    isOpen={showPopup[card.key]}
                    getAvatar={card.getAvatar}
                    getSubtitle={card.getSubtitle}
                  />
                </div>
              ))}
          </AnimatePresence>
        </motion.div>

        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.8 }} 
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-6 overflow-hidden"
        >
          <motion.h3 
            className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2"
            whileHover={{ color: "#3b82f6" }}
          >
            <FiCalendar className="text-blue-600" />
            Activité récente
          </motion.h3>
          <motion.div className="space-y-3" layout>
            {[...enseignants.slice(0, 3), ...etudiants.slice(0, 3)].map((item, idx) => (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + idx * 0.1 }}
                whileHover={{ x: 4, backgroundColor: "#eff6ff" }}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-50/30 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer border border-blue-100/50"
                onClick={() => navigate("/etudiants")}
              >
                <motion.div 
                  className="w-2 h-2 rounded-full bg-blue-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {item.nom} {item.prenom} {item.email ? `(${item.email})` : ""} ajouté
                  </p>
                  <p className="text-xs text-gray-500">Il y a {idx + 1} min</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium px-3 py-1 rounded-full bg-blue-100/50 hover:bg-blue-200/50 transition-colors"
                >
                  Voir
                </motion.button>
              </motion.div>
            ))}
            {[...enseignants, ...etudiants].length === 0 && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center text-gray-500 py-8 italic font-medium"
              >
                Aucune activité récente
              </motion.p>
            )}
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
}