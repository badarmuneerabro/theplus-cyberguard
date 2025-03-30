/* // src/components/ui/card.tsx
import React from 'react';
import { Card as MuiCard, CardContent, CardHeader, Typography } from '@mui/material';

const Card = ({ children }) => (
  <MuiCard sx={{ marginBottom: 2 }}>
    <CardHeader title={<Typography variant="h6">{children}</Typography>} />
    <CardContent>{children}</CardContent>
  </MuiCard>
);

export default Card;
 */