package org.example.Controller;

import lombok.RequiredArgsConstructor;
import org.example.Entity.Specialite;
import org.example.Service.SpecialiteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/specialites")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class SpecialiteController {

    private final SpecialiteService service;

    @GetMapping
    public List<Specialite> getAll() {
        return service.getAll();
    }

    @PostMapping
    public ResponseEntity<?> createSpecialite(@RequestBody Specialite specialite) {
        try {
            Specialite created = service.create(specialite);
            return ResponseEntity.ok(created); // ⚡ renvoie toujours le departement complet
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSpecialite(@PathVariable Long id, @RequestBody Specialite specialite) {
        try {
            Specialite updated = service.update(id, specialite);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSpecialite(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
