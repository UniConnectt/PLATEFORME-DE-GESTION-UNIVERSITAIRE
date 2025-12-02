const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const connection = require("../db.js");
const NumSaltRounds = Number(process.env.NO_OF_SALT_ROUNDS);
require("dotenv").config();

const router = express.Router();
const {sendEmail} = require("../utils/email");

// -------------------- REGISTER --------------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Veuillez remplir tous les champs" });
    }

    const query = "SELECT * FROM users WHERE email = ?";

    connection.query(query, [email], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Erreur serveur" });
      }

      if (results.length > 0) {
        return res.json({ success: false, message: "Utilisateur déjà enregistré" });
      }

      const salt = await bcrypt.genSalt(NumSaltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);

      const insertQuery = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
      connection.query(insertQuery, [name, email, hashedPassword], async (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: "Erreur serveur" });
        }
        await sendEmail({
          email: req.body.email,
          subject: "Bienvenue à bord !",
          message: `
            <h1>Bonjour ${req.body.name},</h1>
            <p>Merci de vous être inscrit sur notre plateforme.</p>
            <p>Nous sommes ravis de vous avoir avec nous.</p>
            <br/>
            <p>Cordialement,</p>
            <p>L'équipe de UnitConnect</p>
          `
        })
        return res.json({ success: true, message: "Inscription réussie" });
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// -------------------- LOGIN --------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const query = "SELECT * FROM users WHERE email = ?";

    connection.query(query, [email], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Erreur serveur" });
      }

      if (results.length === 0) {
        return res.json({ success: false, message: "Utilisateur non trouvé" });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.json({ success: false, message: "Mot de passe incorrect" });
      }

      // Retourner l'id, email et rôle
      return res.json({ 
        success: true, 
        message: "Connexion réussie", 
        user: { 
          id: user.id, 
          email: user.email,
          role: user.role // <- ajouter le rôle ici
        } 
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// -------------------- FORGOT PASSWORD --------------------
router.post("/forgotPassword", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Veuillez fournir un email" });
    }

    const query = "SELECT * FROM users WHERE email = ?";

    connection.query(query, [email], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Erreur serveur" });
      }

      if (results.length === 0) {
        return res.json({ success: false, message: "Utilisateur non trouvé" });
      }

      const user = results[0];

      const token = crypto.randomBytes(20).toString("hex");
      const expiresAt = new Date(Date.now() + 3600000); // 1 heure from now

      const insertTokenQuery = "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?";
      connection.query(insertTokenQuery, [token, expiresAt, user.id], async (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: "Erreur serveur" });
        }

        const resetLink = `http://localhost:3001/resetPassword?token=${token}`;
        await sendEmail({
          email: user.email,
          subject: "Réinitialisation du mot de passe",
          message: `
            <h1>Bonjour ${user.name},</h1>
            <p>Vous avez demandé une réinitialisation de votre mot de passe.</p>
            <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
            <a href="${resetLink}">Réinitialiser le mot de passe</a>
            <br/>
            <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
            <br/>
            <p>Cordialement,</p>
            <p>L'équipe de UnitConnect</p>
          `
        });

        return res.json({ success: true, message: "Lien de réinitialisation du mot de passe envoyé à votre email" });
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

router.get("/verifyResetToken", async (req, res) => {
  try {
    const { token } = req.query;
    const query = "SELECT * FROM users WHERE reset_token = ?";

    connection.query(query, [token], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Erreur serveur" });
      }

      if (results.length === 0) {
        return res.json({ success: false, message: "Lien de réinitialisation du mot de passe invalide" });
      }

      const user = results[0];
      const currDateTime = new Date();

      if (currDateTime > user.reset_token_expiry) {
        return res.json({ success: false, message: "Le lien de réinitialisation du mot de passe a expiré" });
      }

      return res.json({
        success: true,
        message: "Lien de réinitialisation du mot de passe valide",
        userId: user.id
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

router.post("/resetPassword", async (req, res) => {
  try {
    const { password, token, userId } = req.body;

    if (!password || !token || !userId) {
      return res.status(400).json({ success: false, message: "Données manquantes" });
    }

    const query = "SELECT * FROM users WHERE id = ? AND reset_token = ?";

    connection.query(query, [userId, token], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Erreur serveur" });
      }

      if (results.length === 0) {
        return res.json({ success: false, message: "Lien de réinitialisation du mot de passe invalide" });
      }

      const user = results[0];
      const currDateTime = new Date();

      if (currDateTime > user.reset_token_expiry) {
        return res.json({ success: false, message: "Le lien de réinitialisation du mot de passe a expiré" });
      }

      const salt = await bcrypt.genSalt(NumSaltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);

      const updatePasswordQuery = "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?";
      connection.query(updatePasswordQuery, [hashedPassword, user.id], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: "Erreur serveur" });
        }

        return res.json({ success: true, message: "Mot de passe réinitialisé avec succès" });
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

module.exports = router;