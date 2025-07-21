// src/component/ImagePopup.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Card,
  CardMedia,
} from "@mui/material";
import {
  Close as CloseIcon,
  ArrowBackIos,
  ArrowForwardIos,
  ZoomIn,
  ZoomOut,
  Fullscreen,
} from "@mui/icons-material";
import axios from "axios";

interface IProductThumbnail {
  product_id: number;
  product_name: string;
  product_description: string;
  product_quantity: number;
  product_category_id: number;
  category_name: string;
  image_urls: string; // Comma-separated string of image URLs
  file_sizes: string; // Comma-separated string of file sizes
  image_url: string;
  file_size: number;
  created_at: Date;
  updated_at: Date;
}

interface ImagePopupProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  initialImageUrl?: string;
}

const ImagePopup: React.FC<ImagePopupProps> = ({
  open,
  onClose,
  productId,
  productName,
  initialImageUrl,
}) => {
  console.log(initialImageUrl)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (open && productId) {
      fetchProductImages();
    }
  }, [open, productId]);

  useEffect(() => {
    // Reset zoom when changing images
    setZoom(1);
  }, [currentIndex]);

  const fetchProductImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost:3000/app/product/get/${productId}`,
        { withCredentials: true }
      );
      const data = response.data.data;
      console.log("Fetched product images:", data);

      if (Array.isArray(data) && data.length > 0) {
        const imageUrls = data.flatMap((item: IProductThumbnail) => {
          const urls = item.image_urls.split(",").map((url) =>
            url.includes("uploads")
              ? `http://localhost:3000/${url
                  .substring(url.indexOf("uploads"))
                  .replace(/\\/g, "/")}`
              : url
          );
          return urls;
        });
        
        setImages(imageUrls);
        
        // If initialImageUrl is provided, try to find its index
        if (initialImageUrl) {
          const processedInitialUrl = initialImageUrl.includes("uploads")
            ? `http://localhost:3000/${initialImageUrl
                .substring(initialImageUrl.indexOf("uploads"))
                .replace(/\\/g, "/")}`
            : initialImageUrl;
          
          const index = imageUrls.findIndex(url => url === processedInitialUrl);
          if (index !== -1) {
            setCurrentIndex(index);
          }
        }
      } else {
        setImages([]);
        setError("No images found for this product");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load product images");
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageLoadStart = () => {
    setImageLoading(true);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
        handlePrevious();
        break;
      case "ArrowRight":
        handleNext();
        break;
      case "Escape":
        onClose();
        break;
      case "+":
      case "=":
        handleZoomIn();
        break;
      case "-":
        handleZoomOut();
        break;
    }
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullScreen={isFullscreen}
      PaperProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.95)",
          maxWidth: isFullscreen ? "100%" : "90vw",
          maxHeight: isFullscreen ? "100%" : "90vh",
          width: isFullscreen ? "100%" : "auto",
          height: isFullscreen ? "100%" : "auto",
          margin: isFullscreen ? 0 : 2,
        },
      }}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <DialogContent
        sx={{
          p: 0,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          backgroundColor: "transparent",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            background: "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: 600,
              maxWidth: "60%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {productName}
          </Typography>
          
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              sx={{ color: "white" }}
              size="small"
            >
              <ZoomOut />
            </IconButton>
            
            <IconButton
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              sx={{ color: "white" }}
              size="small"
            >
              <ZoomIn />
            </IconButton>
            
            <IconButton
              onClick={toggleFullscreen}
              sx={{ color: "white" }}
              size="small"
            >
              <Fullscreen />
            </IconButton>
            
            <IconButton
              onClick={onClose}
              sx={{ color: "white" }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress sx={{ color: "white" }} size={60} />
            <Typography variant="body2" sx={{ color: "white" }}>
              Loading images...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        ) : images.length === 0 ? (
          <Typography variant="body1" sx={{ color: "white", textAlign: "center" }}>
            No images available for this product
          </Typography>
        ) : (
          <>
            {/* Main Image */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {imageLoading && (
                <CircularProgress
                  sx={{
                    position: "absolute",
                    color: "white",
                    zIndex: 5,
                  }}
                />
              )}
              
              <Card
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  transform: `scale(${zoom})`,
                  transition: "transform 0.2s ease-in-out",
                  cursor: zoom > 1 ? "grab" : "auto",
                }}
              >
                <CardMedia
                  component="img"
                  image={images[currentIndex]}
                  alt={`${productName} - Image ${currentIndex + 1}`}
                  onLoad={handleImageLoad}
                  onLoadStart={handleImageLoadStart}
                  sx={{
                    maxWidth: isMobile ? "90vw" : "80vw",
                    maxHeight: isMobile ? "60vh" : "70vh",
                    objectFit: "contain",
                    borderRadius: 2,
                  }}
                />
              </Card>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <IconButton
                    onClick={handlePrevious}
                    sx={{
                      position: "absolute",
                      left: 16,
                      color: "white",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                      },
                    }}
                    size="large"
                  >
                    <ArrowBackIos />
                  </IconButton>
                  
                  <IconButton
                    onClick={handleNext}
                    sx={{
                      position: "absolute",
                      right: 16,
                      color: "white",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                      },
                    }}
                    size="large"
                  >
                    <ArrowForwardIos />
                  </IconButton>
                </>
              )}
            </Box>

            {/* Image Counter and Thumbnails */}
            {images.length > 1 && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 2,
                  background: "linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {/* Image Counter */}
                <Typography
                  variant="body2"
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  {currentIndex + 1} of {images.length}
                </Typography>

                {/* Thumbnail Navigation */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    overflowX: "auto",
                    maxWidth: "100%",
                    pb: 1,
                    "&::-webkit-scrollbar": {
                      height: 4,
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: 2,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                      borderRadius: 2,
                    },
                  }}
                >
                  {images.map((image, index) => (
                    <Box
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      sx={{
                        width: 60,
                        height: 60,
                        minWidth: 60,
                        border: currentIndex === index ? "2px solid white" : "2px solid transparent",
                        borderRadius: 1,
                        overflow: "hidden",
                        cursor: "pointer",
                        opacity: currentIndex === index ? 1 : 0.6,
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          opacity: 1,
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImagePopup;
