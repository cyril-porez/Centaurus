package utils

import (
	"time"

	"github.com/gin-gonic/gin"
)

func WriteSuccesResponse(c *gin.Context, statusCode int, resp interface{}) {
	c.JSON(statusCode, resp)
}

func GenerateMeta() map[string]string {
	return map[string]string{
		"timestamp": time.Now().Format(time.RFC3339),
	}
}

func HateoasLink(href, method string) map[string]interface{} {
	return map[string]interface{}{
		"self": gin.H{
			"href":   href,
			"method": method,
		},
	}
}