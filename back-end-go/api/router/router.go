package router

import (
	handlers "back-end-go/api/handlers"
	"database/sql"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func SetupRouter(db *sql.DB) *gin.Engine {
	r := gin.Default()

	r.Use(cors.Default())

	//route Swagger
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	//route api
	r.POST("api/v1/auth/sign-up", func(c *gin.Context) {
		handlers.RegisterHandler(c, db)
	})
	r.POST("api/v1/auth/sign-in", func(c *gin.Context) {
		handlers.SignInHandler(c, db)
	})
	r.POST("api/v1/horses/add-horse", func(c *gin.Context) {
		handlers.AddHorseHandler(c, db)
	})
	
	//route de teste
	r.GET("api/ping", handlers.PingHandler)

	return r

}