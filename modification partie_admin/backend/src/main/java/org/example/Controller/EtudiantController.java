package org.example.Controller;

import org.example.Entity.Etudiant;
import org.example.Entity.Groupe;
import org.example.Entity.Specialite;
import org.example.Repository.GroupeRepository;
import org.example.Repository.SpecialiteRepository;
import org.example.Service.EtudiantService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000") // React
@RestController
@RequestMapping("/etudiants")
public class EtudiantController {

    private final EtudiantService service;
    private final GroupeRepository groupeRepository;
    private final SpecialiteRepository specialiteRepository;

    public EtudiantController(EtudiantService service, GroupeRepository groupeRepository, SpecialiteRepository specialiteRepository) {
        this.service = service;
        this.groupeRepository = groupeRepository;
        this.specialiteRepository = specialiteRepository;
    }

    @GetMapping("/all")
    public List<Etudiant> getAll() {
        List<Etudiant> etudiants = service.getAllEtudiants();
        System.out.println("Nombre d'étudiants renvoyés: " + etudiants.size()); // Log pour debug
        return etudiants;
    }

    @PostMapping
    public Etudiant addEtudiant(@RequestBody Etudiant e) {
        // Corrigé : Fetch les entités complètes par ID avant save
        Groupe groupe = groupeRepository.findById(e.getGroupe().getId())
                .orElseThrow(() -> new RuntimeException("Groupe non trouvé"));
        e.setGroupe(groupe);
        Specialite specialite = specialiteRepository.findById(e.getSpecialite().getId())
                .orElseThrow(() -> new RuntimeException("Spécialité non trouvée"));
        e.setSpecialite(specialite);
        Etudiant saved = service.addEtudiant(e);
        System.out.println("Étudiant ajouté: " + saved.getNom()); // Log pour debug
        return saved;
    }

    @PutMapping("/{id}")
    public Etudiant updateEtudiant(@PathVariable Long id, @RequestBody Etudiant e) {
        // Corrigé : Fetch les entités complètes par ID avant update
        Groupe groupe = groupeRepository.findById(e.getGroupe().getId())
                .orElseThrow(() -> new RuntimeException("Groupe non trouvé"));
        e.setGroupe(groupe);
        Specialite specialite = specialiteRepository.findById(e.getSpecialite().getId())
                .orElseThrow(() -> new RuntimeException("Spécialité non trouvée"));
        e.setSpecialite(specialite);
        return service.updateEtudiant(id, e);
    }

    @DeleteMapping("/{id}")
    public void deleteEtudiant(@PathVariable Long id) {
        service.deleteEtudiant(id);
    }
}