package org.example.Entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@Entity
@Table(name = "specialite") // Assurer le nom de table si case-sensitive
public class Specialite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @ManyToOne
    @JoinColumn(name = "departement_id")
    @JsonIgnoreProperties({"specialites"})
    private Departement departement;

    @OneToMany(mappedBy = "specialite")
    @JsonIgnoreProperties({"specialite"})
    @JsonIgnore // Ignorer la liste en sérialisation JSON pour éviter cycles potentiels
    private List<Etudiant> etudiants;

    public Specialite() {}
    public Specialite(String nom, Departement departement) {
        this.nom = nom;
        this.departement = departement;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public Departement getDepartement() { return departement; }
    public void setDepartement(Departement departement) { this.departement = departement; }

    public List<Etudiant> getEtudiants() { return etudiants; }
    public void setEtudiants(List<Etudiant> etudiants) { this.etudiants = etudiants; }
}