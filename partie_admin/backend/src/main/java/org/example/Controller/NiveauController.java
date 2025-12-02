package org.example.Controller;

import lombok.RequiredArgsConstructor;
import org.example.Entity.Niveau;
import org.example.Entity.Specialite;
import org.example.Repository.SpecialiteRepository;
import org.example.Service.NiveauService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/niveaux")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}) // autorise front sur 3000 et 3001
public class NiveauController {

    private final NiveauService niveauService;
    private final SpecialiteRepository specialiteRepository;

    @GetMapping
    public ResponseEntity<List<Niveau>> getAll() {
        try {
            return ResponseEntity.ok(niveauService.getAllNiveaux());
        } catch (Exception e) {
            System.err.println("Erreur GET all niveaux: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping(consumes = "application/json")
    public ResponseEntity<?> addNiveau(@RequestBody Niveau niveau) {
        try {
            System.out.println("CREATE - Payload (raw): " + niveau); // utile pour debug
            if (niveau.getSpecialite() == null || niveau.getSpecialite().getId() == null) {
                throw new RuntimeException("❌ La spécialité est obligatoire et doit avoir un ID valide.");
            }
            Specialite specialite = specialiteRepository.findById(niveau.getSpecialite().getId())
                    .orElseThrow(() -> new RuntimeException("❌ Spécialité non trouvée."));
            niveau.setSpecialite(specialite);
            Niveau saved = niveauService.ajouterNiveau(niveau);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            System.err.println("Erreur CREATE niveau: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Erreur inattendue CREATE niveau: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erreur interne serveur.");
        }
    }

    @PutMapping(value = "/{id}", consumes = "application/json")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Niveau niveau) {
        try {
            System.out.println("UPDATE ID=" + id + " - Payload: " + niveau);
            if (niveau.getSpecialite() == null || niveau.getSpecialite().getId() == null) {
                throw new RuntimeException("❌ La spécialité est obligatoire et doit avoir un ID valide.");
            }
            Specialite specialite = specialiteRepository.findById(niveau.getSpecialite().getId())
                    .orElseThrow(() -> new RuntimeException("❌ Spécialité non trouvée."));
            niveau.setSpecialite(specialite);
            Niveau updated = niveauService.modifierNiveau(id, niveau);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            System.err.println("Erreur UPDATE niveau ID=" + id + ": " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Erreur inattendue UPDATE niveau ID=" + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erreur interne serveur.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            niveauService.supprimerNiveau(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            System.err.println("Erreur DELETE niveau ID=" + id + ": " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Erreur inattendue DELETE niveau ID=" + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erreur interne serveur.");
        }
    }
}