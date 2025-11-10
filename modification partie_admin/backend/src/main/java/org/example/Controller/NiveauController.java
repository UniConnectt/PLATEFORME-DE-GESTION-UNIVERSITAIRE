package org.example.Controller;

import org.example.Entity.Niveau;
import org.example.Entity.Specialite;
import org.example.Repository.SpecialiteRepository;
import org.example.Service.NiveauService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/niveaux")
@CrossOrigin(origins = "http://localhost:3000") // Corrigé : Changé de 4200 à 3000 pour matcher React
public class NiveauController {

    private final NiveauService niveauService;
    private final SpecialiteRepository specialiteRepository;

    public NiveauController(NiveauService niveauService, SpecialiteRepository specialiteRepository) {
        this.niveauService = niveauService;
        this.specialiteRepository = specialiteRepository;
    }

    @PostMapping
    public ResponseEntity<Niveau> addNiveau(@RequestBody Niveau niveau) {
        Specialite specialite = specialiteRepository.findById(niveau.getSpecialite().getId())
                .orElseThrow(() -> new RuntimeException("Spécialité non trouvée"));
        niveau.setSpecialite(specialite);
        Niveau saved = niveauService.ajouterNiveau(niveau);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public List<Niveau> getAll() {
        List<Niveau> niveaux = niveauService.getAllNiveaux();
        System.out.println("Nombre de niveaux renvoyés: " + niveaux.size()); // Log pour debug
        return niveaux;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Niveau> update(@PathVariable Long id, @RequestBody Niveau niveau) {
        try {
            Specialite specialite = specialiteRepository.findById(niveau.getSpecialite().getId())
                    .orElseThrow(() -> new RuntimeException("Spécialité non trouvée"));
            niveau.setSpecialite(specialite);
            return ResponseEntity.ok(niveauService.modifierNiveau(id, niveau));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            niveauService.supprimerNiveau(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}