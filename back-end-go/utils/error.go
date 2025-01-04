package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type ErrorHeader struct {
	Code 		int 		`json:"status"`
	Status 	string	`json:"error"`
	Message string 	`json:"message"`
}

type ErrorBody struct {
	Details	[]ErrorDetail 		`json:"details"`
	Meta 		map[string]string `json:"meta"`
	Links 	interface{} 			`json:"links"`
}

type ErrorDetail struct {
	Field string `json:"field"`
	Issue string `json:"issue"`
}

type ErrorResponse struct {
	Header	ErrorHeader	`json:"header"`
	Body		ErrorBody		`json:"body"`
}

type ErrorResponseInput struct {
	StatusCode	int								`json:"-"`
	Message			string						`json:"message"`
	Details			[]ErrorDetail			`json:"details"`
	Meta				map[string]string	`json:"meta,omitempty"`
	Links				interface{} 			`json:"links,omitempty"`
}

func WriteErrorResponse(c *gin.Context, statusCode int, message string, input ErrorResponseInput) {
	errorResponse := ErrorResponse{
		Header: ErrorHeader{
			Status: http.StatusText(statusCode),
			Code: statusCode,
			Message: message,
		},
		Body: ErrorBody{
			Details: input.Details,
			Meta: input.Meta,
			Links: input.Links,
		},
	}
	c.JSON(statusCode, errorResponse)
}

func AddErrorDetail(details *[]ErrorDetail, field string, issue string) {
  *details = append(*details, ErrorDetail{
		Field: field,
		Issue: issue,
	})
}