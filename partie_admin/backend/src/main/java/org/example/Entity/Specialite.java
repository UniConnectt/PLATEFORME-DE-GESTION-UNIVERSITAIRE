package org.example.Entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "specialite",
        uniqueConstraints = {
            @UniqueConstraint(columnNames = "nom"),
            @UniqueConstraint(columnNames = "abbreviation")
        }
)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Specialite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String abbreviation;

    @ManyToOne(fetch = FetchType.EAGER) // ⚠️ Passé en EAGER pour que le département soit chargé
    @JoinColumn(name = "departement_id")
    @JsonIgnoreProperties({"specialites"}) // empêche boucle infinie
    private Departement departement;

    @OneToMany(mappedBy = "specialite", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Etudiant> etudiants;

    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
