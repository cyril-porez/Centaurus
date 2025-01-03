package utils

import (
	"github.com/gin-gonic/gin"
)

type Response struct {
  Header ResponseHeader `json: "header"`
	Body interface{} `json:"body"`
}

type ResponseHeader struct {
	Status string `json: "status"`
	Code int `json: "code"`
	Message string `json: "message"`
}

func WriteSuccesResponse(c *gin.Context, statusCode int, message string, body interface{}) {
	response := Response{
		Header: ResponseHeader{
			Status: "success",
			Code: statusCode,
			Message: message,
		},

		Body: body,
	}
	c.JSON(statusCode, response)
}