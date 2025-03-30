import { useState } from 'react';
import springAxios from 'axios';
import { Button, Typography } from '@mui/material';
import { API_CONFIG } from '@/config/apiConfig';

const ProfilePictureUpload = ({ email }: { email: string }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('profilePicture', selectedFile);
      try {
        await springAxios.post(`${API_CONFIG.BASE_URL}/api/v1/users/profile/upload-picture?email=${email}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('Profile picture uploaded successfully');
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    }
  };

  return (
    <div>
      <Typography variant="h6">Upload Profile Picture</Typography>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <Button onClick={handleUpload} variant="contained" color="primary">
        Upload
      </Button>
    </div>
  );
};

export default ProfilePictureUpload;
