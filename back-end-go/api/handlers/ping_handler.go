package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

//PingHandler
//@Summary Ping
// @Description Respond with "pong"
// @Tags example
// @Produce json
// @Success 200 {string} string "pong"
// @Router /ping [get]
func PingHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status" : "ok",
		"code" : 200,
		"message": "pon",
	})
}
