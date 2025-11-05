package org.example.Entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "departement")
@JsonIgnoreProperties({"specialites", "matieres", "salles"})
public class Departement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    private String abbreviation;

    private LocalDateTime createdAt;

    // Supprimé @JsonManagedReference pour éviter les erreurs
    @OneToMany(mappedBy = "departement", cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Specialite> specialites;

    @OneToMany(mappedBy = "departement", cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Matiere> matieres;

    @OneToMany(mappedBy = "departement", cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Salle> salles;

    // Génération automatique de la date de création
    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
