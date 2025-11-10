package org.example.Controller;

import org.example.Entity.Matiere;
import org.example.Service.MatiereService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:4200"})
@RestController
@RequestMapping("/matieres")
public class MatiereController {
    @Autowired
    private MatiereService service;

    @GetMapping
    public List<Matiere> getAll() {
        return service.getAll();
    }

    @PostMapping
    public ResponseEntity<Matiere> add(@RequestBody Matiere m) {
        try {
            Matiere added = service.add(m);
            if (added == null) {
                return ResponseEntity.badRequest().build();
            }
            return ResponseEntity.ok(added);
        } catch (RuntimeException e) {
            System.err.println("Erreur ajout matière: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Matiere> update(@PathVariable Long id, @RequestBody Matiere m) {
        Matiere updated = service.update(id, m);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return service.delete(id)
                ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }
}