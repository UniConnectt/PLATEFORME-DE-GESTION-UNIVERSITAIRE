package org.example.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "niveau") // Assurer le nom de table si case-sensitive
public class Niveau {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @ManyToOne(fetch = FetchType.EAGER) // Eager pour charger specialite par défaut
    @JoinColumn(name = "specialite_id")
    private Specialite specialite;
}