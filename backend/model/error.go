package model

type ErrorDetail struct {
	Field string `json:"field"`
	Issue string `json:"issue"`
}

type ErrorResponse struct {
	Code    int               `json:"code"`
	Status  string            `json:"status"`
	Message string            `json:"message"`
	Details []ErrorDetail     `json:"details"`
	Meta    map[string]string `json:"meta"`
	Links   interface{}       `json:"links"`
}

type ErrorResponseInput struct {
	StatusCode int               `json:"-"`
	Message    string            `json:"message"`
	Details    []ErrorDetail     `json:"details"`
	Meta       map[string]string `json:"meta,omitempty"`
	Links      interface{}       `json:"links,omitempty"`
}

