package org.example.Service;

import org.example.Entity.Matiere;
import org.example.Entity.Enseignant;
import org.example.Entity.Niveau;
import org.example.Entity.Departement; // Si utilisé (optionnel)
import org.example.Repository.MatiereRepository;
import org.example.Repository.EnseignantRepository;
import org.example.Repository.NiveauRepository;
import org.example.Repository.DepartementRepository; // Si utilisé (optionnel)
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MatiereService {
    @Autowired
    private MatiereRepository repo;

    @Autowired
    private EnseignantRepository enseignantRepo;

    @Autowired
    private NiveauRepository niveauRepo;

    @Autowired
    private DepartementRepository departementRepo; // ✅ Décommenté si DepartementRepository existe ; sinon, commente les usages

    public List<Matiere> getAll() {
        return repo.findAll();
    }

    public Matiere add(Matiere m) {
        // Validation : Vérifier existence des références si ID fourni
        if (m.getEnseignant() != null && m.getEnseignant().getId() != null) {
            if (!enseignantRepo.existsById(m.getEnseignant().getId())) {
                System.out.println("Erreur ajout matière: Enseignant non trouvé (ID: " + m.getEnseignant().getId() + ")");
                return null;
            }
            // Fetch complet
            Optional<Enseignant> optEnseignant = enseignantRepo.findById(m.getEnseignant().getId());
            if (optEnseignant.isPresent()) {
                m.setEnseignant(optEnseignant.get());
            } else {
                return null; // Incohérent avec existsById, mais safety
            }
        } else {
            System.out.println("Erreur ajout matière: Enseignant manquant");
            return null; // React envoie toujours, mais check
        }

        if (m.getNiveau() != null && m.getNiveau().getId() != null) {
            if (!niveauRepo.existsById(m.getNiveau().getId())) {
                System.out.println("Erreur ajout matière: Niveau non trouvé (ID: " + m.getNiveau().getId() + ")");
                return null;
            }
            // Fetch complet
            Optional<Niveau> optNiveau = niveauRepo.findById(m.getNiveau().getId());
            if (optNiveau.isPresent()) {
                m.setNiveau(optNiveau.get());
            } else {
                return null;
            }
        } else {
            System.out.println("Erreur ajout matière: Niveau manquant");
            return null;
        }

        // Validation département (optionnelle - si utilisé, décommente et assure DepartementRepository)
        /*
        if (m.getDepartement() != null && m.getDepartement().getId() != null) {
            if (!departementRepo.existsById(m.getDepartement().getId())) {
                System.out.println("Erreur ajout matière: Département non trouvé (ID: " + m.getDepartement().getId() + ")");
                return null;
            }
            Optional<Departement> optDepartement = departementRepo.findById(m.getDepartement().getId());
            if (optDepartement.isPresent()) {
                m.setDepartement(optDepartement.get());
            } else {
                return null;
            }
        }
        */

        System.out.println("Ajout matière réussie: " + m.getNom());
        return repo.save(m);
    }

    public Matiere update(Long id, Matiere matiere) {
        return repo.findById(id).map(m -> {
            // Mise à jour nom
            m.setNom(matiere.getNom());

            // Validation et fetch enseignant si changé
            if (matiere.getEnseignant() != null && matiere.getEnseignant().getId() != null) {
                if (!enseignantRepo.existsById(matiere.getEnseignant().getId())) {
                    System.out.println("Erreur update matière: Enseignant non trouvé (ID: " + matiere.getEnseignant().getId() + ")");
                    return null;
                }
                Optional<Enseignant> optEnseignant = enseignantRepo.findById(matiere.getEnseignant().getId());
                if (optEnseignant.isPresent()) {
                    m.setEnseignant(optEnseignant.get());
                } else {
                    return null;
                }
            }

            // Validation et fetch niveau si changé
            if (matiere.getNiveau() != null && matiere.getNiveau().getId() != null) {
                if (!niveauRepo.existsById(matiere.getNiveau().getId())) {
                    System.out.println("Erreur update matière: Niveau non trouvé (ID: " + matiere.getNiveau().getId() + ")");
                    return null;
                }
                Optional<Niveau> optNiveau = niveauRepo.findById(matiere.getNiveau().getId());
                if (optNiveau.isPresent()) {
                    m.setNiveau(optNiveau.get());
                } else {
                    return null;
                }
            }

            // Département (optionnel)
            /*
            if (matiere.getDepartement() != null && matiere.getDepartement().getId() != null) {
                if (!departementRepo.existsById(matiere.getDepartement().getId())) {
                    System.out.println("Erreur update matière: Département non trouvé");
                    return null;
                }
                Optional<Departement> optDepartement = departementRepo.findById(matiere.getDepartement().getId());
                if (optDepartement.isPresent()) {
                    m.setDepartement(optDepartement.get());
                } else {
                    return null;
                }
            }
            */

            System.out.println("Update matière réussie ID " + id + ": " + m.getNom());
            return repo.save(m);
        }).orElse(null);
    }

    public boolean delete(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            System.out.println("Suppression matière ID " + id + " réussie"); // Log optionnel
            return true;
        }
        System.out.println("Erreur suppression: Matière non trouvée (ID: " + id + ")");
        return false;
    }
}