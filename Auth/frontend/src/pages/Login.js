// src/pages/Login.js
import React from "react";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Paper from "@mui/material/Paper";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// Couleurs unifiées avec la page Home
const DEFAULT_THEME = {
  primary: "#2563EB",
  secondary: "#60A5FA",
  background: "#FFFFFF",
  cardBg: "rgba(255, 255, 255, 0.95)",
};

const Login = ({ themeColors: propThemeColors, onClose }) => {
  const navigate = useNavigate();
  const themeColors = propThemeColors || DEFAULT_THEME;

  const roleRedirects = {
    admin: "http://localhost:5173",
    etudiant: "http://localhost:3002",
    enseignant: "http://localhost:3003",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = data.get("email")?.trim();
    const password = data.get("password")?.trim();

    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs !");
      return;
    }
    if (!email.includes("@")) {
      toast.error("Veuillez entrer une adresse e-mail valide !");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        toast.success(response.data.message, { autoClose: 2000 });
        const role = response.data.user?.role;
        localStorage.setItem("role", role);
        const target = roleRedirects[role] || "/";

        if (target.startsWith("http")) {
          window.location.href = target;
        } else {
          navigate(target);
        }
      } else {
        toast.error(response.data.message || "Échec de connexion");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Erreur serveur. Veuillez réessayer !");
    }
  };

  if (!onClose) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${themeColors.primary}20, ${themeColors.secondary}10)`,
          p: 3,
        }}
      >
        <LoginContent
          themeColors={themeColors}
          onClose={onClose}
          handleSubmit={handleSubmit}
        />
      </Box>
    );
  }

  return (
    <LoginContent
      themeColors={themeColors}
      onClose={onClose}
      handleSubmit={handleSubmit}
    />
  );
};

const LoginContent = ({ themeColors, onClose, handleSubmit }) => {
  const navigate = useNavigate();

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <Paper
        elevation={0}
        sx={{
          position: "relative",
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          backdropFilter: "blur(20px)",
          background: themeColors.cardBg,
          border: "1px solid rgba(255, 255, 255, 0.2)",
          width: "100%",
          maxWidth: 500,
          mx: "auto",
          boxShadow: "0 20px 25px rgba(0,0,0,0.08)",
        }}
      >
        {onClose && (
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        )}

        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: themeColors.primary,
            }}
          >
            <LockOutlinedIcon />
          </Avatar>
        </Box>

        <Typography
          component="h1"
          variant="h5"
          align="center"
          sx={{ mb: 3, color: themeColors.primary, fontWeight: 600 }}
        >
          Accès Sécurisé
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Adresse e-mail"
            name="email"
            autoComplete="email"
            autoFocus
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "white",
                "& fieldset": { borderColor: `${themeColors.primary}80` },
                "&:hover fieldset": { borderColor: themeColors.primary },
                "&.Mui-focused fieldset": {
                  borderColor: themeColors.primary,
                  borderWidth: 2,
                },
              },
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Mot de passe"
            name="password"
            type="password"
            autoComplete="current-password"
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "white",
                "& fieldset": { borderColor: `${themeColors.primary}80` },
                "&:hover fieldset": { borderColor: themeColors.primary },
                "&.Mui-focused fieldset": {
                  borderColor: themeColors.primary,
                  borderWidth: 2,
                },
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              py: 1.5,
              borderRadius: 2,
              background: themeColors.primary,
              fontWeight: 600,
              "&:hover": {
                background: "#1342c4ff",
                transform: "translateY(-1px)",
              },
            }}
          >
            Se Connecter
          </Button>

          {/* Ligne avec Retour et Mot de passe oublié */}
          <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
            <Grid item>
              <Link
                onClick={() => navigate("/")}
                sx={{
                  cursor: "pointer",
                  color: themeColors.primary,
                  fontWeight: 500,
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Retour à l'accueil
              </Link>
            </Grid>

            <Grid item>
              <Link
                href="/forgotPassword"
                sx={{
                  textDecoration: "none",
                  color: themeColors.primary,
                  fontWeight: 500,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Mot de passe oublié ?
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  );
};

export default Login;
