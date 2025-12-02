package org.example.Controller;

import lombok.RequiredArgsConstructor;
import org.example.Entity.Groupe;
import org.example.Entity.Niveau;
import org.example.Entity.Specialite;
import org.example.Repository.NiveauRepository;
import org.example.Repository.SpecialiteRepository;
import org.example.Service.GroupeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/groupes")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}) // autorise front sur 3000 et 3001
public class GroupeController {

    private final GroupeService groupeService;
    private final NiveauRepository niveauRepository;
    private final SpecialiteRepository specialiteRepository;

    @GetMapping
    public ResponseEntity<List<Groupe>> getAllGroupes() {
        try {
            return ResponseEntity.ok(groupeService.getAllGroupes());
        } catch (Exception e) {
            System.err.println("Erreur GET all groupes: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countGroupes() {
        try {
            return ResponseEntity.ok(groupeService.countGroupes());
        } catch (Exception e) {
            System.err.println("Erreur GET count groupes: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping(consumes = "application/json")
    public ResponseEntity<?> addGroupe(@RequestBody Groupe g) {
        try {
            System.out.println("CREATE - Payload (raw): " + g); // utile pour debug
            if (g.getNiveau() == null || g.getNiveau().getId() == null) {
                throw new RuntimeException("❌ Le niveau est obligatoire et doit avoir un ID valide.");
            }
            Niveau niveau = niveauRepository.findById(g.getNiveau().getId())
                    .orElseThrow(() -> new RuntimeException("❌ Niveau non trouvé."));
            g.setNiveau(niveau);
            if (g.getSpecialite() == null || g.getSpecialite().getId() == null) {
                throw new RuntimeException("❌ La spécialité est obligatoire et doit avoir un ID valide.");
            }
            Specialite specialite = specialiteRepository.findById(g.getSpecialite().getId())
                    .orElseThrow(() -> new RuntimeException("❌ Spécialité non trouvée."));
            g.setSpecialite(specialite);
            Groupe saved = groupeService.addGroupe(g);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            System.err.println("Erreur CREATE groupe: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Erreur inattendue CREATE groupe: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erreur interne serveur.");
        }
    }

    @PutMapping(value = "/{id}", consumes = "application/json")
    public ResponseEntity<?> updateGroupe(@PathVariable Long id, @RequestBody Groupe g) {
        try {
            System.out.println("UPDATE ID=" + id + " - Payload: " + g);
            if (g.getNiveau() == null || g.getNiveau().getId() == null) {
                throw new RuntimeException("❌ Le niveau est obligatoire et doit avoir un ID valide.");
            }
            Niveau niveau = niveauRepository.findById(g.getNiveau().getId())
                    .orElseThrow(() -> new RuntimeException("❌ Niveau non trouvé."));
            g.setNiveau(niveau);
            if (g.getSpecialite() == null || g.getSpecialite().getId() == null) {
                throw new RuntimeException("❌ La spécialité est obligatoire et doit avoir un ID valide.");
            }
            Specialite specialite = specialiteRepository.findById(g.getSpecialite().getId())
                    .orElseThrow(() -> new RuntimeException("❌ Spécialité non trouvée."));
            g.setSpecialite(specialite);
            Groupe updated = groupeService.updateGroupe(id, g);
            if (updated == null) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            System.err.println("Erreur UPDATE groupe ID=" + id + ": " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Erreur inattendue UPDATE groupe ID=" + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erreur interne serveur.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGroupe(@PathVariable Long id) {
        try {
            if (groupeService.deleteGroupe(id)) return ResponseEntity.noContent().build();
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            System.err.println("Erreur DELETE groupe ID=" + id + ": " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Erreur inattendue DELETE groupe ID=" + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erreur interne serveur.");
        }
    }
}