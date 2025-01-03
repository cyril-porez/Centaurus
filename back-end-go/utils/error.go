package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
	// "encoding/json"
)

type ErrorDetail struct {
	Field string `json: "field"`
	Issue string `json: "issue"`
}

type ErrorResponse struct {
	Status int `json: "status"`
	Error string `json: "error"`
	Message string `json: "message"`
	Details []ErrorDetail `json: "details"`
}

func WriteErrorResponse(c *gin.Context, status int, message string, details []ErrorDetail) {
	errorResponse := ErrorResponse{
		Status: status,
		Error: http.StatusText(status),
		Message: message,
		Details: details,
	}
	c.JSON(status, errorResponse)
}