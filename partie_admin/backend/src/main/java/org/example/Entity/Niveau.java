package org.example.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "niveau",
        uniqueConstraints = {
            @UniqueConstraint(columnNames = {"nom", "specialite_id"}) // ✅ Contrainte unique sur nom + specialite_id pour éviter doublons
        }
)
public class Niveau {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String abreviation; // ✅ nouvel attribut, nullable=false

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "specialite_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Specialite specialite;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}