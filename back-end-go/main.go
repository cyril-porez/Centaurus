package main

import (
	_ "back-end-go/docs"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

//PingHandler
//@Summary Ping
// @Description Respond with "pong"
// @Tags example
// @Produce json
// @Success 200 {string} string "pong"
// @Router /ping [get]
func PingHandler(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "pong",
	})
}

func  main()  {
	r := gin.Default();

	//route Swagger
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	//route api
	r.GET("/ping", PingHandler)
	r.GET("/user/:id", func(c *gin.Context) {

	})

	r.Run()
}