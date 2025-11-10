//ResetPassword.js 

import { React } from "react";
import {
    useSearchParams,
    useNavigate
} from "react-router-dom";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockResetIcon from "@mui/icons-material/LockReset";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {
    Card,
    CardContent
} from "@mui/material";
import { toast } from "react-toastify";
import { useLayoutEffect } from "react";
import { useState } from "react";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    let navigate = useNavigate();
    const token = searchParams.get("token");
    const [userId, setUserId] = useState(null);

    useLayoutEffect(() => {
        const verifyToken = async () => {
            const res = await axios.get(
                "http://localhost:3000/api/auth/verifyResetToken",
                {
                    params: { token: token }
                }
            );
            if (res.data.success === false) {
                toast.error(res.data.message, {
                    autoClose: 5000,
                    position: "top-right",
                });
                setTimeout(() => {
                    navigate("/forgotPassword");
                }, 2000);
                setUserId(null);
            } else {
                toast.success(res.data.message, {
                    autoClose: 5000,
                    position: "top-right",
                });
                setUserId(res.data.userId);
            }
        };
        verifyToken();
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const newpassword = data.get("newpassword");
        const confirmpassword = data.get("confirmpassword");
        if (newpassword !== confirmpassword)
            toast.error(
                `New Password and Confirm Password do not match !`, 
                {
                    autoClose: 5000,
                    position: "top-right",
                });
        else {
            const res = await axios.post(
                "http://localhost:3000/api/auth/resetPassword"
            , {
                password: newpassword,
                token: token,
                userId: userId,
            });
            if (res.data.success === false) {
                toast.error(res.data.message, {
                    autoClose: 5000,
                    position: "top-right",
                });
            } else {
                toast.success(res.data.message, {
                    autoClose: 5000,
                    position: "top-right",
                });
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Card sx={{ boxShadow: "4" }}>
                    <CardContent sx={{ m: 3 }}>
                        <Avatar sx={{ m: "auto", 
                            bgcolor: "primary.main" }}>
                            <LockResetIcon />
                        </Avatar>
                        <Typography component="h1" 
                                    variant="h5" 
                                    sx={{ mt: 1 }}>
                            Reset Password
                        </Typography>

                        <Box component="form"
                                onSubmit={handleSubmit} 
                                sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                type="password"
                                name="newpassword"
                                id="newpassword"
                                label="New Password"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                type="password"
                                name="confirmpassword"
                                id="confirmpassword"
                                label="Confirm Password"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Submit
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default ResetPassword;