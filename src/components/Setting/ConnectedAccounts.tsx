import React, { useState } from "react";
import { Paper, Box, Typography, Button } from "@mui/material";
import { Help as HelpIcon, Add as Plus } from "@mui/icons-material";
import Image from "next/image";  // Import the Image component from Next.js


const ConnectedAccounts = () => {
  const [connectedAccounts, setConnectedAccounts] = useState([
    { id: 1, name: "Google", connected: true, icon: "/google.png" },
    { id: 2, name: "Facebook", connected: false, icon: "/facebook.svg" },
    { id: 3, name: "Twitter", connected: true, icon: "/x.png" },
  ]);

  return (
    <Box>
      <Typography variant={"h4"} sx={{ paddingBottom: 2 }}>
        Connected Accounts
      </Typography>
      <Paper sx={{ padding: "1rem 2rem" }}>
        <Box display="flex" alignItems="center" gap={2}>
          <HelpIcon />
          <Typography variant="h6">Connected Accounts</Typography>
        </Box>
        {connectedAccounts.map((account) => (
          <Box
            key={account.id}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ marginBottom: "1rem" }}
          >
            <Box display="flex" alignItems="center">
              {/* Using next/image for optimization */}
              <Image
                src={account.icon}
                alt={account.name}
                width={24}
                height={24}
                style={{
                  objectFit: "cover",
                  borderRadius: "50%",
                  marginRight: "8px",
                }}
              />
              <Typography>{account.name}</Typography>
            </Box>
            <Button
              variant="contained"
              color={account.connected ? "success" : "secondary"}
              onClick={() =>
                setConnectedAccounts(
                  connectedAccounts.map((acc) =>
                    acc.id === account.id ? { ...acc, connected: !acc.connected } : acc
                  )
                )
              }
            >
              {account.connected ? "Connected" : "Connect"}
            </Button>
          </Box>
        ))}
        <Button startIcon={<Plus />} variant="outlined" color="primary">
          Add Account
        </Button>
      </Paper>
    </Box>
  );
};

export default ConnectedAccounts;
