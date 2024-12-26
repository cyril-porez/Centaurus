package utils

import (
	"github.com/gin-gonic/gin"
)

type Response struct {
	Status string `json: "status"`
	Message string `json: "message"`
	Data interface{} `json: "data, omitempy"`
}

func WriteSuccesResponse(c *gin.Context, statusCode int, message string, data interface{}) {
	c.JSON(statusCode, Response {
		Status: "succes",
		Message: message,
		Data: data,
	})
}