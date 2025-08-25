package utils

import (
	"back-end-go/model"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func GetUserIDFromContext(c *gin.Context) (int, bool) {
	userIDAny, exists := c.Get("userID")
	if !exists {
		WriteErrorResponse(c, http.StatusUnauthorized, "Unauthorized access", model.ErrorResponseInput{
			Meta: map[string]string{"timestamp": time.Now().Format(time.RFC3339)},
			Links: gin.H{"self": c.FullPath(), "method": c.Request.Method},
		})
		return 0, false
	}

	userID, ok := userIDAny.(int)
	if !ok {
		WriteErrorResponse(c, http.StatusInternalServerError, "Invalid user ID format", model.ErrorResponseInput{
			Meta: map[string]string{"timestamp": time.Now().Format(time.RFC3339)},
			Links: gin.H{"self": c.FullPath(), "method": c.Request.Method},
		})
		return 0, false
	}

	return userID, true
}
