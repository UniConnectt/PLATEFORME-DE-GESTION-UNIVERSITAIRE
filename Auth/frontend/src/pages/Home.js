import React from "react";
import {
  Avatar,
  Button,
  Box,
  AppBar,
  Toolbar,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import BookIcon from "@mui/icons-material/Book";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  
  const themeColors = {
    primary: "#2563EB",
    secondary: "#60A5FA",
    background: "#FFFFFF",
  };

  const heroImage = "https://www.francebleu.fr/pikapi/images/a2c5deb3-baa6-4d79-9ab6-43aff658e155/1200x680?webp=false";

  const features = [
    {
      icon: <PeopleIcon sx={{ fontSize: 40, color: themeColors.primary }} />,
      title: "Étudiants",
      description: "Gestion complète des profils",
    },
    {
      icon: <BookIcon sx={{ fontSize: 40, color: themeColors.primary }} />,
      title: "Cours",
      description: "Organisation pédagogique",
    },
    {
      icon: <AssessmentIcon sx={{ fontSize: 40, color: themeColors.primary }} />,
      title: "Analytiques",
      description: "Rapports et statistiques",
    },
  ];

  return (
    <Box sx={{ height: "100vh", background: themeColors.background, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header Compact - Espacement augmenté davantage */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "center", minHeight: 70, gap: 100 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                sx={{ 
                  width: 44, 
                  height: 44, 
                  bgcolor: themeColors.primary,
                  fontWeight: 700,
                  fontSize: "1rem"
                }}
              >
                PU
              </Avatar>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: "#111827", 
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  letterSpacing: "-0.02em"
                }}
              >
                Plateforme Universitaire
              </Typography>
            </Box>
            <Button
              startIcon={<LoginIcon />}
              onClick={() => navigate('/login')}
              sx={{
                background: themeColors.primary,
                color: "#FFFFFF",
                px: 3.5,
                py: 1,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "0.95rem",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                "&:hover": {
                  background: "#1D4ED8",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(37, 99, 235, 0.3)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Connexion
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content - Flex Layout */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <Container maxWidth="xl" sx={{ display: "flex", alignItems: "center", py: 4 }}>
          <Grid container spacing={4} sx={{ height: "100%" }}>
            {/* Left Side - Content - Centré */}
            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
              <Box sx={{ maxWidth: 500 }}>
                <Typography
                  variant="h1"
                  sx={{
                    color: "#0F172A",
                    fontWeight: 800,
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                    mb: 2,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                  }}
                >
                  Gestion Universitaire
                  <Box component="span" sx={{ display: "block", color: themeColors.primary, mt: 1 }}>
                    Intelligente
                  </Box>
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#64748B",
                    fontSize: "1.15rem",
                    fontWeight: 400,
                    lineHeight: 1.7,
                    mb: 5,
                    maxWidth: 500,
                  }}
                >
                  Plateforme moderne et intuitive pour la gestion complète de votre établissement universitaire.
                </Typography>

                {/* Features Compact - Déjà centrées */}
                <Grid container spacing={2} justifyContent="center">
                  {features.map((feature, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                      <Card
                        elevation={0}
                        sx={{
                          background: "#F8FAFC",
                          border: "2px solid #E2E8F0",
                          borderRadius: 2.5,
                          p: 2.5,
                          textAlign: "center",
                          transition: "all 0.3s ease",
                          height: "100%",
                          "&:hover": {
                            borderColor: themeColors.primary,
                            background: "#FFFFFF",
                            transform: "translateY(-4px)",
                            boxShadow: "0 12px 24px rgba(37, 99, 235, 0.1)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: "50%",
                            background: `linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mx: "auto",
                            mb: 2,
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <CardContent sx={{ p: 0 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: "#0F172A",
                              fontWeight: 700,
                              mb: 0.5,
                              fontSize: "1rem",
                            }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#64748B",
                              fontSize: "0.85rem",
                              lineHeight: 1.5,
                            }}
                          >
                            {feature.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>

            {/* Right Side - Image Visible - Inchangée */}
            <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", justifyContent: "center" }}>
              <Box
                sx={{
                  width: "100%",
                  height: "80%",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
                  position: "relative",
                  border: "3px solid #FFFFFF",
                }}
              >
                <Box
                  component="img"
                  src={heroImage}
                  alt="Université"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                {/* Overlay Gradient */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(96, 165, 250, 0.1) 100%)",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;