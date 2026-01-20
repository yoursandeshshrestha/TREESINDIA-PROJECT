package utils

import (
	"strconv"
	"strings"
)

// ImageTransformOptions defines options for image transformation
type ImageTransformOptions struct {
	Width   int
	Height  int
	Quality int
	Format  string // "auto", "webp", "jpg", "png"
	Crop    string // "fill", "fit", "scale", "limit"
}

// ImagePreset defines common image transformation presets
type ImagePreset string

const (
	PresetBanner         ImagePreset = "banner"          // For carousel banners
	PresetThumbnail      ImagePreset = "thumbnail"       // For service/property thumbnails
	PresetSmallThumbnail ImagePreset = "small_thumbnail" // For profile pics
	PresetIcon           ImagePreset = "icon"            // For category icons
	PresetFull           ImagePreset = "full"            // For full-size images
)

// GetPresetOptions returns the transformation options for a given preset
func GetPresetOptions(preset ImagePreset) ImageTransformOptions {
	presets := map[ImagePreset]ImageTransformOptions{
		PresetBanner: {
			Width:   800,
			Quality: 75,
			Format:  "auto",
			Crop:    "fill",
		},
		PresetThumbnail: {
			Width:   400,
			Quality: 75,
			Format:  "auto",
			Crop:    "fill",
		},
		PresetSmallThumbnail: {
			Width:   200,
			Quality: 75,
			Format:  "auto",
			Crop:    "fill",
		},
		PresetIcon: {
			Width:   120,
			Quality: 80,
			Format:  "auto",
			Crop:    "limit",
		},
		PresetFull: {
			Width:   1200,
			Quality: 85,
			Format:  "auto",
			Crop:    "limit",
		},
	}

	if opts, exists := presets[preset]; exists {
		return opts
	}
	// Default to thumbnail if preset not found
	return presets[PresetThumbnail]
}

// OptimizeCloudinaryImage adds transformation parameters to a Cloudinary URL
func OptimizeCloudinaryImage(url string, options ImageTransformOptions) string {
	if url == "" {
		return url
	}

	// Check if it's a Cloudinary URL
	if !strings.Contains(url, "cloudinary.com") {
		return url
	}

	// Find the /upload/ part
	uploadIndex := strings.Index(url, "/upload/")
	if uploadIndex == -1 {
		return url
	}

	// Build transformation string
	var transforms []string

	if options.Width > 0 {
		transforms = append(transforms, "w_"+strconv.Itoa(options.Width))
	}
	if options.Height > 0 {
		transforms = append(transforms, "h_"+strconv.Itoa(options.Height))
	}
	if options.Quality > 0 {
		transforms = append(transforms, "q_"+strconv.Itoa(options.Quality))
	}
	if options.Format != "" {
		transforms = append(transforms, "f_"+options.Format)
	}
	if options.Crop != "" {
		transforms = append(transforms, "c_"+options.Crop)
	}

	if len(transforms) == 0 {
		return url
	}

	transformString := strings.Join(transforms, ",")

	// Insert transformations after /upload/
	baseURL := url[:uploadIndex+8] // includes '/upload/'
	restURL := url[uploadIndex+8:]

	return baseURL + transformString + "/" + restURL
}

// OptimizeCloudinaryImageWithPreset applies a preset to a Cloudinary URL
func OptimizeCloudinaryImageWithPreset(url string, preset ImagePreset) string {
	options := GetPresetOptions(preset)
	return OptimizeCloudinaryImage(url, options)
}

// OptimizeImageArray optimizes an array of image URLs
func OptimizeImageArray(images []string, options ImageTransformOptions) []string {
	optimized := make([]string, len(images))
	for i, img := range images {
		optimized[i] = OptimizeCloudinaryImage(img, options)
	}
	return optimized
}

// OptimizeImageArrayWithPreset optimizes an array of images with a preset
func OptimizeImageArrayWithPreset(images []string, preset ImagePreset) []string {
	options := GetPresetOptions(preset)
	return OptimizeImageArray(images, options)
}
