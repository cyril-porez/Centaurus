package utils

import (
	"back-end-go/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func WriteErrorResponse(c *gin.Context, statusCode int, message string, input model.ErrorResponseInput) {
	errorResponse := model.ErrorResponse{
		Code: statusCode,
		Status: http.StatusText(statusCode),
		Message: message,
		Details: input.Details,
		Meta: input.Meta,
		Links: input.Links,
		
	}
	c.JSON(statusCode, errorResponse)
}

func AddErrorDetail(details *[]model.ErrorDetail, field string, issue string) {
  *details = append(*details, model.ErrorDetail{
		Field: field,
		Issue: issue,
	})
}

