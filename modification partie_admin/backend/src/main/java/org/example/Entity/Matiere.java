package org.example.Entity;

import jakarta.persistence.*;

@Entity
public class Matiere {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @ManyToOne
    @JoinColumn(name = "id_niveau")
    private Niveau niveau;

    @ManyToOne
    @JoinColumn(name = "id_enseignant")
    private Enseignant enseignant;

    // --- Getters et Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public Niveau getNiveau() { return niveau; }
    public void setNiveau(Niveau niveau) { this.niveau = niveau; }

    public Enseignant getEnseignant() { return enseignant; }
    public void setEnseignant(Enseignant enseignant) { this.enseignant = enseignant; }
}
