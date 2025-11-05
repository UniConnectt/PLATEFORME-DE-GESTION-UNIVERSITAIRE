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
        List<Specialite> specialites = service.getAll();
        System.out.println("Nombre de spécialités renvoyées: " + specialites.size()); // Log pour debug
        return specialites;
    }

    @GetMapping("/available")
    public List<Specialite> getAvailable() {
        return service.getAvailableSpecialites();
    }

    @PostMapping
    public Specialite create(@RequestBody Specialite s) {
        return service.create(s);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Specialite> update(@PathVariable Long id, @RequestBody Specialite s) {
        try {
            return ResponseEntity.ok(service.update(id, s));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}