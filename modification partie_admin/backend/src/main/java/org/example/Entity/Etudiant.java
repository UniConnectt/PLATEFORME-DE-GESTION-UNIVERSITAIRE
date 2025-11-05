package org.example.Entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "etudiant") // Assurer le nom de table si case-sensitive
public class Etudiant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private String email;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "groupe_id")
    @JsonIgnoreProperties("etudiants") // évite boucle infinie si Groupe a liste d'étudiants
    private Groupe groupe;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "specialite_id")
    @JsonIgnoreProperties("etudiants") // idem
    private Specialite specialite;

    // getters et setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Groupe getGroupe() { return groupe; }
    public void setGroupe(Groupe groupe) { this.groupe = groupe; }
    public Specialite getSpecialite() { return specialite; }
    public void setSpecialite(Specialite specialite) { this.specialite = specialite; }
}