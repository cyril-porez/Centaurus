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
	r := gin.Default();

	r.Use(cors.Default());

	//route Swagger
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler));

	//route api
	r.POST("api/v1/auth/sign-up", func(c *gin.Context) {
		handlers.RegisterHandler(c, db);
	})
	r.POST("api/v1/auth/sign-in", func(c *gin.Context) {
		handlers.SignInHandler(c, db);
	})

	r.POST("api/v1/horses", func(c *gin.Context) {
		handlers.AddHorseHandler(c, db);
	})
	r.GET("api/v1/users/:id/horses", func(c *gin.Context) {
		id := c.Param("id") 
		handlers.GetHorsesByUserHanndler(c, db, id);
	})
	r.PUT("api/v1/horses/:id", func(c *gin.Context) {
		id := c.Param("id");
		handlers.UpdateHorseHandler(c, db, id);
	})  
	r.GET("api/v1/horses/:id", func(c *gin.Context) {
		id := c.Param("id");
		handlers.GetHorseHandler(c, db, id);
	})
	r.DELETE("api/v1/horses/:id", func(c *gin.Context) {
			id := c.Param("id")
			handlers.DeleteHorseHandler(c, db, id);
	})

	r.POST("api/v1/horses/:id/weights", func(c *gin.Context) {
		id := c.Param("id");
		handlers.AddWeight(c, db, id);
	})

	r.GET("api/v1/horses/:id/weights", func(c *gin.Context) {
		id := c.Param("id")
		limit := c.DefaultQuery("limit", "")
		sort := c.DefaultQuery("sort", "asc")
		compare:= c.DefaultQuery("compare", "false")

		handlers.GetHoreseWeights(c, db, id,limit, sort, compare)
	})
	
	//route de teste
	r.GET("api/ping", handlers.PingHandler);

	return r
}