package router

import (
	handlers "back-end-go/api/handlers"
	"back-end-go/repository"
	"back-end-go/service"
	"database/sql"
	"time"

	middleware "back-end-go/api/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func SetupRouter(db *sql.DB) *gin.Engine {
	r := gin.Default();

	cfg := cors.Config{
    // ⚠️ mets ici exactement l’origine de ton front
    // (pas de "*"). En dev vite/CRA: http://localhost:5173 ou 3000
    AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000"},
    AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "X-CSRF-Token"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true, // indispensable pour cookies
    MaxAge:           12 * time.Hour,
  }

	r.Use(cors.New(cfg))
	// r.Use(cors.Default());

	horseRepo := &repository.SQLHorseRepository{}
	horseService := service.NewHorseService(horseRepo)

	weightRepo := &repository.SQLWeightRepository{}
	weightService := service.NewWeightService(weightRepo)

	userRepo := &repository.SQLUserRepository{}
	userService := service.NewUserService(userRepo)

	//route de teste
	r.GET("/api/ping", handlers.PingHandler);

	//route Swagger
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler));

	//Auth route (publiques)
	r.POST("/api/v1/auth/sign-up", func(c *gin.Context) {
		handlers.RegisterHandler(c, db, userService);
	})
	r.POST("/api/v1/auth/sign-in", func(c *gin.Context) {
		handlers.SignInHandler(c, db, userService);
	})

	r.POST("/api/v1/auth/refresh", func(c *gin.Context) {
		handlers.RefreshHandler(c)
	})

	r.POST("/api/v1/auth/logout", func(c *gin.Context) {
		handlers.LogoutHandler(c)
	})


	//Middleware d'authentification
	authMiddleware := middleware.AuthMiddleware()

	api := r.Group("/api/v1")
	api.Use(authMiddleware)

	api.POST("/horses", func(c *gin.Context) {
		handlers.AddHorseHandler(c, db, horseService);
	})

	api.GET("/users/:id/horses", func(c *gin.Context) {
		handlers.GetHorsesByUserHanndler(c, db, horseService);
	})

	api.PUT("/horses/:id", func(c *gin.Context) {
		handlers.UpdateHorseHandler(c, db, horseService);
	})  

	api.GET("/horses/:id", func(c *gin.Context) {
		handlers.GetHorseHandler(c, db, horseService);
	})

	api.DELETE("/horses/:id", func(c *gin.Context) {
			handlers.DeleteHorseHandler(c, db, horseService);
	})

	api.POST("/horses/:id/weights", func(c *gin.Context) {
		handlers.AddWeight(c, db, weightService);
	})

	api.GET("/horses/:id/weights", func(c *gin.Context) {
		handlers.GetHoreseWeights(c, db, weightService)
	})
	
	
	

	return r
}