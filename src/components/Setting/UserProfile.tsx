import React from "react";
import { Avatar, Box, Button, Typography, Grid, Paper } from "@mui/material";
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';

interface UserData {
  name?: string;
  email?: string;
  image?: string;
}

const UserProfile = () => {
  const { user } = useAuth();
  const router = useRouter();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>You need to be authenticated to view this page.</div>;
  }

  const handleEditProfile = () => {
    router.push('/dashboard/profilePage'); // Corrected route to navigate to the profile page
  };

  return (
    <Paper sx={{ padding: "1rem 2rem" }}>
      <Box sx={{ textAlign: "center" }}>
      
        <Typography variant="h5" sx={{ textAlign: "left"}}>
          Profile
        </Typography>
        <Grid container justifyContent="center" spacing={3}>
          <Grid item>
            <Avatar
              sx={{
                height: 100,
                width: 100,
              }}
              src={user.image as string}
              alt={user.name as string}
            />
          </Grid>
        </Grid>

        <Typography variant="h5" sx={{ marginTop: 2 }}>
          {user.name}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {user.email}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 4 }}
          onClick={handleEditProfile}
        >
          Edit Profile
        </Button>
      </Box>
    </Paper>
  );
};

export default UserProfile;
