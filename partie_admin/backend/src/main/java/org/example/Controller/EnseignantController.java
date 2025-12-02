package org.example.Controller;

import lombok.RequiredArgsConstructor;
import org.example.Entity.Enseignant;
import org.example.Service.EnseignantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teachers")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:4200"})
public class EnseignantController {

    @Autowired
    private EnseignantService service;

    // ----- LIST -----
    @GetMapping
    public List<Enseignant> getAll() {
        return service.getAll();
    }

    // ----- CREATE -----
    @PostMapping
    public ResponseEntity<?> createEnseignant(@RequestBody Enseignant enseignant) {
        try {
            Enseignant created = service.create(enseignant);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ----- UPDATE -----
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEnseignant(
            @PathVariable Long id,
            @RequestBody Enseignant enseignant) {
        try {
            Enseignant updated = service.update(id, enseignant);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ----- DELETE -----
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEnseignant(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}