package org.example.Controller;

import lombok.RequiredArgsConstructor;
import org.example.Entity.Etudiant;
import org.example.Service.EtudiantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/etudiants")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}) // autorise front sur 3000 et 3001
public class EtudiantController {
    private final EtudiantService service;

    @GetMapping("/all")
    public ResponseEntity<List<Etudiant>> getAll() {
        try {
            List<Etudiant> etudiants = service.getAll();
            return ResponseEntity.ok(etudiants);
        } catch (Exception e) {
            System.err.println("Erreur GET all etudiants: " + e.getMessage());
            e.printStackTrace(); // Pour debug complet
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping(consumes = "application/json")
    public ResponseEntity<?> createEtudiant(@RequestBody Etudiant etudiant) {
        try {
            System.out.println("CREATE - Payload (raw): " + etudiant); // utile pour debug
            Etudiant created = service.create(etudiant);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            System.err.println("Erreur CREATE etudiant: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Erreur inattendue CREATE etudiant: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erreur interne serveur.");
        }
    }

    @PutMapping(value = "/{id}", consumes = "application/json")
    public ResponseEntity<?> updateEtudiant(@PathVariable Long id, @RequestBody Etudiant etudiant) {
        try {
            System.out.println("UPDATE ID=" + id + " - Payload: " + etudiant);
            Etudiant updated = service.update(id, etudiant);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            System.err.println("Erreur UPDATE etudiant ID=" + id + ": " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Erreur inattendue UPDATE etudiant ID=" + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erreur interne serveur.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEtudiant(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            System.err.println("Erreur DELETE etudiant ID=" + id + ": " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Erreur inattendue DELETE etudiant ID=" + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erreur interne serveur.");
        }
    }
}