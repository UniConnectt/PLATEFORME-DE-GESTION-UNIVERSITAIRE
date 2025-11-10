package org.example.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="emploi_temps")
public class EmploiTemps {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private LocalTime heureDebut;
    private LocalTime heureFin;

    @ManyToOne
    private Salle salle;

    @ManyToOne
    private Matiere matiere;

    @ManyToOne
    private Groupe groupe;

    @ManyToOne
    private Enseignant enseignant;
}
