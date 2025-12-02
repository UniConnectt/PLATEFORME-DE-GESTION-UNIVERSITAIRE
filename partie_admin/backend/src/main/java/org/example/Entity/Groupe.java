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
        name = "groupe",
        uniqueConstraints = {
            @UniqueConstraint(columnNames = {"nom", "numero", "id_niveau"}) // ✅ Contrainte unique sur nom + numero + id_niveau pour éviter doublons
        }
)
public class Groupe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private Integer numero; // nouveau champ numéro

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_niveau", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Niveau niveau;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_specialite", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Specialite specialite;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}