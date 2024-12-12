package router

import (
	handlers "back-end-go/api/handlers"
	"database/sql"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func SetupRouter(db *sql.DB) *gin.Engine {
	r := gin.Default()

	//route Swagger
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	//route api
	r.POST("/register", func(c *gin.Context) {
		handlers.RegisterHandler(c, db)
	})
	r.GET("/ping", handlers.PingHandler)

	return r

}