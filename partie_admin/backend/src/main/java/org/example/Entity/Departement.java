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
@Table(
        name = "departement",
        uniqueConstraints = {
            @UniqueConstraint(columnNames = "nom"),
            @UniqueConstraint(columnNames = "abbreviation")
        } // Unicité sur nom et abbreviation
)
@JsonIgnoreProperties({"specialites", "matieres", "salles"})
public class Departement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String abbreviation;

    private LocalDateTime createdAt;

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

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
