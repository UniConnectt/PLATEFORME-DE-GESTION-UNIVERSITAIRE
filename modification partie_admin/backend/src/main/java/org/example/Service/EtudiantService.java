package org.example.Service;

import org.example.Entity.Etudiant;
import org.example.Repository.EtudiantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EtudiantService {

    @Autowired
    private EtudiantRepository repo;

    public List<Etudiant> getAllEtudiants() {
        List<Etudiant> etudiants = repo.findAll();
        System.out.println("Nombre d'étudiants en base: " + etudiants.size()); // Log pour debug
        return etudiants;
    }

    public Etudiant addEtudiant(Etudiant e) {
        return repo.save(e);
    }

    public Etudiant updateEtudiant(Long id, Etudiant e) {
        Etudiant etudiant = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));
        etudiant.setNom(e.getNom());
        etudiant.setPrenom(e.getPrenom());
        etudiant.setEmail(e.getEmail());
        etudiant.setGroupe(e.getGroupe());
        etudiant.setSpecialite(e.getSpecialite());
        return repo.save(etudiant);
    }

    public void deleteEtudiant(Long id) {
        repo.deleteById(id);
    }
}