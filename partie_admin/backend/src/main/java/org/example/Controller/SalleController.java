package org.example.Controller;

import lombok.RequiredArgsConstructor;
import org.example.Entity.Salle;
import org.example.Entity.Departement;
import org.example.Repository.DepartementRepository;
import org.example.Service.SalleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/salles")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}) // autorise front sur 3000 et 3001
public class SalleController {

    private final SalleService salleService;
    private final DepartementRepository departementRepository;

    @GetMapping
    public ResponseEntity<List<Salle>> getAll() {
        try {
            return ResponseEntity.ok(salleService.getAll());
        } catch (Exception e) {
            System.err.println("Erreur GET all salles: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/codes")
    public ResponseEntity<List<String>> getCodes() {
        try {
            return ResponseEntity.ok(salleService.getAllCodes());
        } catch (Exception e) {
            System.err.println("Erreur GET codes salles: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/types")
    public ResponseEntity<List<String>> getTypes() {
        try {
            return ResponseEntity.ok(salleService.getAllTypes());
        } catch (Exception e) {
            System.err.println("Erreur GET types salles: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping(consumes = "application/json")
    public ResponseEntity<?> create(@RequestBody Salle salle) {
        try {
            System.out.println("CREATE - Payload (raw): " + salle); // utile pour debug
            if (salle.getDepartement() == null || salle.getDepartement().getId() == null) {
                throw new RuntimeException("❌ Le département est obligatoire et doit avoir un ID valide.");
            }
            Departement departement = departementRepository.findById(salle.getDepartement().getId())
                    .orElseThrow(() -> new RuntimeException("❌ Département non trouvé."));
            salle.setDepartement(departement);
            Salle saved = salleService.save(salle);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            System.err.println("Erreur CREATE salle: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Erreur inattendue CREATE salle: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erreur interne serveur.");
        }
    }

    @PutMapping(value = "/{id}", consumes = "application/json")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Salle salle) {
        try {
            System.out.println("UPDATE ID=" + id + " - Payload: " + salle);
            if (salle.getDepartement() == null || salle.getDepartement().getId() == null) {
                throw new RuntimeException("❌ Le département est obligatoire et doit avoir un ID valide.");
            }
            Departement departement = departementRepository.findById(salle.getDepartement().getId())
                    .orElseThrow(() -> new RuntimeException("❌ Département non trouvé."));
            salle.setDepartement(departement);
            Salle updated = salleService.update(id, salle);
            if (updated == null) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            System.err.println("Erreur UPDATE salle ID=" + id + ": " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Erreur inattendue UPDATE salle ID=" + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erreur interne serveur.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            boolean deleted = salleService.delete(id);
            if (!deleted) return ResponseEntity.notFound().build();
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            System.err.println("Erreur DELETE salle ID=" + id + ": " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Erreur inattendue DELETE salle ID=" + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erreur interne serveur.");
        }
    }
}