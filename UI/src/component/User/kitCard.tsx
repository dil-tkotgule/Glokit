import React from 'react';
// import image from '../../../public/GlobalLogic3_300822063732.jpg';
// import image2 from '../../../public/GlobalLogic_2.jpg'
import {useNavigate } from 'react-router-dom'

import {
    Card,
    CardMedia,
    Box,
    Typography,
    Button,
    CardContent
} from '@mui/material';


const KitCard: React.FC = () => {
    const navigate = useNavigate();
    
    const handleClick=(id:string)=>{
        navigate(`/kit/${id}`)
    }
    return (
        <Box 
        sx={{
            display:'flex',
            justifyContent:'center',
            marginBottom:'2rem',
            marginTop:'2rem'
        }}
        >

            <Card
                sx={{
                    width: 250,
                    height:250,
                    borderRadius: 3,
                    boxShadow: 4,
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.03)',
                    },
                    overflow: 'hidden',
                    marginRight:'2vw'
                }}
            >
                {/* Image with Hover Button */}
                <Box
                    sx={{
                        position: 'relative',
                        '&:hover .hover-button': {
                            opacity: 1,
                        },
                    }}
                >
                    <CardMedia
                        component="img"
                        height="200"
                        image={''}
                        alt="Kit Image"
                        sx={{ objectFit: 'cover' }}
                    />

                    {/* Hover Overlay Button */}
                    <Box
                        className="hover-button"
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            bgcolor: 'rgba(0, 0, 0, 0.4)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity: 0,
                            transition: 'opacity 0.3s ease-in-out',
                        }}
                    >
                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: '#1976d2',
                                color: '#fff',
                                px: 3,
                                py: 1,
                                fontWeight: 600,
                                borderRadius: 2,
                                '&:hover': {
                                    bgcolor: '#125ea4',
                                },
                            }}
                            onClick={()=>{handleClick('1')}}
                        >
                            View Kit
                        </Button>
                    </Box>
                </Box>

                {/* Title Section */}
                <CardContent
                    sx={{
                        backgroundColor: '#f8f9fa',
                        textAlign: 'center',
                        py: 2,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            fontSize: '1.4rem',
                            color: '#333',
                        }}
                    >
                        Welcome Kit 1
                    </Typography>
                </CardContent>
            </Card>
            <Card
                sx={{
                    width: 250,
                    height:250,
                    borderRadius: 3,
                    boxShadow: 4,
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.03)',
                    },
                    overflow: 'hidden',
                }}
            >
                {/* Image with Hover Button */}
                <Box
                    sx={{
                        position: 'relative',
                        '&:hover .hover-button': {
                            opacity: 1,
                        },
                    }}
                >
                    <CardMedia
                        component="img"
                        height="200"
                        image={''}
                        alt="Kit Image"
                        sx={{ objectFit: 'cover' }}
                    />

                    {/* Hover Overlay Button */}
                    <Box
                        className="hover-button"
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            bgcolor: 'rgba(0, 0, 0, 0.4)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity: 0,
                            transition: 'opacity 0.3s ease-in-out',
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={()=>{handleClick('2')}}
                            sx={{
                                bgcolor: '#1976d2',
                                color: '#fff',
                                px: 3,
                                py: 1,
                                fontWeight: 600,
                                borderRadius: 2,
                                '&:hover': {
                                    bgcolor: '#125ea4',
                                },
                            }}
                        >
                            View Kit
                        </Button>
                    </Box>
                </Box>

                {/* Title Section */}
                <CardContent
                    sx={{
                        backgroundColor: '#f8f9fa',
                        textAlign: 'center',
                        mb:7
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            fontSize: '1.4rem',
                            color: '#333',
                        }}
                    >
                        Welcome Kit 2
                    </Typography>
                </CardContent>
            </Card>
        </Box>

    );
};

export default KitCard;
