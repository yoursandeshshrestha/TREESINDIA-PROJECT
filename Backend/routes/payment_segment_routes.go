package routes

import (
	"treesindia/controllers"
	"treesindia/middleware"
	"treesindia/services"

	"github.com/gin-gonic/gin"
)

func SetupPaymentSegmentRoutes(router *gin.RouterGroup, enhancedNotificationService *services.EnhancedNotificationService) {
	paymentSegmentController := controllers.NewPaymentSegmentController(enhancedNotificationService)

	// Payment segment routes (user authenticated)
	paymentSegmentRoutes := router.Group("/bookings/:id/payment-segments")
	paymentSegmentRoutes.Use(middleware.AuthMiddleware())
	{
		// Get all payment segments and progress
		paymentSegmentRoutes.GET("", paymentSegmentController.GetPaymentSegments)
		
		// Get pending segments
		paymentSegmentRoutes.GET("/pending", paymentSegmentController.GetPendingSegments)
		
		// Get paid segments
		paymentSegmentRoutes.GET("/paid", paymentSegmentController.GetPaidSegments)
		
		// Pay for a specific segment
		paymentSegmentRoutes.POST("/pay", paymentSegmentController.PaySegment)
		
		// Verify segment payment
		paymentSegmentRoutes.POST("/verify", paymentSegmentController.VerifySegmentPayment)
	}
}
