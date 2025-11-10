import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Card, CardContent } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ import

const Login = () => {
  const navigate = useNavigate(); // ✅ initialiser la navigation

  // Mappage rôle -> cible de redirection
  // Si la valeur commence par "http" on redirige vers une URL externe (nouvelle app),
  // sinon on utilise navigate() pour une route interne de l'app actuelle.
  const roleRedirects = {
    admin: "http://localhost:5173", // modification partie_admin (Vite dev server par défaut)
    etudiant: "http://localhost:3002", // route interne (à adapter si vous avez une autre URL)
    enseignant: "/enseignant",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs !");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        toast.success(response.data.message);

        // ✅ récupérer le rôle depuis la réponse backend
        const role = response.data.user?.role;

        // ✅ sauvegarder dans le localStorage
        localStorage.setItem("role", role);

        // ✅ redirection selon le rôle — prend en charge URL externes et routes internes
        const target = roleRedirects[role] || "/";
        if (typeof target === "string" && target.startsWith("http")) {
          // redirection vers une autre application (ex: modification partie_admin sur Vite)
          window.location.href = target;
        } else {
          // route interne de l'application React actuelle
          navigate(target);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur serveur. Veuillez réessayer !!!");
    }
  };

  return (
    <Container maxWidth="sm">
      <ToastContainer />
      <Box
        sx={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Card sx={{ boxShadow: 4 }}>
          <CardContent sx={{ m: 3 }}>
            <Avatar sx={{ m: "auto", bgcolor: "primary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Connexion
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
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mot de passe"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Se connecter
              </Button>

              <Grid container>
                <Grid item>
                  <Link href="/forgotPassword" variant="body2" sx={{ textDecoration: "none" }}>
                    Mot de passe oublié ?
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;
