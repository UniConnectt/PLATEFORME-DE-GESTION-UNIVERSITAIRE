package org.example.Controller;

import org.example.Entity.Enseignant;
import org.example.Service.EnseignantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:4200"})
@RestController
@RequestMapping("/teachers") // ✅ Path fixe : /teachers pour matcher frontend
public class EnseignantController {
    private final EnseignantService enseignantService;

    public EnseignantController(EnseignantService enseignantService) {
        this.enseignantService = enseignantService;
    }

    @GetMapping // ✅ GET /teachers (liste tous)
    public List<Enseignant> getAll() {
        return enseignantService.getAllEnseignants();
    }

    @PostMapping // ✅ POST /teachers (ajout)
    public Enseignant addEnseignant(@RequestBody Enseignant enseignant) {
        return enseignantService.addEnseignant(enseignant);
    }

    @PutMapping("/{id}") // ✅ PUT /teachers/{id} (update)
    public Enseignant updateEnseignant(@PathVariable Long id, @RequestBody Enseignant enseignant) {
        return enseignantService.updateEnseignant(id, enseignant);
    }

    @DeleteMapping("/{id}") // ✅ DELETE /teachers/{id} (delete)
    public ResponseEntity<Void> deleteEnseignant(@PathVariable Long id) {
        try {
            System.out.println("DELETE appelé pour ID : " + id); // ✅ Log debug pour vérifier si endpoint hit
            enseignantService.deleteEnseignant(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            System.err.println("Erreur suppression : " + e.getMessage()); // Log erreur
            if (e.getMessage().contains("non trouvé")) { // ✅ 404 seulement pour "non trouvé"
                return ResponseEntity.notFound().build();
            } else { // FK ou autres erreurs : 409 Conflict ou 500 Internal
                return ResponseEntity.status(HttpStatus.CONFLICT).build(); // 409 pour FK constraint
            }
        }
    }
}